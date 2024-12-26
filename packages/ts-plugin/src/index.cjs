const { createLanguageServicePlugin } = require('@volar/typescript/lib/quickstart/createLanguageServicePlugin.js');
const { createCssModuleLanguagePlugin } = require('./language-plugin.cjs');
const { proxyLanguageService } = require('./language-service.cjs');

module.exports = createLanguageServicePlugin((ts, info) => {
  if (info.project.projectKind !== ts.server.ProjectKind.Configured) {
    return { languagePlugins: [] };
  }

  return {
    languagePlugins: [createCssModuleLanguagePlugin()],
    setup: (language) => {
      info.languageService = proxyLanguageService(ts, language, info.languageService);
    },
  };
});
