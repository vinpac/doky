import * as escape from 'escape-html'
import * as Prism from 'prismjs'
import loadPrismLanguage from './load-prism-language'

export default (language: string, input: string): string => {
  // (Try to) load languages on demand.
  if (!Prism.languages[language]) {
    try {
      loadPrismLanguage(language)
    } catch (e) {
      // Language wasn't loaded so let's bail.
      if (language === `none`) {
        return input // Don't escape if set to none.
      } else {
        return escape(input)
      }
    }
  }

  const grammar = Prism.languages[language]
  const highlighted = Prism.highlight(input, grammar, language)

  const result = highlighted

  return result
}
