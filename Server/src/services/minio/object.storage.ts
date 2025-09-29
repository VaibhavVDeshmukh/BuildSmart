/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BucketItem, Client as MinioClient } from "minio";
import { Readable } from "stream";
import { BlobSASPermissions, BlobServiceClient, ContainerItem, logger, Metadata } from "@azure/storage-blob";
import config from "../../config";
import axios from "axios";
import fs from "fs";
import path from "path";
import https from "node:https";

type TODO = any;

export interface Storage {
  createBucket(bucketName: string): Promise<void>;
  deleteBucket(bucketName: string): Promise<void>;
  fPutObject(bucketName: string, objectName: string, filePath: string, metaData?: ImportMeta | Metadata): Promise<void>;
  putObject(): void;
  getObject(bucketName: string, objectName: string): Promise<Readable>;
  deleteObject(bucketName: string, objectName: string): Promise<void>;
  removeObject(): void;
  /**
   *
   * @param bucketName
   * @param objectString
   * @param exp Time in hour
   */
  preSignedUrl(bucketName: string, objectString: string, exp?: number): Promise<string>;
  bucketList(): Promise<TODO>;
  objectExist(bucketName: string, objectName: string): Promise<boolean>;
  bucketExists(bucketName: string): Promise<boolean>;
  objectList(bucketName: string, prefix?: string): Promise<BucketItem[] | ContainerItem[]>;
  healthCheck(): Promise<boolean>;
  createAndUploadFolder(bucketName: string, folderPath: string, folderId: string): Promise<void>;
  isNotfoundError: (error: any) => boolean;
  /**
   *
   * @param exp in seconds
   */
  preSignedUploadUrl(bucketName: string, objectName: string, exp?: number): Promise<string>;
  statObject(bucketName: string, objectName: string): Promise<any | null>;
}

const agent = new https.Agent({
  rejectUnauthorized: !config.selfSignedSSl,
});

const minioHealthCheckUrl = `${config.selfSignedSSl ? "https" : "http"}://${config.minioEndpoint}:${config.minioPort}/minio/health/ready`;
class MinioStorage implements Storage {
  minio: MinioClient;
  public constructor() {
    this.minio = new MinioClient({
      endPoint: config.minioEndpoint,
      port: config.minioPort,
      useSSL: config.selfSignedSSl,
      accessKey: config.minioAccess,
      secretKey: config.minioSecret,
    });
  }
  async healthCheck(): Promise<boolean> {
    try {
      const agenHeaders = config.selfSignedSSl ? { httpsAgent: agent } : {};
      const resp = await axios.get(minioHealthCheckUrl, agenHeaders);
      if (resp.status >= 200 && resp.status <= 400) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      // logger.error("Storage in not healthy", error);
      return false;
    }
  }
  async createBucket(bucketName: string): Promise<void> {
    await this.minio.makeBucket(bucketName);
  }
  async bucketList(): Promise<TODO> {
    return await this.minio.listBuckets();
  }
  async deleteBucket(bucketName: string): Promise<void> {
    await this.minio.removeBucket(bucketName);
  }
  async fPutObject(bucketName: string, objectName: string, filePath: string, metaData?: Metadata | ImportMeta): Promise<void> {
    if (metaData) {
      await this.minio.fPutObject(bucketName, objectName, filePath, metaData);
      return;
    }
    await this.minio.fPutObject(bucketName, objectName, filePath);
  }
  async getObject(bucketName: string, objectName: string): Promise<Readable> {
    const stream = await this.minio.getObject(bucketName, objectName);
    return stream;
  }
  async deleteObject(bucketName: string, objectName: string): Promise<void> {
    await this.minio.removeObject(bucketName, objectName);
  }
  async preSignedUrl(bucketName: string, objectString: string, exp?: number): Promise<string> {
    let expiration;
    if (exp) {
      expiration = exp * 60 * 60;
      return await this.minio.presignedGetObject(bucketName, objectString, expiration);
    }
    return await this.minio.presignedGetObject(bucketName, objectString);
  }
  putObject(): void {}
  removeObject(): void {}
  async objectExist(bucketName: string, objectName: string): Promise<boolean> {
    try {
      const item = await this.minio.statObject(bucketName, objectName);
      return !!item;
    } catch (error) {
      return false;
    }
  }
  async statObject(bucketName: string, objectName: string): Promise<any | null> {
    try {
      const item = await this.minio.statObject(bucketName, objectName);
      return item;
    } catch (error) {
      return null;
    }
  }
  async bucketExists(bucketName: string): Promise<boolean> {
    return await this.minio.bucketExists(bucketName);
  }
  async objectList(bucketName: string, prefix?: string | undefined): Promise<BucketItem[] | ContainerItem[]> {
    const bucketExist = await this.minio.bucketExists(bucketName);
    const itemList: BucketItem[] = [];
    return new Promise((resolve, reject) => {
      if (!bucketExist) resolve(itemList);
      const stream = this.minio.listObjectsV2(bucketName, prefix, true);
      stream.on("data", (item) => itemList.push(item));
      stream.on("error", (err) => {
        reject(err);
      });
      stream.on("end", () => {
        resolve(itemList);
      });
    });
  }
  isNotfoundError(error: TODO) {
    return error?.code === "NoSuchKey";
  }
  async preSignedUploadUrl(buketName: string, objectName: string, exp = 600) {
    const url = await this.minio.presignedPutObject(buketName, objectName, exp);
    return url;
  }

