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
          logout: {
            path: "/logout",
          },
        },
      },
    },
  },
};

export default linking;
