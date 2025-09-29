import { KeycloakAdminClient as KcAdminClient } from "@s3pweb/keycloak-admin-client-cjs";
import config from "../../config";
class KeyCloakAdmin {
  public client: KcAdminClient;
  constructor() {
    this.client = new KcAdminClient({
      baseUrl: `${config.keycloakBaseUrl}`,
      realmName: `${config.realm}`,
    });
    this.client;
  }
  async authenticateAdmin() {
    await this.client.auth({
      clientId: "s2m_server",
      grantType: "client_credentials",
      clientSecret: config.clientSecret,
    });
  }
}
const kcAdminClient = new KeyCloakAdmin();
export default kcAdminClient;
