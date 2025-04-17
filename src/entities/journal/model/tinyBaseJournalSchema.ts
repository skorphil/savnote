export const tinyBaseJournalSchema = {
  "institutions": {
    "date": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "country": {
      "type": "string"
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
