import { preferencesStore, usePreferenceValue } from "./PreferencesStore";
import type { PreferencesSchema1 } from "./preferencesSchema1";

/**
 * Utility class to work with app preferences
 * @example Preferences.getInstanse()
 * @returns Singleton app config instance
 */
export class Preferences {
	static instance: Preferences;
	storeId = "preferences";
	store = preferencesStore;

	private constructor() {
		Preferences.instance = this;
	}

	static getInstance(): Preferences {
		if (!Preferences.instance) {
			Preferences.instance = new Preferences();
		}
		return Preferences.instance;
	}

	updatePreferences(preferences: PreferencesProps) {
		const values = this.store.getValues();
		const updatedValues = { ...values, ...preferences };
		this.store.setValues(updatedValues);
	}

	deleteValue(preference: keyof PreferencesProps) {
		return this.store.delValue(preference);
	}

	getPreferences(preferences: (keyof PreferencesProps)[]) {
		const preferenceValues: PreferencesProps = {};

		for (const key of preferences) {
			const value = this.store.getValue(key);
			preferenceValues[key] = value;
		}
		return preferenceValues;
	}

	usePreferenceValue = usePreferenceValue;
}

type PreferencesProps = Partial<PreferencesSchema1>;
