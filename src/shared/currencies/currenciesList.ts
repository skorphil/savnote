import { currenciesByCode } from "./currenciesByCode";

export const currenciesList = Object.entries(currenciesByCode).map(
  ([code, nameEn]) => {
    return { code: code, en: nameEn };
  }
);
