const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

    const files = [

        './dist/drupal-site-feedback/runtime-es2015.js',
        './dist/drupal-site-feedback/polyfills-es2015.js',

        // './dist/drupal-site-feedback/runtime-es5.js',
        // './dist/drupal-site-feedback/polyfills-es5.js',

        './dist/drupal-site-feedback/styles-es2015.js',
        // './dist/drupal-site-feedback/styles-es5.js',

        './dist/drupal-site-feedback/main-es2015.js',
        // './dist/drupal-site-feedback/main-es5.js'
    ];

    await fs.ensureDir('dist/elements');
    await concat(files, 'dist/elements/drupal-site-feedback.js');
})();