  async createAndUploadFolder(bucketName: string, folderPath: string, folderId: string): Promise<void> {
    try {
      const files = fs.readdirSync(folderPath);
      if (!files) {
        console.log(`No Data Present at "${folderPath}"`);
        throw new Error("No Data Present");
      }
      const bucketExist = await this.minio.bucketExists(bucketName);
      if (!bucketExist) throw new Error("Bucket Not Found");
      for (const file of files) {
        const filePath = path.join(folderPath, file);

        if (fs.statSync(filePath).isFile()) {
          await this.minio.fPutObject(bucketName, `${folderId}/${file}`, filePath);
        }
      }
      console.log(`Data uploaded from "${folderPath}" to bucket:"${bucketName} "folderid:"${folderId}"`);
    } catch (err) {
      console.error("Error uploading folder contents:", err);
      logger.error("Error uploading folder contents:", err);
    }
  }
}
const commonContainer = "common";
class AzzureStorage implements Storage {
  client: BlobServiceClient;
  constructor() {
    this.client = BlobServiceClient.fromConnectionString(config.azureObjectConString);
  }
  async statObject(bucketName: string, objectName: string): Promise<any | null> {
    try {
      const container = this.client.getContainerClient(bucketName);
      const blobClient = container.getBlobClient(objectName);
      const properties = await blobClient.getProperties();
      return properties;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
  async healthCheck(): Promise<boolean> {
    try {
      const containerClient = this.client.getContainerClient(commonContainer);

      const containerExist = await containerClient.createIfNotExists();
      return !!containerExist;
    } catch (error) {
      return false;
    }
  }
  async createAndUploadFolder(): Promise<void> {}
  async bucketList(): Promise<TODO> {}
  async createBucket(bucketName: string): Promise<void> {
    const container = this.client.getContainerClient(bucketName);
    await container.createIfNotExists();
  }

  async deleteBucket(bucketName: string): Promise<void> {
    const container = this.client.getContainerClient(bucketName);

    container.delete();
  }
  async deleteObject(bucketName: string, objectName: string): Promise<void> {
    const container = this.client.getContainerClient(bucketName);
    const blobClient = container.getBlobClient(objectName);
    blobClient.deleteIfExists();
  }
  async fPutObject(bucketName: string, objectName: string, filePath: string, metaData?: Metadata): Promise<void> {
    const container = this.client.getContainerClient(bucketName);
    const blobClient = container.getBlockBlobClient(objectName);
    if (metaData) blobClient.setMetadata(metaData);
    await blobClient.uploadFile(filePath);
  }
  async getObject(bucketName: string, objectName: string): Promise<Readable> {
    const container = this.client.getContainerClient(bucketName);
    const blobClient = container.getBlobClient(objectName);
    const stream = await blobClient.download();
    // @ts-ignore
    return stream.readableStreamBody;
  }
  async preSignedUrl(bucketName: string, objectString: string, exp?: number): Promise<string> {
    const container = this.client.getContainerClient(bucketName);
    const blobClient = container.getBlobClient(objectString);
    const currentTime = new Date();

    // Calculate the expiration time in milliseconds
    const delta = exp ? exp : 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    // Add 5 hours and 30 minutes to the current time to convert it to IST
    const expirationTime = new Date(currentTime.valueOf() + delta);

    const url = await blobClient.generateSasUrl({
      // TODO change this roles and permissions
      permissions: BlobSASPermissions.parse("racwd"),
      // expiresOn: new Date(new Date().valueOf() + 60000),
      expiresOn: expirationTime,
    });
    return url;
  }
  putObject(): void {}
  removeObject(): void {}
  async objectExist(bucketName: string, objectName: string): Promise<boolean> {
    const container = this.client.getContainerClient(bucketName);
    const blobClient = container.getBlobClient(objectName);
    return await blobClient.exists();
  }
  async bucketExists(bucketName: string): Promise<boolean> {
    const container = await this.client.getContainerClient(bucketName);
    return await container.exists();
  }
  async objectList(bucketName: string, prefix?: string | undefined): Promise<BucketItem[] | ContainerItem[]> {
    const container = this.client.getContainerClient(bucketName);
    const list: ContainerItem[] = [];
    if (!container.exists) return [];
    const blobClient = container.listBlobsFlat({
      prefix,
    });
    for await (const item of blobClient) {
      list.push(item);
    }
    return list;
  }
  isNotfoundError(error: TODO) {
    return error?.statusCode === 404;
  }
  async preSignedUploadUrl(buketName: string, objectName: string, exp = 600) {
    const container = this.client.getContainerClient(buketName);
    const blob = container.getBlobClient(objectName);
    const expiresOn = new Date();
    expiresOn.setSeconds(expiresOn.getSeconds() + exp);
    const url = await blob.generateSasUrl({
      permissions: BlobSASPermissions.parse("w"),
      expiresOn,
    });
    return url;
  }
}

const objectStorage = config.storageProvider === "AZURE" ? new AzzureStorage() : new MinioStorage();

export default objectStorage;
