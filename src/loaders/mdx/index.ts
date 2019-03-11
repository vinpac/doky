import mdx from '@mdx-js/mdx'
import { getOptions } from 'loader-utils'
import * as mdxTableOfContents from 'mdx-table-of-contents'
import * as path from 'path'
import * as readingTime from 'reading-time'
import * as emoji from 'remark-emoji'
import * as slug from 'remark-slug'
import addPreviewCode from './add-preview-code'
import prism from './prism'

function trimFrontMatter(source: string) {
  let indexOfFrontMatterEnd = 0
  let validLinesSeenTimes = 0
  let indicatorSeenTimes = 0
  let isValidLine = true
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] !== '-') {
      if (source[i] === '\n') {
        if (
          isValidLine &&
          (validLinesSeenTimes === 0
            ? indicatorSeenTimes === 3
            : indicatorSeenTimes >= 3)
        ) {
          validLinesSeenTimes += 1

          if (validLinesSeenTimes === 2) {
            indexOfFrontMatterEnd = i
            break
          }
        }

        isValidLine = true
        continue
      }

      isValidLine = false
    }

    indicatorSeenTimes += 1
  }

  return source.substr(indexOfFrontMatterEnd)
}

module.exports = async function mdxLoader(source: string) {
  const mdxContent = trimFrontMatter(source)
  const options = Object.assign(
    {
      mdPlugins: [addPreviewCode, slug, emoji, prism],
      compilers: [mdxTableOfContents],
    },
    getOptions(this),
    { filepath: this.resourcePath },
  )

  let result: string | undefined
  try {
    result = await mdx(mdxContent, options)
  } catch (error) {
    console.error(error)
    return ''
  }

  const estimatedReadingTime = readingTime(source)

  const code = `
import React from 'react'
import { MDXTag } from '@mdx-js/tag'
import PreviewCodeProvider from '${path.resolve(
    'dist',
    'client',
    'components',
    'PreviewCodeProvider',
  )}'
export const readingTime = ${JSON.stringify(estimatedReadingTime)}
${result}`

  return code
}
