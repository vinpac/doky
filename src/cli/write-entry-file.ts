import * as path from 'path'
import { BASE_DIR } from './constants'
import { Configuration } from './load-configuration'
import { fsStat, readFile, writeFile } from './utils'
import { PageFile } from './watch-files'

async function readPreviewHead() {
  const filepath = path.resolve(BASE_DIR, 'preview-head.html')
  const exists = await fsStat(filepath)

  if (exists) {
    return readFile(filepath)
  }

  return ''
}

export default async function writeEntryFile(
  config: Configuration,
  files: PageFile[],
) {
  const previewHead = await readPreviewHead()
  const pwd = path.resolve()
  const entryFilepath = path.resolve(config.output, 'entry.js')

  return await writeFile(
    entryFilepath,
    `
    import React from 'react'
      import { setPreviewHead } from '${path.resolve('preview')}'
      ${
        config.entry
          ? `
      import setupClient from '${path.resolve(BASE_DIR, config.entry)}'`
          : `
      import setupClient from '${path.resolve(
        'dist',
        'client',
        'setup-client',
      )}'`
      }

      ${files
        .map(
          (file, i) => `
        import * as page${i} from '${file.filepath}'
        `,
        )
        .join('')}

      setPreviewHead(
        <React.Fragment>
          ${previewHead}
        </React.Fragment>
      )

      setupClient([
        ${files.map((file, i) => {
          return `{
            id: "${file.id}",
            meta: ${JSON.stringify(file.meta)},
            filepath: "${file.filepath.substr(pwd.length)}",
            module: page${i},
          }`
        })}
      ])
    `,
  )
}
