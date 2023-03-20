const linking = {
    prefixes: ['localhost:19006/', 'myapps://'],
    config: {
      screens: {
        "auth": {
          path: "",
          screens: {
            "login": {
              path: "/"
            },
            "logout": {
              path: "/logout"
            },
            "register-user-information": {
              path: "/register-user-information"
            }
          }
        },
        "mother": {

        }
      },
    },
  };

export default linking