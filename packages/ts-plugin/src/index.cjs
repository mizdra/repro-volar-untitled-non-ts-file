const { createAsyncLanguageServicePlugin } = require('@volar/typescript/lib/quickstart/createAsyncLanguageServicePlugin.js');
const { createCssModuleLanguagePlugin } = require('./language-plugin.cjs');
const ts = require('typescript');

module.exports = createAsyncLanguageServicePlugin(['.css'], ts.ScriptKind.TS, async (ts, info) => {
  return {
    languagePlugins: [createCssModuleLanguagePlugin()],
  };
});
