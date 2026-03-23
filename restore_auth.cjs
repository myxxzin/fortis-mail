const fs = require('fs');

function fixAuth(f) {
  let c = fs.readFileSync(f, 'utf8');
  
  // Revert background
  c = c.replace(/dark:bg-black/g, 'dark:bg-[#020617]');
  
  // Revert placeholders
  c = c.replace(/dark:placeholder:text-white/g, 'dark:placeholder:text-corporate-400');
  
  // Revert icons in input fields
  c = c.replace(/text-corporate-400 dark:text-white peer-autofill:text-corporate-900/g, 'text-corporate-400 dark:text-corporate-300 peer-autofill:text-corporate-900');
  
  // Revert eye icon
  c = c.replace(/text-corporate-500 dark:text-white hover:text-corporate-900 dark:hover:text-white transition-colors peer-autofill/g, 'text-corporate-500 dark:text-corporate-400 hover:text-corporate-900 dark:hover:text-white transition-colors peer-autofill');
  
  // Revert footer links
  c = c.replace(/text-corporate-600 dark:text-white hover:text-corporate-900/g, 'text-corporate-600 dark:text-corporate-300 hover:text-corporate-900');
  
  // Revert PKBDF2 msg
  c = c.replace(/text-corporate-600 dark:text-white font-mono/g, 'text-corporate-600 dark:text-corporate-400 font-mono');
  
  // Revert tagline footer
  c = c.replace(/text-corporate-600 dark:text-white"\s*>/g, 'text-corporate-600 dark:text-corporate-300">');
  c = c.replace(/text-corporate-600 dark:text-white/g, 'text-corporate-600 dark:text-corporate-300'); // fallback
  
  // Register specific: Validation checks
  c = c.replace(/text-corporate-500 dark:text-white"\}/g, 'text-corporate-500 dark:text-corporate-400"}');
  c = c.replace(/text-corporate-500 dark:text-white cursor-not-allowed/g, 'text-corporate-500 dark:text-corporate-400 cursor-not-allowed');

  fs.writeFileSync(f, c);
  console.log("Restored " + f);
}

fixAuth('src/pages/Login.tsx');
fixAuth('src/pages/Register.tsx');
