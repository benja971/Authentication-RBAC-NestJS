export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
});
