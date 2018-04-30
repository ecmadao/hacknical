
/* eslint arrow-body-style: "off" */

export const formatUrl = (url) => {
  return /^http/.test(url) ? url : `//${url}`;
};

/* ================================================================= */

const BASE_URL_REG = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;

const formatWithUrl = (text, url) => {
  const sections = text.split(url);
  const results = [];

  for (const section of sections.slice(1)) {
    section && results.unshift({
      type: 'span',
      value: section
    });
    results.unshift({
      type: 'a',
      value: url
    });
  }
  sections[0] && results.unshift({
    type: 'span',
    value: sections[0]
  });
  return results;
};

const formatSectionsWithUrl = (sections, url) => {
  const results = [];

  for (const section of sections) {
    if (section.type === 'span') {
      const r = formatWithUrl(section.value, url);
      results.push(...r);
    } else {
      results.push(section);
    }
  }
  return results;
};

export const formatTextWithUrl = (text) => {
  const urls = text.match(BASE_URL_REG);
  let results = [{
    type: 'span',
    value: text
  }];
  if (!urls) return results;

  for (const url of urls) {
    results = formatSectionsWithUrl(results, url);
  }
  return results;
};
