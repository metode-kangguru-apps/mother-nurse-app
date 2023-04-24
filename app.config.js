module.exports = {
  web: {
    build: {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  },
};
