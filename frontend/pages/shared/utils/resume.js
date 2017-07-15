import objectAssign from 'UTILS/object-assign';
import { SOCIAL_LINKS } from 'SHARED/datas/resume';

export const objectassign = (baseObj, targetObj) =>
  objectAssign({}, baseObj, targetObj);

export const validateSocialLinks = socialLinks =>
  SOCIAL_LINKS.map((social) => {
    const targetSocial = socialLinks.filter(s => s.name === social.name);
    if (targetSocial.length) {
      return targetSocial[0];
    }
    return social;
  });
