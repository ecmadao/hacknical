import React from 'react';
import locales from 'LOCALES';

const resumeLocales = locales('resume');

class ResumeUIWrapper extends React.Component {
  getSectionTitle(section) {
    const { resume } = this.props;
    const { info } = resume;
    const { freshGraduate } = info;
    const { title, subTitle } = resumeLocales.sections[section];
    const result = freshGraduate ? subTitle : title;
    return result || title;
  }

  renderEducations() {
    return null;
  }

  renderWorkExperiences() {
    return null;
  }

  renderPersonalProjects() {
    return null;
  }

  renderSupplements() {
    return null;
  }

  renderSocialLinks() {
    return null;
  }

  renderUpdateTime() {
    const { resume, updateText, fromDownload, } = this.props;
    const { updateAt } = resume;
    if (!updateAt || fromDownload) return false;
    return {
      updateAt,
      updateText,
    };
  }

  renderResumeSections() {
    const { resume } = this.props;
    const { info } = resume;
    const { freshGraduate } = info;
    let sectionFuncs = [];
    if (freshGraduate) {
      sectionFuncs = [
        this.renderEducations,
        this.renderWorkExperiences,
        this.renderPersonalProjects,
        this.renderSupplements,
        this.renderSocialLinks,
      ];
    } else {
      sectionFuncs = [
        this.renderWorkExperiences,
        this.renderPersonalProjects,
        this.renderEducations,
        this.renderSupplements,
        this.renderSocialLinks,
      ];
    }
    return sectionFuncs.map((func, index) => func && func.call(this, index));
  }
}

export default ResumeUIWrapper;
