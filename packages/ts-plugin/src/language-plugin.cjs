/// <reference types="@volar/typescript" />

const ts = require('typescript/lib/tsserverlibrary');

const LANGUAGE_ID = 'css-module';

/**
 * @returns {import('@volar/language-core').LanguagePlugin<string>}
 */
exports.createCssModuleLanguagePlugin = function createCssModuleLanguagePlugin() {
  return {
    getLanguageId(scriptId) {
      if (scriptId.endsWith('.module.css')) return LANGUAGE_ID;
      return undefined;
    },
    createVirtualCode(scriptId, languageId, snapshot) {
      if (languageId !== LANGUAGE_ID) return undefined;
      const length = snapshot.getLength();
      const cssModuleText = snapshot.getText(0, length);
      const { text: dtsText, mapping } = createDts(cssModuleText);
      console.log(dtsText);
      console.log(JSON.stringify(mapping));
      return {
        id: 'main',
        languageId: LANGUAGE_ID,
        snapshot: {
          getText: (start, end) => dtsText.slice(start, end),
          getLength: () => dtsText.length,
          getChangeRange: () => undefined,
        },
        // `mappings` are required to support "Go to definitions" and renaming
        mappings: [{ ...mapping, data: { navigation: true } }],
      };
    },
    typescript: {
      extraFileExtensions: [
        {
          extension: 'css',
          isMixedContent: true,
          scriptKind: ts.ScriptKind.TS,
        },
      ],
      getServiceScript(root) {
        return {
          code: root,
          extension: ts.Extension.Ts,
          scriptKind: ts.ScriptKind.TS,
        };
      },
    },
  };
}

/**
 * @typedef {Pick<import('@volar/language-core').CodeMapping, 'generatedOffsets' | 'sourceOffsets' | 'lengths'>} Mapping
 */

/**
 * 
 * @param {string} cssModuleText 
 * @returns {{ text: string, mapping: Mapping }}
 */
function createDts(cssModuleText) {
  /** @type {Mapping} */
  const mapping = { generatedOffsets: [], sourceOffsets: [], lengths: [] };

  const result = cssModuleText.match(/\.([a-zA-Z0-9_-]+)/g);
  if (!result) return { text: 'declare const styles: {};\nexport default styles;', mapping };

  const classes = result.map(i => i.slice(1));
  const dtsText = `
declare const styles:
${classes.map(i => `  & { ${i}: string }`).join('\n')}
;
export default styles;
  `.trim();

  for (const className of classes) {
    mapping.sourceOffsets.push(cssModuleText.indexOf('.' + className) + 1);
    mapping.generatedOffsets.push(dtsText.indexOf(className));
    mapping.lengths.push(className.length);
  }

  return { text: dtsText, mapping };
}
