const getSectionTitle = (resume, resumeLocales, section) => {
  const { info } = resume;
  const { freshGraduate } = info;
  const { title, subTitle } = resumeLocales.sections[section];
  const result = freshGraduate ? subTitle : title;
  return result || title;
};

export default getSectionTitle;
