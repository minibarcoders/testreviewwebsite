const bcryptjs = require('bcryptjs');

async function main() {
  const storedHash = '$2a$10$MKp2MNC3bp8cdgg7OjwJSOnyfA//8OEXbPNs4daa2E.wnNrk/02FG';
  const password = 'Tech2024!';

  try {
    const isValid = await bcryptjs.compare(password, storedHash);
    console.log('Password valid:', isValid);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();