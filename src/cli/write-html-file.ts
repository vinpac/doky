import * as fs from 'fs'
import * as path from 'path'
import { BASE_DIR } from './constants'
import { writeFile } from './utils'

export default function writeHTMLFile() {
  const filepath = path.resolve(BASE_DIR, 'public', 'index.html')
  return new Promise(async (resolve, reject) => {
    fs.stat(filepath, (error, stats) => {
      if (error) {
        reject(error)
        return
      }

      if (!stats.isFile()) {
        console.warn(`Warning: ${filepath} is not a file`)
        resolve()
        return
      }

      resolve()
    })
  }).catch(() => {
    // tslint:disable-next-line
    console.log(`> Create ${BASE_DIR}/public/index.html`)

    return writeFile(
      filepath,
      `
      <!DOCTYPE HTML>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
        </head>
        <body>
          <div id="root"></div>
          <script src="/static/runtime/webpack.js"></script>
          <script src="/static/chunks/main.js"></script>
        </body>
      </html>
    `.trim(),
    )
  })
}
