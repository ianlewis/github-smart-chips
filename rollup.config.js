// Copyright 2025 Ian Lewis
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// See: https://rollupjs.org/introduction/

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";

// Custom plugin to strip exports for Apps Script
// Apps Script doesn't support module exports, so we need to remove them
function stripExportsForAppsScript() {
  return {
    name: "strip-exports-for-apps-script",
    renderChunk(code) {
      let modifiedCode = code;

      // Remove the opening IIFE wrapper: (function (exports) {
      modifiedCode = modifiedCode.replace(/^\(function \(exports\) \{\s*\n/, "");

      // Remove 'use strict' as it's not needed for Apps Script
      modifiedCode = modifiedCode.replace(/\s*'use strict';\s*\n/, "");

      // Remove all exports.xxx = xxx; statements
      modifiedCode = modifiedCode.replace(/\s*exports\.\w+\s*=\s*\w+;\s*/g, "");

      // Remove the closing IIFE wrapper: return exports; })({});
      modifiedCode = modifiedCode.replace(
        /\s*return exports;\s*\}\)\(\{\}\);?\s*$/,
        "",
      );

      // Remove the 4-space indentation that was added by the IIFE wrapper
      modifiedCode = modifiedCode
        .split("\n")
        .map((line) => {
          // Remove up to 4 spaces of indentation from each line
          return line.replace(/^    /, "");
        })
        .join("\n");

      return {
        code: modifiedCode,
        map: null,
      };
    },
  };
}

const config = {
  input: "lib/index.js",
  output: {
    esModule: false,
    file: "dist/index.js",
    format: "iife",
    sourcemap: false,
  },
  plugins: [
    del({ targets: "dist" }),
    resolve({ extensions: [".mjs", ".js", ".json", ".node"] }),
    commonjs(),
    stripExportsForAppsScript(),
    copy({
      targets: [
        { src: "appsscript.json", dest: "dist/" },
        { src: ".clasp.json", dest: "dist/" },
      ],
    }),
  ],
};

export default config;
