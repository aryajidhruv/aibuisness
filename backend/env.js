// env.js
const REQUIRED_ENV = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLIENT_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'PUBLIC_BASE_URL',
  'VAPI_API_KEY',
  'VAPI_ASSISTANT_ID',
  'VAPI_PHONE_NUMBER_ID'
];

function validateEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key] || process.env[key].trim() === '');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error('\nKripya .env file check karein aur sabhi missing keys fill karein.');
    process.exit(1); // Server ko bina keys ke start nahi hone dega
  }
  
  console.log('✅ Sabhi environment variables sahi se load ho gaye hain.');
}

module.exports = { validateEnv };