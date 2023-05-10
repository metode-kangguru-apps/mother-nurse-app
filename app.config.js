module.exports = {
  expo: {
    name: "Hug-A-Baby",
    slug: "mother-nurse-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "hug-a-baby",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#4E9992",
    },
    ios: {
      bundleIdentifier: "com.pmk-app-dev.hug-a-baby",
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  },
  web: {
    build: {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  },
};
