import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "merimerimeri-com",
    "compatibilityDate": "2026-10-23",
    "domains": ["merimerimeri.com"],
    "assets": {
      "notFoundHandling": "404-page"
    },
    "observability": {
      "enabled": true
    }
  }
});
