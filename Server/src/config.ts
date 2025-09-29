import "dotenv/config";
import { z } from "zod";
import { fromError } from "zod-validation-error";
const storageProvider = z.enum(["AZURE", "S3", "MINIO"]);
type StorageProviderEnum = z.infer<typeof storageProvider>;
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  ACCOUNT_SERVICE_PORT: z.string({ message: "Missing valid port" }).transform((port) => parseInt(port)),
  ACCOUNT_SERVICE_DATABASE_URL: z.string({ message: "Missing db conn url" }),
  // IAM
  IAM_CLIENT_SECRET: z.string(),
  IP: z.string({ message: "No ip provided" }).default("localhost"),
  DOMAIN: z.string(),
  REALM: z.string(),
  MAILSERVER_URL: z.string(),
  INVITE_BASE_URL: z.string(),
  ABS_CONNECTION_STRING: z.string(),
  KEYCLOAK_BASE_URL: z.string(),
  ENABLE_SELF_SSL: z.string().transform((val) => val === "true"),
  SINGLE_USE_SECRET: z.string({ message: "Missing single use token secret" }),
  SUPPORT_APP_REALM: z.string({ message: "Missing Support App Realm" }),
  SUPPORT_APP_CLIENT_SECRET: z.string({ message: "Missing Support App client secret" }),
  // Storage config
  STORAGE_PROVIDER: storageProvider,
  MINIO_ENDPOINT_IP: z.string({ message: "Missing minio endpoint" }),
  MINIO_PORT: z.string({ message: "Missing minio port" }).transform((port) => parseInt(port)),
  MINIO_ACCESS_KEY: z.string({ message: "Missing minio access key" }),
  MINIO_SECRET_KEY: z.string({ message: "Missing minio secret key" }),
  SENTRY_DSN: z.string({ message: "Missing sentry dsn" }),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
});
export type ConfigType = {
  port: number;
  ip: string;
  domainName: string;
  realm: string;
  mailServerUrl: string;
  inviteBaseUrl: string;
  keycloakBaseUrl: string;
  selfSignedSSl: boolean;
  clientSecret: string;
  suJwtSecret: string;
  supportAppRealm: string;
  supportAppClientSecret: string;
  azureObjectConString: string;
  storageProvider: StorageProviderEnum;
  minioEndpoint: string;
  minioPort: number;
  minioAccess: string;
  minioSecret: string;
  sentryDsn: string;
  rabbitmqHost: string;
  rabbitmqUsername: string;
  rabbitmqPassword: string;
};
export default ((): ConfigType => {
  try {
    const envVars = envSchema.parse(process.env);
    return {
      port: envVars.ACCOUNT_SERVICE_PORT,
      ip: envVars.IP,
      domainName: envVars.DOMAIN,
      realm: envVars.REALM,
      mailServerUrl: envVars.MAILSERVER_URL,
      inviteBaseUrl: envVars.INVITE_BASE_URL,
      keycloakBaseUrl: envVars.KEYCLOAK_BASE_URL,
      selfSignedSSl: envVars.ENABLE_SELF_SSL,
      clientSecret: envVars.IAM_CLIENT_SECRET,
      suJwtSecret: envVars.SINGLE_USE_SECRET,
      supportAppRealm: envVars.SUPPORT_APP_REALM,
      supportAppClientSecret: envVars.SUPPORT_APP_CLIENT_SECRET,
      storageProvider: envVars.STORAGE_PROVIDER,
      minioEndpoint: envVars.MINIO_ENDPOINT_IP,
      minioPort: envVars.MINIO_PORT,
      minioAccess: envVars.MINIO_ACCESS_KEY,
      minioSecret: envVars.MINIO_SECRET_KEY,
      azureObjectConString: envVars.ABS_CONNECTION_STRING,
      sentryDsn: envVars.SENTRY_DSN,
      rabbitmqHost: envVars.RABBITMQ_HOST,
      rabbitmqUsername: envVars.RABBITMQ_USERNAME,
      rabbitmqPassword: envVars.RABBITMQ_PASSWORD,
    };
  } catch (error) {
    const validationErr = fromError(error);
    console.log(validationErr.toString());
    process.exit(1);
  }
})();
