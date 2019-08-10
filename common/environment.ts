export const environment = {
  server: { port: process.env.SERVER_PORT || 3000 },
  db: {
    host: process.env.DB_URL || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME|| 'ecommerce',
  },
  security: {
    saltRounds: process.env.SALT_ROUNDS || 10,
    apiSecret: process.env.API_SECERT || 'meat-api-secret',
    enableHTTPS: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERTI_FILE || './security/keys/cert.pem',
    key: process.env.CERT_KEY_FILE || './security/keys/key.pem'
  }
}
