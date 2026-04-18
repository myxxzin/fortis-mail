const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace all faded gray texts with pure white in dark mode.
    // The user explicitly requested "màu chữ là trắng luôn chớ không mờ" 
    // (text color should be white, not blurry/faded).
    content = content.replace(/dark:text-corporate-200/g, 'dark:text-white');
    content = content.replace(/dark:text-corporate-300/g, 'dark:text-white');
    content = content.replace(/dark:text-corporate-400/g, 'dark:text-white');
    content = content.replace(/dark:text-corporate-500/g, 'dark:text-white');
    content = content.replace(/dark:text-corporate-600/g, 'dark:text-white');

    // Re-introduce dark text-white where missing in some key places if any, but the above covers it.

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    }
}

function processDirectory(dir) {
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
processDirectory('./src/layouts');
