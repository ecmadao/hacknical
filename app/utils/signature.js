
import crypto from 'crypto'

const getSignature = (options) => {
  const {
    date,
    method,
    secretKey,
    body = '',
    contentType = ''
  } = options

  return crypto.createHmac('sha1', secretKey)
    .update(
      Buffer.from(
        [
          method,
          crypto.createHash('md5').update(body, 'utf8').digest('hex'),
          contentType,
          date
        ].join('\n'),
        'utf-8'
      )
    ).digest('base64')
}

export default getSignature
