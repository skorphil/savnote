import type { PreferencesSchema1 } from "./preferencesSchema1";
import { preferencesStore } from "./PreferencesStore";

/**
 * Utility class to work with app preferences
 * @returns Singleton app config instance
 */
export class Preferences {
  static instance: Preferences;
  storeId = "preferences";
  store = preferencesStore;

  constructor() {
    if (Preferences.instance) return Preferences.instance;
    Preferences.instance = this;
  }

  updatePreferences(preferences: PreferencesProps) {
    const values = this.store.getValues();
    const updatedValues = { ...values, ...preferences };
    return this.store.setValues(updatedValues);
  }

  deleteValue(preference: keyof PreferencesProps) {
    return this.store.delValue(preference);
  }

  getPreferences(preferences: (keyof PreferencesProps)[]) {
    const preferenceValues: PreferencesProps = {};

    preferences.forEach((key) => {
      const value = this.store.getValue(key);
      preferenceValues[key] = value;
    });
    return preferenceValues;
  }
}

type PreferencesProps = Partial<PreferencesSchema1>;
