/**
 * @param {import('typescript')} ts 
 * @param {import('@volar/language-core').Language<string>} language 
 * @param {import('typescript').LanguageService} languageService 
 * @returns {import('typescript').LanguageService}
 */
exports.proxyLanguageService = function proxyLanguageService(
  ts,
  language,
  languageService,
) {
  // Setup the language service proxy
  /** @type {import('typescript').LanguageService} */
  const proxy = Object.create(null);
  for (const k of Object.keys(languageService)) {
    // @ts-expect-error
    const x = languageService[k];
    // @ts-expect-error
    proxy[k] = (...args) => x.apply(languageService, args);
  }
  
  // for Testing
  proxy.getCompletionsAtPosition = (fileName, position, options) => {
    const prior = languageService.getCompletionsAtPosition(fileName, position, options) ?? {
      entries: [],
      isGlobalCompletion: false,
      isMemberCompletion: false,
      isNewIdentifierLocation: false,
    };
    prior.entries.push({
      name: 'Hello',
      kind: ts.ScriptElementKind.keyword,
      sortText: '0',
    });
    return prior;
  };
  return proxy;
}
