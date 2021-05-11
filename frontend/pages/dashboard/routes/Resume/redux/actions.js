
import { createAction, createActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'
import API from 'API'
import { wrapper } from './wrapper'
import { throttle } from 'UTILS/helper'

/**
 * initial
 */

const {
  toggleEdited,
  toggleLoading,
  togglePosting,
  initialResume,
  initialPubResumeStatus,
  handleActiveSectionChange
} = createActions(
  'TOGGLE_EDITED',
  'TOGGLE_LOADING',
  'TOGGLE_POSTING',
  'INITIAL_RESUME',
  'INITIAL_PUB_RESUME_STATUS',
  'HANDLE_ACTIVE_SECTION_CHANGE'
)

const fetchResume = () => (dispatch) => {
  API.resume.getResume().then((result) => {
    if (result) {
      dispatch(initialResume(result))
    } else {
      dispatch(toggleLoading(false))
    }
  })
}

const saveResume = params => (dispatch, getState) => {
  const { resume } = getState()
  const { others } = resume
  const { socialLinks } = others

  if (resume.posting) return
  dispatch(togglePosting(true))

  const postResume = objectAssign({}, resume, {
    others: objectAssign({}, others, {
      socialLinks: socialLinks.filter(item => item.url && (item.text || item.name))
    })
  })

  const {
    loading,
    posting,
    edited,
    shareInfo,
    sections,
    activeSection,
    downloadDisabled,
    ...postData
  } = postResume

  const { resumeSections } = shareInfo

  return API.resume
    .patchResumeInfo({ resumeSections })
    .then(() => {
      API.resume.setResume(postData, params).then((result) => {
        result && dispatch(initialPubResumeStatus(result))
        dispatch(togglePosting(false))
        dispatch(toggleEdited(false))
      })
    })
}

/**
 * info
 */
const handleInfoChange = createAction('HANDLE_INFO_CHANGE')

/**
 * Education
 */
const {
  changeEducation,
  addEducation,
  deleteEducation
} = createActions(
  {
    CHANGE_EDUCATION: (edu, index) => ({ edu, index })
  },
  'ADD_EDUCATION',
  'DELETE_EDUCATION'
)

/**
 * WorkExperience
 */
const {
  deleteWorkProject,
  reorderWorkProjects,
  reorderWorkProjectDetails,
  addWorkProjectDetail,
  deleteWorkProjectDetail,
  handleWorkProjectChange,
  handleWorkExperienceChange,
  addWorkExperience,
  deleteWorkExperience,
  addWorkProject,
} = createActions(
  {
    DELETE_WORK_PROJECT: (workIndex, projectIndex) => ({ workIndex, projectIndex }),
    REORDER_WORK_PROJECTS: (workIndex, order) => ({ workIndex, order }),
    REORDER_WORK_PROJECT_DETAILS: (workIndex, projectIndex, order) =>
      ({ workIndex, projectIndex, order }),
    ADD_WORK_PROJECT_DETAIL: (detail, workIndex, projectIndex) =>
      ({ detail, workIndex, projectIndex }),
    DELETE_WORK_PROJECT_DETAIL: (workIndex, projectIndex, detailIndex) =>
      ({ workIndex, projectIndex, detailIndex }),
    HANDLE_WORK_PROJECT_CHANGE: (workProject, workIndex, projectIndex) =>
      ({ workProject, workIndex, projectIndex }),
    HANDLE_WORK_EXPERIENCE_CHANGE: (workExperience, index) => ({ workExperience, index }),
  },
  'ADD_WORK_EXPERIENCE',
  'DELETE_WORK_EXPERIENCE',
  'ADD_WORK_PROJECT',
)

/**
 * PersonalProject
 */
const {
  handlePersonalProjectChange,
  addProjectTech,
  reorderProjectTech,
  deleteProjectTech,
  addPersonalProject,
  deletePersonalProject,
  reorderPersonalProjects,
} = createActions(
  {
    HANDLE_PERSONAL_PROJECT_CHANGE: (personalProject, index) =>
      ({ personalProject, index }),
    ADD_PROJECT_TECH: (projectIndex, tech) => ({ tech, projectIndex }),
    REORDER_PROJECT_TECH: (projectIndex, techs) => ({ techs, projectIndex }),
    DELETE_PROJECT_TECH: (projectIndex, techIndex) =>
      ({ projectIndex, techIndex })
  },
  'ADD_PERSONAL_PROJECT',
  'DELETE_PERSONAL_PROJECT',
  'REORDER_PERSONAL_PROJECTS'
)

/**
 * others
 */
const {
  changeSupplement,
  changeSocialLink,
  deleteSocialLink,
  addSocialLink,
  handleOthersInfoChange,
  addSupplement,
  deleteSupplement,
  reorderSupplements,
  toggleDownloadButton,
} = createActions(
  {
    CHANGE_SUPPLEMENT: (supplement, index) => ({ supplement, index }),
    CHANGE_SOCIAL_LINK: (option, index) => ({ option, index }),
  },
  'DELETE_SOCIAL_LINK',
  'ADD_SOCIAL_LINK',
  'HANDLE_OTHERS_INFO_CHANGE',
  'ADD_SUPPLEMENT',
  'DELETE_SUPPLEMENT',
  'REORDER_SUPPLEMENTS',
  'TOGGLE_DOWNLOAD_BUTTON',
)

/**
 * custom module
 */
const {
  changeModuleSection,
  deleteModuleSection,
  changeModuleTitle,
  updateModuleSections,
  removeCustomModule,
  addCustomModule,
  addModuleSection
} = createActions(
  {
    CHANGE_MODULE_SECTION: (section, moduleIndex, sectionIndex) =>
      ({ section, moduleIndex, sectionIndex }),
    DELETE_MODULE_SECTION: (moduleIndex, sectionIndex) =>
      ({ moduleIndex, sectionIndex }),
    CHANGE_MODULE_TITLE: (preTitle, title) => ({ preTitle, title }),
    UPDATE_MODULE_SECTIONS: (sections, moduleIndex) => ({ sections, moduleIndex })
  },
  'REMOVE_CUSTOM_MODULE',
  'ADD_CUSTOM_MODULE',
  'ADD_MODULE_SECTION',
)

// resume share
const updateResumeSections = sections => (dispatch) => {
  dispatch(initialPubResumeStatus({ resumeSections: [...sections] }))
}

const fetchPubResumeStatus = () => (dispatch) => {
  return API.resume.getResumeInfo().then((result) => {
    result && dispatch(initialPubResumeStatus(result))
  })
}

const postShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().resume.shareInfo
  API.resume.patchResumeInfo({ openShare: !openShare }).then(() => {
    dispatch(initialPubResumeStatus({ openShare: !openShare }))
  })
}

