import { mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const folderName = `temp/${v4()}`;
    const folderName = path.join(process.cwd(), "temp", v4());
    // mkdir(`${folderName}`, () => {});
    try {
      mkdirSync(folderName, { recursive: true }); // Ensure the folder is created
      cb(null, folderName); // Pass the folder name to multer
    } catch (error) {
      console.log(error);
      cb(error as Error, ""); // Pass the error to multer
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
export default upload;
