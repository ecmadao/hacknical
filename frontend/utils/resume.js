
import objectAssign from 'UTILS/object-assign'
import { SOCIAL_LINKS } from 'UTILS/constant/resume'

export const validateSocialLinks = (socialLinks) => {
  const tmp = {}
  const results = []

  for (const socialLink of socialLinks) {
    if (socialLink.url && socialLink.name) tmp[socialLink.name.toLowerCase()] = socialLink
  }

  for (const SOCIAL_LINK of SOCIAL_LINKS) {
    const data = tmp[SOCIAL_LINK.name] || SOCIAL_LINK
    results.push(objectAssign({}, data, {
      deleteable: false,
      icon: SOCIAL_LINK.icon,
      text: SOCIAL_LINK.text
    }))
    delete tmp[SOCIAL_LINK.name]
  }

  for (const name of Object.keys(tmp)) {
    const data = tmp[name]
    results.push(Object.assign({}, data, {
      icon: 'browser.png',
      deleteable: true
    }))
  }

  return results
}
