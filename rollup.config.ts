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

const config = {
  input: "lib/index.js",
  output: {
    name: "global",
    esModule: false,
    file: "dist/index.js",
    format: "cjs",
    sourcemap: false,
  },
  plugins: [
    del({ targets: "dist" }),
    resolve({ extensions: [".mjs", ".js", ".json", ".node"] }),
    commonjs(),
    copy({
      targets: [
        { src: "appsscript.json", dest: "dist/" },
        { src: ".clasp.json", dest: "dist/" },
      ],
    }),
  ],
};

export default config;
