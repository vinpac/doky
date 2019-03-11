import * as path from 'path'
import { BUILD_DIR, CONFIG_FILE } from './constants'
import { fsStat } from './utils'

export interface Configuration {
  readonly webpack?: (config: any) => any
  readonly include: string[]
  readonly exclude?: string[]
  readonly output: string
  readonly entry?: string
}

const defaultConfiguration: Configuration = {
  output: BUILD_DIR,
  include: ['**/*.mdx'],
  exclude: ['node_modules', '.git'],
}

export default async (): Promise<Configuration> => {
  const configFilepath = path.resolve(CONFIG_FILE)
  const exists = await fsStat(configFilepath)
  let config: Configuration = defaultConfiguration

  if (exists) {
    config = {
      ...defaultConfiguration,
      // @ts-ignore
      ...require(filepath),
    }
  }

  return {
    ...config,
    include: config.include.map(filepath => path.resolve(filepath)),
    exclude: config.exclude
      ? config.exclude.map(filepath => path.resolve(filepath))
      : [],
  }
}
