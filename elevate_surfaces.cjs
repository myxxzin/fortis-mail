const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Skip full page wrappers since they should keep the darkest backdrop #020617
    if (filePath.includes('Login.tsx') || filePath.includes('Register.tsx')) {
        return;
    }
    
    content = content.replace(/dark:bg-\[\#020617\]/g, 'dark:bg-slate-900');
    content = content.replace(/dark:border-\[\#020617\]/g, 'dark:border-slate-900');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    }
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

processDirectory('./src/pages');
processDirectory('./src/components');
