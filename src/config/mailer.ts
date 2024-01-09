const brevoSmtpConfigFactory = async () => {
  return {
    transport: {
      host: process.env.BREVO_SERVER,
      auth: {
        user: process.env.BREVO_USERNAME,
        pass: process.env.BREVO_API_KEY,
      },
    },
  };
};

export default brevoSmtpConfigFactory;
