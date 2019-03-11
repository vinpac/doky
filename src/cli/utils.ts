import * as fs from 'fs'

export function generateRandomId(): string {
  return Math.random()
    .toString(36)
    .substring(7)
}

export function fsStat(filepath: string): Promise<boolean> {
  return new Promise(resolve => {
    fs.stat(filepath, (error, stats) => {
      if (error) {
        resolve(false)
        return
      }

      resolve(stats.isFile())
    })
  })
}

export async function readFile(filepath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (error, body) => {
      if (error) {
        reject(error)
        return
      }

      resolve(body)
    })
  })
}

export async function writeFile(
  filepath: string,
  body: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, body, 'utf8', error => {
      if (error) {
        reject(error)
      }

      resolve(filepath)
    })
  })
}
