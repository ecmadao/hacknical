import { createAction, createActions } from 'redux-actions';
import Push from 'push.js';
import objectAssign from 'UTILS/object-assign';
import Api from 'API';
import locales from 'LOCALES';

const resumeLocales = locales('resume');
const {
  downloadSuccess,
  downloadError
} = resumeLocales.messages;

/**
 * initial
 */
const togglePosting = createAction('TOGGLE_POSTING');
const initialResume = createAction('INITIAL_RESUME');
const fetchResume = () => (dispatch) => {
  Api.resume.getResume().then((result) => {
    if (result) {
      dispatch(initialResume(result));
    } else {
      dispatch(toggleLoading(false));
    }
  });
};

const saveResume = () => (dispatch, getState) => {
  const { resume } = getState();
  const { posting, others } = resume;
  const { socialLinks } = others;

  if (posting) return;

  dispatch(togglePosting(true));

  const postResume = objectAssign({}, resume, {
    others: objectAssign({}, others, {
      socialLinks: socialLinks.filter(item => item.url && (item.text || item.name))
    })
  });
  delete postResume.loading;
  delete postResume.posting;
  delete postResume.edited;
  delete postResume.shareInfo;

  Api.resume.setResume(postResume).then((result) => {
    result && dispatch(initialPubResumeStatus(result));
    dispatch(togglePosting(false));
    dispatch(resetEdited());
  });
};

const handleActiveSectionChange = createAction('HANDLE_ACTIVE_SECTION_CHANGE');

/**
 * loading
 */
const toggleLoading = createAction('TOGGLE_LOADING');

/**
 * info
 */
const handleInfoChange = createAction('HANDLE_INFO_CHANGE');
const handleEditChange = createAction('HANDLE_EDIT_CHANGE');

const toggleHireAvailable = hireAvailable => (dispatch) => {
  Api.resume.patchResume({ info: { hireAvailable } }).then(() => {
    dispatch(handleInfoChange({ hireAvailable }));
    dispatch(handleEditChange(false));
  });
};

const toggleResumeType = freshGraduate => (dispatch) => {
  Api.resume.patchResume({ info: { freshGraduate } }).then(() => {
    dispatch(handleInfoChange({ freshGraduate }));
    dispatch(handleEditChange(false));
  });
};
/**
 * Education
 */
const {
  handleEduChange,
  addEducation,
  deleteEducation
} = createActions({
  HANDLE_EDU_CHANGE: (edu, index) => ({ edu, index })
}, 'ADD_EDUCATION', 'DELETE_EDUCATION');

/**
 * WorkExperience
 */
const {
  deleteWorkProject,
  addWorkProjectDetail,
  deleteWorkProjectDetail,
  handleWorkProjectChange,
  handleWorkExperienceChange,
  addWorkExperience,
  deleteWorkExperience,
  addWorkProject
} = createActions({
  DELETE_WORK_PROJECT: (workIndex, projectIndex) => ({ workIndex, projectIndex }),
  ADD_WORK_PROJECT_DETAIL: (detail, workIndex, projectIndex) =>
    ({ detail, workIndex, projectIndex }),
  DELETE_WORK_PROJECT_DETAIL: (workIndex, projectIndex, detailIndex) =>
    ({ workIndex, projectIndex, detailIndex }),
  HANDLE_WORK_PROJECT_CHANGE: (workProject, workIndex, projectIndex) =>
    ({ workProject, workIndex, projectIndex }),
  HANDLE_WORK_EXPERIENCE_CHANGE: (workExperience, index) => ({ workExperience, index })
}, 'ADD_WORK_EXPERIENCE', 'DELETE_WORK_EXPERIENCE', 'ADD_WORK_PROJECT');

/**
 * PersonalProject
 */
const {
  handlePersonalProjectChange,
  addProjectTech,
  deleteProjectTech,
  addPersonalProject,
  deletePersonalProject
} = createActions({
  HANDLE_PERSONAL_PROJECT_CHANGE: (personalProject, index) =>
    ({ personalProject, index }),
  ADD_PROJECT_TECH: (tech, index) => ({ tech, index }),
  DELETE_PROJECT_TECH: (projectIndex, techIndex) =>
    ({ projectIndex, techIndex })
}, 'ADD_PERSONAL_PROJECT', 'DELETE_PERSONAL_PROJECT');

