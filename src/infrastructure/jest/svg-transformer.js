/**
 * Custom Jest transformer for SVG files
 * Replace SVG file contents by a pseudo <svg /> JSX element containing only a data-filename attribute
 *
 * To make this work with Jest you need to update your Jest configuration with this:
 *   "transform": {
 *     "^.+\\.js$": "babel-jest",
 *     "^.+\\.svg$": "path/to/svg-transform.js"
 *   }
 *
 * Ref: http://facebook.github.io/jest/docs/en/tutorial-react.html#custom-transformers
 */

const path = require("path");
const babel = require("@babel/core");
const preset = require("next/babel");

module.exports = {
  process(src, filename) {
    const code = babel.transformSync(
      `
        import React from 'react'; 
        export default () => (<svg data-filename="${path.relative(
          process.cwd(),
          filename
        )}" />);
      `,
      {
        filename: filename,
        presets: [preset],
        retainLines: true,
      }
    ).code;
    return code;
  },
};
