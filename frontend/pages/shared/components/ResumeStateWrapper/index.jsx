import React, { cloneElement } from 'react';
import objectAssign from 'UTILS/object-assign';
import Api from 'API/index';
import {
  objectassign,
  validateSocialLinks
} from 'SHARED/utils/resume';
import validator from 'UTILS/validator';
import dateHelper from 'UTILS/date';
import { sortBySeconds, validateUrl } from 'UTILS/helper';
import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS,
  LINK_NAMES
} from 'SHARED/datas/resume';
import locales from 'LOCALES';

const resumeTexts = locales("resume");
const getDateNow = dateHelper.date.now;
const validateDate = dateHelper.validator.date;
const DATE_NOW = getDateNow();
const sortByDate = sortBySeconds('startTime');

class ResumeStateWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      updateAt: '',
      info: objectassign({}, INFO),
      educations: [],
      workExperiences: [],
      personalProjects: [],
      others: objectassign({}, OTHERS),
      shareInfo: {
        github: {},
        useGithub: true,
        githubUrl: null,
        template: 'v0'
      }
    };
  }

  componentDidMount() {
    this.fetchResume();
    this.removeLoading('#loading');
    this.fetchShareInfo();
  }

  componentDidUpdate(preProps, preState) {
    const { loading } = this.state;
    if(!loading && preState.loading) {
      window.done = true;
    }
  }

  removeLoading(dom) {
    $(dom) && $(dom).remove();
  }

  fetchShareInfo() {
    Api.resume.getPubResumeStatus(this.props.hash).then((result) => {
      this.initialShareInfo(result);
    });
  }

  fetchResume() {
    Api.resume.getPubResume(this.props.hash).then((result) => {
      result && this.initialResume(this.formatResume(result));
    });
  }

  initialShareInfo(data) {
    const { shareInfo } = this.state;
    this.setState({
      shareInfo: objectassign(shareInfo, data)
    });
  }

  formatResume(resume) {
    const {
      others,
      educations,
      workExperiences,
      personalProjects,
    } = resume;
    const { socialLinks } = others;

    const formatWorkExperiences = workExperiences
      .filter(experience => experience.company)
      .sort(sortByDate)
      .reverse()
      .map((experience) => {
        const {
          url,
          company,
          startTime,
          endTime,
          position,
          projects,
          untilNow,
        } = experience;

        const validateEnd = untilNow
          ? validateDate(DATE_NOW)
          : validateDate(endTime);

        return {
          url,
          company,
          position,
          untilNow,
          endTime: validateEnd,
          startTime: validateDate(startTime),
          projects: projects.filter(project => project.name)
        };
      });

    const formatEducations = educations
      .filter(edu => edu.school)
      .sort(sortByDate)
      .reverse()
      .map((edu, index) => {
        const {
          school,
          major,
          education,
          startTime,
          endTime
        } = edu;

        return {
          school,
          major,
          education,
          startTime: validateDate(startTime),
          endTime: validateDate(endTime),
        };
      });

    const formatPersonalProjects = personalProjects
      .filter(project => project.title);

    const formatSocials = validateSocialLinks(socialLinks)
      .filter(social => validator.url(social.url))
      .map((social) => {
        const { url, name, text } = social;
        return {
          url,
          text: text || LINK_NAMES[name] || name,
          validateUrl: validateUrl(url),
        };
      });

    return objectAssign({}, resume, {
      educations: [...formatEducations],
      workExperiences: [...formatWorkExperiences],
      personalProjects: [...formatPersonalProjects],
      others: objectAssign({}, others, {
        socialLinks: formatSocials
      })
    });
  }

  initialResume(resume) {
    const {
      info,
      educations,
      workExperiences,
      personalProjects,
      others,
      updateAt
    } = resume;

    const state = this.state;
    this.setState({
      updateAt,
      loading: false,
      others: objectassign(state.others, others),
      info: objectassign(state.info, info),
      educations: [...educations],
      workExperiences: [...workExperiences],
      personalProjects: [...personalProjects],
    });
  }

  render() {
    const resumeProps = objectassign(this.state);
    const shareInfo = objectassign(resumeProps.shareInfo);
    delete resumeProps.shareInfo;
    delete resumeProps.loading;

    const children = cloneElement(this.props.children, {
      login: this.props.login,
      resume: resumeProps,
      shareInfo: shareInfo,
      loading: this.state.loading,
      updateText: resumeTexts.updateAt,
    });
    return (
      <div className={this.props.className}>
        {children}
      </div>
    );
  }
}

export default ResumeStateWrapper;