/**
 * others
 */
const {
  changeSupplement,
  changeSocialLink,
  deleteSocialLink,
  addSocialLink,
  handleOthersInfoChange,
  addLocation,
  deleteLocation,
  addSupplement,
  deleteSupplement,
  toggleDownloadButton,
  resetEdited,
} = createActions(
  {
    CHANGE_SUPPLEMENT: (supplement, index) => ({ supplement, index }),
    CHANGE_SOCIAL_LINK: (option, index) => ({ option, index }),
  },
  'DELETE_SOCIAL_LINK',
  'ADD_SOCIAL_LINK',
  'HANDLE_OTHERS_INFO_CHANGE',
  'ADD_LOCATION',
  'DELETE_LOCATION',
  'ADD_SUPPLEMENT',
  'DELETE_SUPPLEMENT',
  'TOGGLE_DOWNLOAD_BUTTON',
  'RESET_EDITED'
);

// resume share
const setPubResumeStatus = createAction('SET_PUB_RESUME_STATUS');
const initialPubResumeStatus = createAction('INITIAL_PUB_RESUME_STATUS');
const fetchPubResumeStatus = () => (dispatch) => {
  Api.resume.getResumeInfo().then((result) => {
    result && dispatch(initialPubResumeStatus(result));
  });
};

const postShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().resume.shareInfo;
  Api.resume.patchResumeInfo({ openShare: !openShare }).then(() => {
    dispatch(setPubResumeStatus(!openShare));
  });
};

// resume template
const setPubResumeTemplate = createAction('SET_PUB_RESUME_TEMPLATE');
const postShareTemplate = template => (dispatch, getState) => {
  if (template !== getState().resume.shareInfo) {
    Api.resume.patchResumeInfo({ template }).then(() => {
      dispatch(setPubResumeTemplate(template));
    });
  }
};

// resume download
const downloadResume = () => (dispatch, getState) => {
  dispatch(toggleDownloadButton(true));
  const { info } = getState().resume;
  const { name } = info;
  Api.resume.download().then((result) => {
    if (result) {
      Push.create(downloadSuccess, {
        icon: '/vendor/images/hacknical-logo-nofity.png',
        timeout: 3000,
      });
      const a = document.createElement('a');
      a.href = result;
      a.download = `${name ? `${name}-resume` : 'resume'}-hacknical.pdf`;
      a.click();
    } else {
      Push.create(downloadError, {
        icon: '/vendor/images/hacknical-logo-nofity.png',
        timeout: 3000,
      });
    }
    dispatch(toggleDownloadButton(false));
  });
};

export default {
  handleActiveSectionChange,
  // initial
  initialResume,
  fetchResume,
  // resume operation
  saveResume,
  // loading
  toggleLoading,
  togglePosting,
  resetEdited,
  // info
  handleInfoChange,
  handleEditChange,
  toggleHireAvailable,
  toggleResumeType,
  // edu
  addEducation,
  deleteEducation,
  handleEduChange,
  // workExperience
  addWorkExperience,
  deleteWorkExperience,
  addWorkProject,
  deleteWorkProject,
  addWorkProjectDetail,
  deleteWorkProjectDetail,
  handleWorkProjectChange,
  handleWorkExperienceChange,
  // personalProjects
  addPersonalProject,
  deletePersonalProject,
  handlePersonalProjectChange,
  addProjectTech,
  deleteProjectTech,
  // others
  changeSupplement,
  changeSocialLink,
  deleteSocialLink,
  addSocialLink,
  handleOthersInfoChange,
  addLocation,
  deleteLocation,
  addSupplement,
  deleteSupplement,
  // resume share
  setPubResumeStatus,
  initialPubResumeStatus,
  fetchPubResumeStatus,
  postShareStatus,
  setPubResumeTemplate,
  postShareTemplate,
  // resume download
  downloadResume,
  toggleDownloadButton
};
