const linking = {
  prefixes: ["localhost:19006/", "myapps://"],
  config: {
    screens: {
      auth: {
        path: "",
        screens: {
          login: {
            path: "/",
          },
          "register-user-information": {
            path: "/register-user-information",
          },
          "register-baby-information": {
            path: "/register-baby-information",
          },
        },
      },
      mother: {
        path: "/mother",
        screens: {
          home: {
            path: "/",
          },
          "select-baby": {
            path: "/select-baby",
          },
          profile: {
            path: "/profile",
          },
          monitoring: {
            path: "/monitoring"
          }
        },
      },
    },
  },
};

export default linking;
