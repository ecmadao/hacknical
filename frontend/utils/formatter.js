
/* eslint arrow-body-style: "off" */
import { BASE_URL_REG } from 'UTILS/constant'
import { isUrl } from 'UTILS/helper'

export const formatUrl = (url) => {
  if (!isUrl(url)) return url
  if (/^https?/.test(url)) return url
  if (/^\/\//.test(url)) return url
  return `//${url}`
}

/* ================================================================= */

const formatWithUrl = (text, url) => {
  const sections = text.split(url)
  const results = []

  for (const section of sections.slice(1)) {
    section && results.unshift({
      type: 'span',
      value: section
    })
    results.unshift({
      type: 'a',
      value: url
    })
  }
  sections[0] && results.unshift({
    type: 'span',
    value: sections[0]
  })
  return results
}

const formatSectionsWithUrl = (sections, url) => {
  const results = []

  for (const section of sections) {
    if (section.type === 'span') {
      const r = formatWithUrl(section.value, url)
      results.push(...r)
    } else {
      results.push(section)
    }
  }
  return results
}

export const formatTextWithUrl = (text) => {
  const urls = text.match(BASE_URL_REG)
  let results = [{
    type: 'span',
    value: text
  }]
  if (!urls) return results

  for (const url of urls) {
    results = formatSectionsWithUrl(results, url)
  }
  return results
}

export const formatNumber = (number) => {
  const numberString = `${number}`

  if (numberString.length <= 3) return numberString

  const loop = parseInt(numberString.length / 3, 10)
  const offset = numberString.length % 3
  const results = []

  for (let i = loop - 1; i >= 0; i -= 1) {
    const start = offset + (3 * i)
    const end = start + 3
    const section = numberString.slice(start, end)
    results.unshift(`,${section}`)
  }

  if (!offset) return results.join('').slice(1)

  results.unshift(numberString.slice(0, offset))
  return results.join('')
}
