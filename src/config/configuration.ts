export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
});
