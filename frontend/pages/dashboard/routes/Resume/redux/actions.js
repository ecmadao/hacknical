
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
  handleActiveSectionChange,
  setResumeList,
  setCurrentResumeInfo
} = createActions(
  'TOGGLE_EDITED',
  'TOGGLE_LOADING',
  'TOGGLE_POSTING',
  'INITIAL_RESUME',
  'INITIAL_PUB_RESUME_STATUS',
  'HANDLE_ACTIVE_SECTION_CHANGE',
  'SET_RESUME_LIST',
  'SET_CURRENT_RESUME_INFO'
)

const fetchResume = resumeId => (dispatch, getState) => {
  const targetResumeId = resumeId || getState().resume.currentResumeId
  dispatch(toggleLoading(true))
  return API.resume.getResume({ resumeId: targetResumeId }).then((result) => {
    if (result) {
      dispatch(initialResume(result))
    } else {
      dispatch(toggleLoading(false))
    }
    return result
  }).catch(() => {
    dispatch(toggleLoading(false))
  })
}

const saveResume = params => (dispatch, getState) => {
  const { resume } = getState()
  const { others, currentResumeId } = resume
  const { socialLinks } = others

  if (resume.posting) return Promise.resolve()
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
    resumeList,
    currentResumeTitle,
    currentIsDefault,
    ...postData
  } = postResume

  const { resumeSections } = shareInfo

  return API.resume
    .patchResumeInfo({ resumeSections }, { resumeId: currentResumeId })
    .then(() => {
      return API.resume.setResume({ ...postData, resumeId: currentResumeId }, params).then((result) => {
        result && dispatch(initialPubResumeStatus(result))
        dispatch(togglePosting(false))
        dispatch(toggleEdited(false))
        return result
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
    CHANGE_MODULE_TITLE: (moduleIndexOrPreTitle, title) => {
      if (typeof moduleIndexOrPreTitle === 'number') {
        return { moduleIndex: moduleIndexOrPreTitle, title }
      }
      return { preTitle: moduleIndexOrPreTitle, title }
    },
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

const fetchPubResumeStatus = resumeId => (dispatch, getState) => {
  const targetResumeId = resumeId || getState().resume.currentResumeId
  return API.resume.getResumeInfo({ resumeId: targetResumeId }).then((result) => {
    result && dispatch(initialPubResumeStatus(result))
    return result
  })
}

const fetchResumeList = () => (dispatch) => {
  return API.resume.getResumeList().then((result) => {
    if (result) {
      dispatch(setResumeList(result))
    }
    return result
  })
}

const switchResume = resumeId => (dispatch, getState) => {
  const { currentResumeId, edited, posting, loading } = getState().resume
  if (!resumeId || resumeId === currentResumeId || loading) return Promise.resolve()

  const proceed = () => {
    return dispatch(fetchPubResumeStatus(resumeId)).then(() => {
      return dispatch(fetchResume(resumeId))
    }).then(() => {
      return dispatch(fetchResumeList())
    })
  }

  if (edited && !posting) {
    return dispatch(saveResume()).then(proceed)
  }
  return proceed()
}

const createNewResume = (title, copyFromResumeId) => (dispatch) => {
  return API.resume.createResume({ title, copyFromResumeId }).then((result) => {
    if (result) {
      dispatch(fetchResumeList())
      if (result.resumeId) {
        dispatch(switchResume(result.resumeId))
      }
    }
    return result
  })
}

const deleteResume = resumeId => (dispatch, getState) => {
  return API.resume.deleteResume(resumeId).then((result) => {
    if (result) {
      dispatch(setResumeList(result))
      const { currentResumeId } = getState().resume
      if (resumeId === currentResumeId) {
        const defaultItem = result.find(r => r.isDefault) || result[0]
        if (defaultItem) {
          dispatch(switchResume(defaultItem.resumeId))
        }
      }
    }
    return result
  })
}

const setDefaultResume = resumeId => (dispatch) => {
  return API.resume.setDefaultResume(resumeId).then((result) => {
    if (result) {
      dispatch(setResumeList(result))
      dispatch(initialPubResumeStatus({ isDefault: true }))
    }
    return result
  })
}

const renameResume = (resumeId, title) => (dispatch, getState) => {
  return API.resume.renameResume(resumeId, title).then((result) => {
    if (result) {
      dispatch(fetchResumeList())
      const { currentResumeId } = getState().resume
      if (resumeId === currentResumeId) {
        dispatch(setCurrentResumeInfo({ title: result.title }))
      }
    }
    return result
  })
}

const copyResume = (resumeId, title) => (dispatch) => {
  return API.resume.copyResume(resumeId, title).then((result) => {
    if (result) {
      dispatch(fetchResumeList())
      if (result.resumeId) {
        dispatch(switchResume(result.resumeId))
      }
    }
    return result
  })
}

const postShareStatus = () => (dispatch, getState) => {
  const { openShare, resumeId } = getState().resume.shareInfo
  const currentResumeId = resumeId || getState().resume.currentResumeId
  API.resume.patchResumeInfo({ openShare: !openShare }, { resumeId: currentResumeId }).then(() => {
    dispatch(initialPubResumeStatus({ openShare: !openShare }))
  })
}

// resume template
const postShareTemplate = template => (dispatch, getState) => {
  const { shareInfo, currentResumeId } = getState().resume
  if (template !== shareInfo.template) {
    const targetId = shareInfo.resumeId || currentResumeId
    API.resume.patchResumeInfo({ template }, { resumeId: targetId }).then(() => {
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
  addModuleSection,
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
    // multi resumes
    setResumeList,
    setCurrentResumeInfo,
    fetchResumeList,
    switchResume,
    createNewResume,
    deleteResume,
    setDefaultResume,
    renameResume,
    copyResume
  },
  Object.keys(resumeEditActions).reduce((dict, name) => {
    dict[name] = handleResumeChange(resumeEditActions[name])
    return dict
  }, {})
)
