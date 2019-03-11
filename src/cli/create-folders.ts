import * as mkdirp from 'mkdirp'
import * as path from 'path'
import { BASE_DIR } from './constants'
import { Configuration } from './load-configuration'

function createFolder(dirpath: string) {
  return new Promise((resolve, reject) => {
    mkdirp(dirpath, error => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export default function createFolders(config: Configuration) {
  return Promise.all([
    createFolder(path.resolve(config.output)),
    createFolder(path.resolve(BASE_DIR, 'public')),
  ])
}
