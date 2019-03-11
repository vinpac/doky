import chalk from 'chalk'
import { createServer } from 'http'
import * as path from 'path'
import * as handler from 'serve-handler'
import { BASE_DIR } from './constants'
import { Configuration } from './load-configuration'

export default function startDevServer(config: Configuration) {
  const headers = [
    {
      source: '**',
      headers: [
        {
          key: 'Cache-Control',
          value: 'max-age=0',
        },
      ],
    },
  ]

  const server = createServer((request, response) => {
    return handler(
      request,
      response,
      {
        headers,
        unlisted: ['tmp'],
        public: path.resolve(config.output),
        directoryListing: false,
      },
      {
        sendError: () => {
          return handler(request, response, {
            public: path.resolve(BASE_DIR, 'public'),
            headers,
            rewrites: [
              {
                source: '**',
                destination: 'index.html',
              },
            ],
            directoryListing: false,
          })
        },
      },
    )
  })

  server.listen(3000, () => {
    console.log('\nDev server running at')
    console.log(`\t${chalk.cyan('http://localhost:3000')}\n`)
  })
}
