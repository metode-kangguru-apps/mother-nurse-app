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
          logout: {
            path: "/logout",
          },
          "register-user-information": {
            path: "/register-user-information",
          },
        },
      },
      mother: {
        path: "/mother",
        screens: {
          "select-baby": {
            path: "/select-baby",
          },
          home: {
            path: "/:baby-id",
          },
        },
      },
    },
  },
};

export default linking;
