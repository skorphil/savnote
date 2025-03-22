import PouchDb from "pouchdb-browser";
import type { AppConfigSchema1 } from "./appConfigSchema";
import { throwError } from "../../../../shared/lib/error-handling/throwError";

/**
 * Singleton app config instance
 */
export class AppConfig {
  static instance: AppConfig;
  docId = "appConfig";
  store: PouchDB.Database<AppConfigSchema1> = new PouchDb("AppConfig");

  constructor() {
    if (AppConfig.instance) return AppConfig.instance;
    AppConfig.instance = this;

    this.documentExists(this.docId)
      .then((isExist) => {
        if (isExist) return;
        const doc = {
          _id: "appConfig",
        };
        this.store.put(doc).catch((e) => throwError(e));
      })
      .catch((e) => throwError(e));
  }

  async updateConfig(properties: ConfigProperties) {
    const config = await this.store.get(this.docId);
    const updatedConfig = { ...config, ...properties };
    return this.store.put(updatedConfig);
  }

  getConfig() {
    return this.store.get(this.docId);
  }

  private async documentExists(docId: string): Promise<boolean> {
    try {
      await this.store.get(docId);
      return true;
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        "status" in e &&
        e.status === 404
      ) {
        return false;
      }
      throwError(e);
    }
  }
}

type ConfigProperties = Partial<AppConfigSchema1>;
