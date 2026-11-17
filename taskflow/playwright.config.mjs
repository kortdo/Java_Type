import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4174";

export default defineConfig({
    testDir: "./tests",
    webServer: {
        command: "npm run dev -- --host 127.0.0.1 --port 4174 --strictPort",
        url: baseURL,
    },
    use: { baseURL, browserName: "chromium"},
});