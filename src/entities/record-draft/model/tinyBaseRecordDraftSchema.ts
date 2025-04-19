/* 
DO NOT EDIT FILE 
This file is autogenerated with src/devScripts/generateTinyBaseSchemas.ts
*/

/**
 * Auto-generated tinyBase schema
 */
export const tinyBaseRecordDraftSchema = {
  "institutions": {
    "date": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "country": {
      "type": "string"
    },
    "isDirty": {
      "type": "boolean"
    }
  },
  "assets": {
    "date": {
      "type": "number"
    },
    "institution": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "amount": {
      "type": "number"
    },
    "currency": {
      "type": "string"
    },
    "isEarning": {
      "type": "boolean"
    },
    "description": {
      "type": "string"
    },
    "isDirty": {
      "type": "boolean"
    }
  },
  "quotes": {
    "date": {
      "type": "number"
    },
    "baseCurrency": {
      "type": "string"
    },
    "counterCurrency": {
      "type": "string"
    },
    "rate": {
      "type": "number"
    }
  }
} as const;
