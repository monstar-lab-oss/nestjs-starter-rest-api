export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  jwt: {
    publicKey: new Buffer(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString(
      'utf8',
    ),
    privateKey: new Buffer(
      process.env.JWT_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_SECONDS, 10),
  },
});
