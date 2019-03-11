import chalk from 'chalk'
import * as clearConsole from 'clear-console'
import { Command } from 'commander'
import * as fs from 'fs'
import createCompiler from './create-compiler'
import createFolders from './create-folders'
import loadConfiguration from './load-configuration'
import startDevServer from './start-dev-server'
import watchFiles from './watch-files'
import writeEntryFile from './write-entry-file'
import writeHTMLFile from './write-html-file'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

new Command(pkg.name)
  .version(pkg.version)
  .on('--help', () => {
    console.info()
    console.info(
      '    If you have any problems, do not hesitate to file an issue:',
    )
    console.info(
      `      ${chalk.cyan(`https://github.com/vinpac/${pkg.name}/issues/new`)}`,
    )
    console.info()
  })
  .parse(process.argv)

async function run() {
  clearConsole()
  const config = await loadConfiguration()
  await createFolders(config)
  await writeHTMLFile()

  let compiler
  let startedServer
  watchFiles(config, async files => {
    await writeEntryFile(config, files)

    if (!compiler) {
      console.log(`${chalk.blue.underline('Compiling:')}\n`)

      compiler = createCompiler(config)
      compiler.watch({}, (error, stats) => {
        if (error) {
          console.error(error)
        }

        if (stats) {
          console.log(
            chalk.green(
              `✔ Compiled successfully in ${stats.endTime - stats.startTime}ms`,
            ),
          )
        }

        if (!startedServer && !error) {
          startedServer = true
          startDevServer(config)
        }
      })
    }
  })
}

run().catch(console.error)
