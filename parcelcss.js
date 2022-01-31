const css = require('@parcel/css');
const fs = require('fs');
let {code, map} = css.transform({
  filename: './dist/assets/index.d5b2db89.min.css',
  code: fs.readFileSync('./dist/assets/index.d5b2db89.css'),
  minify: true,
  sourceMap: false,
  targets: {
    // Semver versions are represented using a single 24-bit number, with one component per byte.
    // e.g. to represent 13.2.0, the following could be used.
    safari: (15 << 16) | (1 << 8)
  }
});
fs.writeFileSync('./dist/assets/index.d5b2db89.min.css', code);