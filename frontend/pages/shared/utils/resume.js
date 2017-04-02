
import objectAssign from 'object-assign';
import { SOCIAL_LINKS } from 'SHARED/datas/resume';

export const objectassign = (baseObj, targetObj) => {
  return objectAssign({}, baseObj, targetObj);
};

export const validateSocialLinks = (socialLinks) => {
  return SOCIAL_LINKS.map((social) => {
    const targetSocial = socialLinks.filter(s => s.name === social.name);
    if (targetSocial.length) {
      return targetSocial[0];
    } else {
      return social;
    }
  });
};
