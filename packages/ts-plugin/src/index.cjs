const { createLanguageServicePlugin } = require('@volar/typescript/lib/quickstart/createLanguageServicePlugin.js');
const { createCssModuleLanguagePlugin } = require('./language-plugin.cjs');

module.exports = createLanguageServicePlugin((ts, info) => {
  return {
    languagePlugins: [createCssModuleLanguagePlugin()],
  };
});
