import * as path from 'path'
import * as visit from 'unist-util-visit'
import { generateCodeHtml, Options } from './prism'

export default function addPreviewCode(options: Options) {
  return tree => {
    const variableNames: string[] = []
    function importVisitor(node) {
      node.value.split(/;|\n/).forEach((line: string) => {
        const sentences = line.split(/ |,/)
        let i = 0
        let name
        let importPath
        let inScope = false
        for (; i < sentences.length; i += 1) {
          if (sentences[i][0] === '{') {
            inScope = true
          }

          if (inScope && sentences[i][sentences[i].length - 1] === '}') {
            inScope = false
          }

          if (inScope) {
            continue
          }

          if (sentences[i] === 'import') {
            name = sentences[i + 1]
          }

          if (sentences[i] === 'as') {
            name = sentences[i + 1]
          }

          if (sentences[i] === 'from') {
            importPath = sentences.slice(i + 1).join(' ')
            importPath = importPath.substr(1, importPath.length - 2)
          }
        }

        if (
          path.resolve(path.dirname(options.filepath), importPath) ===
          path.resolve(__dirname, '..', '..', '..', 'preview')
        ) {
          variableNames.push(name)
        }
      })
    }

    function visitor(node) {
      node.value = `<PreviewCodeProvider value={${JSON.stringify(
        generateCodeHtml('typescript', node.value, options),
      )}}>${node.value}</PreviewCodeProvider>`
    }

    visit(tree, 'import', importVisitor)
    visit(tree, 'html', visitor)
  }
}
