import pinyin from 'pinyin'

export const titleToPinyin = (title) => {
  if (!title || typeof title !== 'string') return 'resume'
  const pinyinFn = pinyin.default || pinyin
  const rawList = pinyinFn(title, { style: 'normal' })
  let str = ''
  for (const item of rawList) {
    str += item[0]
  }
  const result = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
  return result || 'resume'
}

export default {
  titleToPinyin
}
