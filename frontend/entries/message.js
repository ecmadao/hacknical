import message from 'UTILS/message'
import locales from 'LOCALES'

const messageTexts = locales('messages')

$(() => {
  const queryMap = window.location.search
    .slice(1)
    .split('&')
    .reduce((map, section) => {
      const [key, value] = section.split('=');
      map[key] = value.toLowerCase();
      return map;
    }, {});

  if (!queryMap.messageCode || !queryMap.messageType) {
    return;
  }

  if (
    !messageTexts[queryMap.messageType] ||
    !messageTexts[queryMap.messageType][queryMap.messageCode]) {
    return;
  }

  const msg = messageTexts[queryMap.messageType][queryMap.messageCode];

  switch (queryMap.messageType) {
    case 'error':
      message.error(msg);
      break;
    case 'notice':
    default:
      message.error(msg);
      break
  }
})
