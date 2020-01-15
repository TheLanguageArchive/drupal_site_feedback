const fs = require('fs-extra');
const concat = require('concat');
const zlib = require('zlib');
const gzip = zlib.createGzip();

(async function build() {

    await fs.ensureDir('dist/elements');
    await concat([

        './dist/drupal-site-feedback/runtime.js',
        './dist/drupal-site-feedback/polyfills.js',
        './dist/drupal-site-feedback/styles.js',
        './dist/drupal-site-feedback/scripts.js',
        './dist/drupal-site-feedback/main.js',

    ], 'dist/elements/drupal-site-feedback.js');

    fs.createReadStream('dist/elements/drupal-site-feedback.js')
        .pipe(gzip)
        .on('error', () => {})
        .pipe(
            fs.createWriteStream('dist/elements/drupal-site-feedback.js.gz')
        )
        .on('error', () => {});
})();
