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
          "register-nurse-information": {
            path: "/register-nurse-information",
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
          "add-new-baby": {
            path: "/add-new-baby"
          },
          profile: {
            path: "/profile",
          },
          monitoring: {
            path: "/monitoring",
          },
          "add-progress": {
            path: "/add-baby-progress",
          },
          "pmk-care": {
            path: "/pmk-care",
          },
          history: {
            path: "/history",
          },
          module: {
            path: "/module",
          },
        },
      },
      nurse: {
        path: "/nurse",
        screens: {
          profile: {
            path: ""
          },
          'mother-detail': {
            path: "/mother/detail"
          }
        }
      },
      NotFound: "*",
    },
  },
};

export default linking;
