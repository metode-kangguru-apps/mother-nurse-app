/// <reference path="./.sst/platform/config.d.ts" />

// ponytail: static SPA on S3 + CloudFront. No Lambda — Firebase is the backend,
// the browser talks to it directly. This just hosts the built web bundle.
export default $config({
  app(input) {
    return {
      name: "mother-nurse-app",
      // Keep real, long-lived stages' resources on teardown; drop throwaway ones.
      removal: ["production", "staging"].includes(input?.stage ?? "")
        ? "retain"
        : "remove",
      home: "aws",
      // ponytail: Singapore, closest to ID. CloudFront is global regardless, so
      // this only affects where the origin S3 bucket lives. Change if you like.
      providers: { aws: { region: "ap-southeast-1" } },
    };
  },
  async run() {
    const web = new sst.aws.StaticSite("Web", {
      // Expo SDK 47 web build. Reads env from a .env file at build time via
      // react-native-dotenv, so `.env` must exist when this runs (CI writes it).
      build: {
        command: "npm run build:web",
        output: "web-build",
      },
      // SPA: serve index.html for unknown paths so client-side routing works.
      errorPage: "redirect_to_index_page",
    });
    return { url: web.url };
  },
});
