
// config/plugins.js
module.exports = { // khac
    email: {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: process.env.SENDGRID_API_KEY,
        },
        settings: {
          defaultFrom: 'tieuhoangdat@gmail.com',
          defaultReplyTo: 'tieuhoangdat@gmail.com',
        },
      },
    },
  };
  