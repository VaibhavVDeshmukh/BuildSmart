const { execSync } = require("child_process");
const fs = require("node:fs");
const path = require("path");
const binDir = path.join(__dirname, "bin");
const startTime = Date.now();

function cleanBinFolder(binDir) {
  try {
    console.log("🧹 Cleaning the bin directory...");

    if (fs.existsSync(binDir)) {
      fs.rmSync(binDir, { recursive: true });
      fs.mkdirSync(binDir, { recursive: true });
      // rimraf.sync(binDir); // Delete the entire bin directory
      console.log("✅ Bin directory cleaned.");
    } else {
      console.log("ℹ️ Bin directory doesn't exist, nothing to clean.");
    }
  } catch (error) {
    console.error("❌ Error while creating bin dir.");
    console.log("Error details:", error);
    process.exit(1);
  }
}

const copyDirSync = (src, dest) => {
  try {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error("❌ Error while copying files.");
    console.log("⚠️ Please make sure the source directory exists or check the permissions.");
    console.error("Error details:", error);
    process.exit(1);
  }
};
function createZip(outputDir, zipPath) {
  try {
    const archiver = require("archiver");
    const files = fs.readdirSync(outputDir, { recursive: true });

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);

    files.forEach((filename) => {
      archive.file(path.join(__dirname, "bin", filename), { name: filename });
    });

    archive.finalize();

    archive.on("end", () => {
      console.log("✅ Zip file created successfully.");
    });

    archive.on("error", (err) => {
      console.error("❌ Error while creating the zip file.");
      console.log("⚠️ Please try creating the zip file manually or rerun the build script.");
      console.error("Error details:", err);
      process.exit(1); // Optionally exit the process on error
    });
    archive.on("warning", function (err) {
      if (err.code === "ENOENT") {
        // log warning
        console.warn(err);
      } else {
        // throw error
        throw err;
      }
    });
  } catch (err) {
    console.error("❌ Error while creating the zip file.");
    console.log("⚠️ Please try creating the zip file manually or rerun the build script.");
    console.error("Error details:", err);
    process.exit(1); // Exit the process on error
  }
}

function buildApp() {
  try {
    // Example of checking Node version (and exiting if below required version)
    const nodeVersion = process.version.slice(1).split(".");
    if (parseInt(nodeVersion[0]) < 18 || (parseInt(nodeVersion[0]) === 18 && parseInt(nodeVersion[1]) < 5)) {
      console.error("❌ Node.js version must be at least 18.5.0.");
      console.error(`Current version: ${process.version}`);
      process.exit(1); // Exit if the version is not sufficient
    }

    // Check if node_modules exist, if not run npm install
    if (!fs.existsSync("./node_modules")) {
      console.log("🔧 Dependencies not found. Installing dependencies...");
      execSync("npm install", { stdio: "inherit" });
    }
    const srcDir = path.join(__dirname, "src", "generated");
    const destDir = path.join(__dirname, "bin", "generated");
    require("dotenv").config();

    console.log("🚀 Starting build process...");
    if (!fs.existsSync(binDir)) {
      console.log("ℹ️ Bin directory not found. Attempting to create it...");
      try {
        console.log("Creating bin directory");
        fs.mkdirSync(binDir, { recursive: true });
        console.log("✅ Bin directory created successfully.");
      } catch (error) {
        console.error("❌ Failed to create the bin directory.");
        console.error("Please manually create the 'bin' folder and re-run the command: `npm run build:exe`");
        process.exit(1);
      }
    }
    const prismaGeneratedDir = fs.existsSync(srcDir);
    if (!prismaGeneratedDir) {
      try {
        console.log("🔄 Generating Prisma files automatically...");
        execSync("npx prisma generate", { stdio: "inherit" });
      } catch (error) {
        console.error("❌ Error generating Prisma files. Please try running 'npx prisma generate' manually.");
        process.exit(1);
      }
      console.log("✅ Prisma files generated successfully!");
    } else {
      const files = fs.readdirSync(srcDir);
      const hasPrismaFiles = files.some((file) => file.endsWith(".js") || file.endsWith(".d.ts"));
      if (!hasPrismaFiles) {
        try {
          console.log("🔄 Generating Prisma files automatically...");
          execSync("npx prisma generate", { stdio: "inherit" });
        } catch (error) {
          console.error("❌ Error generating Prisma files. Please try running 'npx prisma generate' manually.");
          process.exit(1);
        }
      }
      console.log("✅ Prisma files generated successfully!");
    }

    const version = process.env.Version || "0.0.1";
    const outputFileName = `s2m-support-server-v${version}.exe`;
    console.log(`Building executable: ${outputFileName}`);
    cleanBinFolder(binDir);
    // webpack --config webpack.config.js && pkg build/bundle.js --output ./bin/app-v0.0.1.exe --target node18-win-x64
    execSync(`webpack --config webpack.config.js && pkg build/bundle.js --output ./bin/${outputFileName} --target node18-win-x64`, { stdio: "inherit" });

    // Copy the generated files (e.g., Prisma generated files)

    copyDirSync(srcDir, destDir);

    // Zip the bin directory (optional step)
    const zipPath = path.join(__dirname, "bin", `s2m-support-server-v${version}.zip`);
    createZip(path.join(__dirname, "bin"), zipPath);

    // Indicate that the build process is complete
    console.log("🎉 Build complete!");
  } catch (err) {
    console.error("❌ An unexpected error occurred during the build process.");
    console.error("Error details:", err);
    process.exit(1);
  } finally {
  }
}
buildApp();

