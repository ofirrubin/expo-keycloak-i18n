import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: [
    "en",
    "he"
  ],
  extract: {
    input: "app/**/*.{js,jsx,ts,tsx}",
    output: "lib/locales/{{language}}/{{namespace}}.json"
  }
});