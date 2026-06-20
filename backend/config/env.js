const REQUIRED_ENV = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLIENT_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
];

function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error('\nCopy backend/.env.example to backend/.env and fill in the values.');
    process.exit(1);
  }
}

module.exports = { validateEnv };
