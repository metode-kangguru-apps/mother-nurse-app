const linking = {
    prefixes: ['https://localhost:8000/', 'myapps://'],
    config: {
      screens: {
        "auth": {
          path: '',
          screens: {
            "login": {
              path: ''
            },
            "register-user-information": {
              path: 'register-user-information',
            },
            "logout": {
              path: 'logout'
            },
          }
        },
        "mother": {
          path: 'mother',
          screens: {
            "list-note": {
              path: ''
            },
            "add-note": {
              path: 'add-note'
            }
          }
        }
      },
    },
  };

export default linking