// amplifyConfig.js

const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USERPOOLCLIENTID,
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOLID,
      },
    },
  };


export default amplifyConfig;
