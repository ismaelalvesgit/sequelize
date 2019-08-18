//@Author ismael alves
export const environment = {
  server: { 
    port: process.env.SERVER_PORT || 3000,
    url: process.env.SERVER_URL  || 'http://localhost:3000'
  },
  cliente:{
    url: process.env.CLIENT_URL || 'http://localhost:4200'
  },
  db: {
    host: process.env.DB_URL || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME|| 'ecommerce',
  },
  security: {
    saltRounds: process.env.SALT_ROUNDS || 10,
    apiSecret: process.env.API_SECERT || 'ecommerce-api-secret',
    enableHTTPS: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERTI_FILE || './security/keys/cert.pem',
    key: process.env.CERT_KEY_FILE || './security/keys/key.pem'
  },
  log: {
    level: process.env.LOG_LEVEL || 'debug',
    name: 'ecommerce-api-logger'
  },
  email:{
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ||  587,
    secure: process.env.EMAIL_SECURE || false,
    user: process.env.EMAIL_USER || 'email',
    pass: process.env.EMAIL_PASSWORD || 'senha',
  }
}