// resume template
const postShareTemplate = template => (dispatch, getState) => {
  if (template !== getState().resume.shareInfo) {
    API.resume.patchResumeInfo({ template }).then(() => {
      dispatch(initialPubResumeStatus({ template }))
    })
  }
}

const saveResumeObserver = throttle(saveResume, { delay: 13000 })

const handleResumeChange = action => wrapper({
  action,
  before: [
    dispatch => dispatch(toggleEdited(true))
  ],
  after: [
    dispatch => saveResumeObserver(dispatch)(),
  ]
})

const resumeEditActions = {
  // info
  handleInfoChange,
  // edu
  deleteEducation,
  changeEducation,
  // workExperience
  deleteWorkExperience,
  deleteWorkProject,
  reorderWorkProjects,
  reorderWorkProjectDetails,
  deleteWorkProjectDetail,
  handleWorkProjectChange,
  handleWorkExperienceChange,
  // personalProjects
  deletePersonalProject,
  reorderPersonalProjects,
  handlePersonalProjectChange,
  addProjectTech,
  deleteProjectTech,
  reorderProjectTech,
  // others
  addSupplement,
  changeSupplement,
  changeSocialLink,
  deleteSocialLink,
  handleOthersInfoChange,
  deleteSupplement,
  reorderSupplements,
  // custom
  changeModuleTitle,
  changeModuleSection,
  deleteModuleSection,
  removeCustomModule,
  addCustomModule,
  updateModuleSections,
  // sections
  updateResumeSections
}

export default objectAssign(
  {
    handleActiveSectionChange,
    // initial
    initialResume,
    fetchResume,
    // resume operation
    saveResume,
    // loading
    toggleLoading,
    toggleEdited,
    // resume share
    initialPubResumeStatus,
    fetchPubResumeStatus,
    postShareStatus,
    postShareTemplate,
    // resume download
    toggleDownloadButton,
    // edit resume
    addEducation,
    addWorkExperience,
    addWorkProject,
    addWorkProjectDetail,
    addPersonalProject,
    addSocialLink,
    // custom
    addModuleSection,
  },
  Object.keys(resumeEditActions).reduce((dict, name) => {
    dict[name] = handleResumeChange(resumeEditActions[name])
    return dict
  }, {})
)
