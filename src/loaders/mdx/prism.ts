import * as visit from 'unist-util-visit'
import highlightCode from './highlight-code'
import renderLineNumbers from './render-line-numbers'

export interface Options {
  wrapperClassName?: string
  aliases: { [key: string]: string }
  filepath: string
}

const defaulOptions: Options = {
  filepath: '/',
  wrapperClassName: 'Doky__Code',
  aliases: {},
}

export function generateCodeHtml(
  language: string,
  input: string,
  opts?: Partial<Options>,
) {
  const options = { ...defaulOptions, ...opts }
  return (
    `<div class="${options.wrapperClassName || ''} line-numbers">` +
    `  <pre class="language-${language}">` +
    `<code>${highlightCode(language, input)}</code>` +
    renderLineNumbers(input) +
    '</pre>' +
    '</div>'
  )
}

export default (opts?: Options) => {
  const options = {
    ...defaulOptions,
    ...opts,
  }

  function normalizeLanguage(lang: string) {
    const lower = lang.toLowerCase()
    return options.aliases[lower] || lower
  }

  function visitor(node) {
    const languageName = normalizeLanguage(node.lang || 'text')
    node.type = 'html'
    node.value = `<div className="${options.wrapperClassName ||
      'Doky__Code'}" dangerouslySetInnerHTML={{ __html: \`${generateCodeHtml(
      languageName,
      node.value,
      options,
    )}\`}} />`
  }

  return tree => {
    visit(tree, 'code', visitor)
  }
}
