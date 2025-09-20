
const fs = require('fs-extra');
const path = require('path');
const Terser = require('terser');
const CleanCSS = require('clean-css');

const minifyJs = async (filePath) => {
    const code = await fs.readFile(filePath, 'utf8');
    const result = await Terser.minify(code);
    await fs.writeFile(filePath, result.code);
};

const minifyCss = async (filePath) => {
    const code = await fs.readFile(filePath, 'utf8');
    const result = new CleanCSS().minify(code);
    await fs.writeFile(filePath, result.styles);
};

const optimize = async () => {
    const srcPath = path.resolve(__dirname, '../src');
    const files = await fs.readdir(srcPath);

    for (const file of files) {
        const filePath = path.join(srcPath, file);
        if (file.endsWith('.js')) {
            await minifyJs(filePath);
            console.log(`Minified ${file}`);
        } else if (file.endsWith('.css')) {
            await minifyCss(filePath);
            console.log(`Minified ${file}`);
        }
    }
};

optimize();
