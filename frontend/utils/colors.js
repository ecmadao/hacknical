
import { MD_COLORS } from 'UTILS/constant'

const hex2Rgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

export const hex2Rgba = hex =>
  opacity => `rgba(${hex2Rgb(hex)}, ${opacity})`

const COLOR_DICT = {}

export const randomColor = (prefix) => {
  if (!COLOR_DICT[prefix]) COLOR_DICT[prefix] = new Map()
  let colors = [...MD_COLORS]

  const getRamdomColor = (key) => {
    if (COLOR_DICT[prefix].has(key)) return COLOR_DICT[prefix].get(key)
    if (!colors.length) colors = [...MD_COLORS]

    const index = Math.floor(Math.random() * colors.length)
    const color = colors[index]
    colors = [...colors.slice(0, index), ...colors.slice(index + 1)]

    COLOR_DICT[prefix].set(key, color)
    return color
  }

  return getRamdomColor
}
