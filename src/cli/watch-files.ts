import * as chokidar from 'chokidar'
import * as fronMatter from 'front-matter'
import * as path from 'path'
import * as slugify from 'slug'
import { Configuration } from './load-configuration'
import { readFile } from './utils'

const pwd = path.resolve()

export interface PageFileMeta {
  [key: string]: any
}

export interface PageFile {
  id: string
  filepath: string
  meta: PageFileMeta
}

async function extractMetaObject(
  filepath: string,
  files: PageFile[],
): Promise<PageFileMeta> {
  const content = await readFile(filepath)
  const { attributes } = fronMatter(content)

  const title =
    attributes.title || path.basename(filepath, path.extname(filepath))
  let slug = slugify(title, { lower: true })
  let count = 0
  const RE_SLUG = new RegExp(`${slug}(-[0-9]+)?`)

  files.forEach(file => {
    if (file.filepath !== file.filepath && RE_SLUG.test(file.meta.slug)) {
      count += 1
    }
  })

  if (count > 0) {
    slug = `${slug}-${count}`
  }

  return {
    title,
    slug,
    ...attributes,
  }
}

export default function watchFiles(
  config: Configuration,
  run: (files: PageFile[]) => any,
) {
  const filesWatcher = chokidar.watch(config.include, {
    ignored: config.exclude,
  })

  const initialPromises: Array<Promise<any>> = []
  let isReady: boolean = false
  let files: PageFile[] = []

  filesWatcher.on('add', (filepath: string) => {
    const exist = files.some(file => file.filepath === filepath)
    if (!exist) {
      const promise: Promise<PageFile> = extractMetaObject(
        filepath,
        files,
      ).then(meta => ({
        id: filepath.substr(pwd.length + 1),
        filepath,
        meta,
      }))

      if (isReady) {
        promise.then(file => {
          files = [...files, file]
          run(files)
        })
      } else {
        initialPromises.push(
          promise.then(file => {
            files.push(file)
          }),
        )
      }
    }
  })

  filesWatcher.on('unlink', (filepath: string) => {
    const exist = files.some(file => file.filepath === filepath)
    if (exist) {
      files = files.filter(file => file.filepath !== filepath)

      if (isReady) {
        run(files)
      }
    }
  })

  filesWatcher.on('change', async (filepath: string) => {
    if (isReady) {
      const meta = await extractMetaObject(filepath, files)
      files = files.map(file => {
        if (file.filepath === filepath) {
          return {
            ...file,
            meta,
          }
        }

        return file
      })
      run(files)
    }
  })

  filesWatcher.on('ready', async () => {
    await Promise.all(initialPromises)
    isReady = true

    run(files)
  })

  return filesWatcher
}
