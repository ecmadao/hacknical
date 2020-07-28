
import shortid from 'shortid'
import { handleActions } from 'redux-actions'

import {
  EDU,
  INFO,
  OTHERS,
  WORK_PROJECT,
  CUSTOM_SECTION,
  WORK_EXPERIENCE,
  PERSONAL_PROJECT,
  RESUME_SECTIONS,
} from 'UTILS/constant/resume'
import {
  objectassign,
  validateSocialLinks
} from 'UTILS/resume'
import dateHelper from 'UTILS/date'
import { sortBySeconds } from 'UTILS/helper'

const sortByDate = sortBySeconds('startTime', -1)
const getDateBeforeYears = dateHelper.date.beforeYears
const getCurrentDate = dateHelper.validator.fullDate

const initialState = {
  loading: true,
  posting: false,
  edited: false,
  info: objectassign({}, INFO),
  educations: [],
  workExperiences: [],
  personalProjects: [],
  others: objectassign({}, OTHERS),
  shareInfo: {
    url: '',
    github: {},
    openShare: false,
    useGithub: false,
    resumeHash: '',
    template: 'v1',
    autosave: false
  },
  customModules: [],
  downloadDisabled: false,
  sections: RESUME_SECTIONS.normal,
  activeSection: RESUME_SECTIONS.normal[0].id,
}

const reducers = handleActions({
  // initial
  INITIAL_RESUME(state, action) {
    const {
      info,
      others,
      educations,
      workExperiences,
      personalProjects,
      customModules = [],
    } = action.payload
    const sections = info.freshGraduate
      ? RESUME_SECTIONS.freshGraduate
      : RESUME_SECTIONS.normal

    return ({
      ...state,
      loading: false,
      sections: [...sections],
      activeSection: sections[0].id,
      info: objectassign(state.info, info),
      educations: [...educations].sort(sortByDate),
      workExperiences: workExperiences.map((workExperience, i) => objectassign(workExperience, {
        id: `workExperiences.${i + 1}`,
        projects: workExperience.projects.map((project, j) => objectassign(project, {
          id: `workExperiences.${i + 1}.projects.${j + 1}`
        }))
      })).sort(sortByDate),
      personalProjects: [...personalProjects],
      others: objectassign(state.others, objectassign(others, {
        socialLinks: [...validateSocialLinks(others.socialLinks)]
      })),
      customModules: [...customModules]
    })
  },
  // loading
  TOGGLE_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    })
  },
  TOGGLE_POSTING(state, action) {
    return ({
      ...state,
      posting: action.payload
    })
  },
  TOGGLE_EDITED(state, action) {
    return ({
      ...state,
      edited: action.payload,
    })
  },
  HANDLE_ACTIVE_SECTION_CHANGE(state, action) {
    return ({
      ...state,
      activeSection: action.payload
    })
  },
  // info
  HANDLE_INFO_CHANGE(state, action) {
    const { info } = state
    const {
      freshGraduate = info.freshGraduate
    } = action.payload
    const sections = freshGraduate
      ? RESUME_SECTIONS.freshGraduate
      : RESUME_SECTIONS.normal
    return ({
      ...state,
      sections: [...sections],
      info: objectassign(info, action.payload),
    })
  },

  // educations
  ADD_EDUCATION(state, action) {
    const { educations } = state
    const index = action.payload || educations.length

    const newEdu = objectassign(EDU, {
      startTime: getDateBeforeYears(1),
      endTime: getCurrentDate()
    })
    return ({
      ...state,
      educations: [
        ...educations.slice(0, index),
        newEdu,
        ...educations.slice(index)
      ]
    })
  },

  DELETE_EDUCATION(state, action) {
    const { educations } = state
    const index = action.payload
    return ({
      ...state,
      educations: [
        ...educations.slice(0, index),
        ...educations.slice(index + 1)
      ]
    })
  },

  CHANGE_EDUCATION(state, action) {
    const { educations } = state
    const { edu, index } = action.payload
    return ({
      ...state,
      educations: [
        ...educations.slice(0, index),
        objectassign(educations[index], edu),
        ...educations.slice(index + 1)
      ]
    })
  },

  // workExperiences
  ADD_WORK_EXPERIENCE(state, action) {
    const { workExperiences } = state
    const index = action.payload || workExperiences.length

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, index),
        objectassign(WORK_EXPERIENCE, {
          startTime: getDateBeforeYears(1),
          endTime: getCurrentDate(),
          projects: [],
          id: `workExperiences.${index + 1}`
        }),
        ...workExperiences.slice(index)
      ]
    })
  },

  DELETE_WORK_EXPERIENCE(state, action) {
    const { workExperiences } = state
    const index = action.payload
    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, index),
        ...workExperiences.slice(index + 1)
      ]
    })
  },

  ADD_WORK_PROJECT(state, action) {
    const { workExperiences } = state
    const index = action.payload
    const workExperience = workExperiences[index]

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, index),
        objectassign(workExperience, {
          projects: [...workExperience.projects, objectassign(WORK_PROJECT, {
            id: `workExperiences.${index + 1}.projects.${workExperience.projects.length + 1}`
          })]
        }),
        ...workExperiences.slice(index + 1)
      ]
    })
  },

  REORDER_WORK_PROJECT(state, action) {
    const { workExperiences } = state
    const { workIndex, order } = action.payload

    const workExperience = workExperiences[workIndex]
    const { projects } = workExperience

    const fromIndex = order.source.index;
    const toIndex = order.destination.index;

    const [project] = projects.splice(fromIndex, 1);
    projects.splice(toIndex, 0, project);

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [...projects]
        }),
        ...workExperiences.slice(workIndex + 1)
      ]
    })
  },

  DELETE_WORK_PROJECT(state, action) {
    const { workExperiences } = state
    const { workIndex, projectIndex } = action.payload
    const workExperience = workExperiences[workIndex]
    const { projects } = workExperience

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [...projects.slice(0, projectIndex),
            ...projects.slice(projectIndex + 1)]
        }),
        ...workExperiences.slice(workIndex + 1)
      ]
    })
  },

  ADD_WORK_PROJECT_DETAIL(state, action) {
    const { workExperiences } = state
    const { detail, workIndex, projectIndex } = action.payload
    const workExperience = workExperiences[workIndex]
    const { projects } = workExperience
    const project = projects[projectIndex]

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [
            ...projects.slice(0, projectIndex),
            objectassign(project, {
              details: [...project.details, detail]
            }),
            ...projects.slice(projectIndex + 1)
          ]
        }),
        ...workExperiences.slice(workIndex + 1)
      ]
    })
  },

  DELETE_WORK_PROJECT_DETAIL(state, action) {
    const { workExperiences } = state
    const { detailIndex, workIndex, projectIndex } = action.payload
    const workExperience = workExperiences[workIndex]
    const { projects } = workExperience
    const project = projects[projectIndex]

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [
            ...projects.slice(0, projectIndex),
            objectassign(project, {
              details: [
                ...project.details.slice(0, detailIndex),
                ...project.details.slice(detailIndex + 1)
              ]
            }),
            ...projects.slice(projectIndex + 1)
          ]
        }),
        ...workExperiences.slice(workIndex + 1)
      ]
    })
  },

  HANDLE_WORK_PROJECT_CHANGE(state, action) {
    const { workExperiences } = state
    const { workProject, workIndex, projectIndex } = action.payload
    const workExperience = workExperiences[workIndex]
    const { projects } = workExperience
    const project = projects[projectIndex]

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [
            ...projects.slice(0, projectIndex),
            objectassign(project, workProject),
            ...projects.slice(projectIndex + 1)
          ]
        }),
        ...workExperiences.slice(workIndex + 1)
      ]
    })
  },

  HANDLE_WORK_EXPERIENCE_CHANGE(state, action) {
    const { workExperiences } = state
    const { workExperience, index } = action.payload

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, index),
        objectassign(workExperiences[index], workExperience),
        ...workExperiences.slice(index + 1)
      ]
    })
  },

  // personalProjects
  ADD_PERSONAL_PROJECT(state) {
    const { personalProjects } = state
    return ({
      ...state,
      personalProjects: [
        ...personalProjects,
        objectassign({}, PERSONAL_PROJECT)
      ]
    })
  },

  DELETE_PERSONAL_PROJECT(state, action) {
    const { personalProjects } = state
    const index = action.payload

    return ({
      ...state,
      personalProjects: [
        ...personalProjects.slice(0, index),
        ...personalProjects.slice(index + 1)
      ]
    })
  },

  HANDLE_PERSONAL_PROJECT_CHANGE(state, action) {
    const { personalProject, index } = action.payload
    const { personalProjects } = state

    return ({
      ...state,
      personalProjects: [
        ...personalProjects.slice(0, index),
        objectassign(personalProjects[index], personalProject),
        ...personalProjects.slice(index + 1)
      ]
    })
  },

  ADD_PROJECT_TECH(state, action) {
    const { tech, index } = action.payload
    const { personalProjects } = state
    const personalProject = personalProjects[index]

    return ({
      ...state,
      personalProjects: [
        ...personalProjects.slice(0, index),
        objectassign(personalProject, {
          techs: [...personalProject.techs, tech]
        }),
        ...personalProjects.slice(index + 1)
      ]
    })
  },

  DELETE_PROJECT_TECH(state, action) {
    const { projectIndex, techIndex } = action.payload
    const { personalProjects } = state
    const personalProject = personalProjects[projectIndex]
    const { techs } = personalProject

    return ({
      ...state,
      personalProjects: [
        ...personalProjects.slice(0, projectIndex),
        objectassign(personalProject, {
          techs: [
            ...techs.slice(0, techIndex),
            ...techs.slice(techIndex + 1)
          ]
        }),
        ...personalProjects.slice(projectIndex + 1)
      ]
    })
  },

  // others
  HANDLE_OTHERS_INFO_CHANGE(state, action) {
    const { others } = state
    return ({
      ...state,
      others: objectassign(others, action.payload)
    })
  },

  ADD_LOCATION(state, action) {
    const { others } = state
    const { expectLocations } = others
    return ({
      ...state,
      others: objectassign(others, {
        expectLocations: [...expectLocations, action.payload]
      })
    })
  },

  DELETE_LOCATION(state, action) {
    const { others } = state
    const { expectLocations } = others
    const index = action.payload
    return ({
      ...state,
      others: objectassign(others, {
        expectLocations: [
          ...expectLocations.slice(0, index),
          ...expectLocations.slice(index + 1)
        ]
      })
    })
  },

  CHANGE_SUPPLEMENT(state, action) {
    const { others } = state
    const { supplements } = others
    const { supplement, index } = action.payload

    return ({
      ...state,
      others: objectassign(others, {
        supplements: [
          ...supplements.slice(0, index),
          supplement,
          ...supplements.slice(index + 1)
        ]
      })
    })
  },

  ADD_SUPPLEMENT(state, action) {
    const { others } = state
    const { supplements } = others
    return ({
      ...state,
      others: objectassign(others, {
        supplements: [...supplements, action.payload]
      })
    })
  },

  DELETE_SUPPLEMENT(state, action) {
    const { others } = state
    const { supplements } = others
    const index = action.payload
    return ({
      ...state,
      others: objectassign(others, {
        supplements: [
          ...supplements.slice(0, index),
          ...supplements.slice(index + 1)
        ]
      })
    })
  },

  CHANGE_SOCIAL_LINK(state, action) {
    const { others } = state
    const { socialLinks } = others
    const { option, index } = action.payload
    return ({
      ...state,
      others: objectassign(others, {
        socialLinks: [
          ...socialLinks.slice(0, index),
          objectassign(socialLinks[index], option),
          ...socialLinks.slice(index + 1)
        ]
      })
    })
  },

  DELETE_SOCIAL_LINK(state, action) {
    const index = action.payload
    const { others } = state
    const { socialLinks } = others

    return ({
      ...state,
      others: objectassign(others, {
        socialLinks: [
          ...socialLinks.slice(0, index),
          ...socialLinks.slice(index + 1)
        ]
      })
    })
  },

  ADD_SOCIAL_LINK(state) {
    const { others } = state
    const { socialLinks } = others

    return ({
      ...state,
      others: objectassign(others, {
        socialLinks: [...socialLinks, {
          url: '',
          name: '',
          deleteable: true,
          icon: 'browser.png',
        }]
      })
    })
  },

  // resume share
  INITIAL_PUB_RESUME_STATUS(state, action) {
    const newShareInfo = action.payload
    const { shareInfo } = state
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, newShareInfo)
    })
  },

  SET_PUB_RESUME_STATUS(state, action) {
    const openShare = action.payload
    const { shareInfo } = state
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, { openShare })
    })
  },

  SET_PUB_RESUME_TEMPLATE(state, action) {
    const template = action.payload
    const { shareInfo } = state
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, { template })
    })
  },

  // resume download
  TOGGLE_DOWNLOAD_BUTTON(state, action) {
    return ({
      ...state,
      downloadDisabled: action.payload
    })
  },

  // custom module
  ADD_CUSTOM_MODULE(state, action) {
    const { customModules } = state
    const id = shortid.generate()
    return ({
      ...state,
      customModules: [
        ...customModules,
        { id, text: action.payload, sections: [] }
      ],
      activeSection: id
    })
  },

  REMOVE_CUSTOM_MODULE(state, action) {
    const moduleId = action.payload
    const { sections, customModules, activeSection } = state

    const allSections = [...sections, ...customModules]
    const activeIndex = allSections.findIndex(module => module.id === activeSection)
    const moduleIndex = activeIndex - sections.length
    let nextIndex = activeIndex

    if (activeSection === moduleId) {
      if (activeIndex === allSections.length - 1) {
        nextIndex = allSections.length - 2
      }
    }

    const newModules = [
      ...customModules.slice(0, moduleIndex),
      ...customModules.slice(moduleIndex + 1)
    ]
    return ({
      ...state,
      customModules: newModules,
      activeSection: [...sections, ...newModules][nextIndex].id
    })
  },

  ADD_MODULE_SECTION(state, action) {
    const { customModules } = state
    const index = action.payload
    const customModule = customModules[index]

    return ({
      ...state,
      customModules: [
        ...customModules.slice(0, index),
        Object.assign({}, customModule, {
          sections: [...customModule.sections, Object.assign({}, CUSTOM_SECTION)],
          ...customModules.slice(index + 1)
        })
      ]
    })
  },

  DELETE_MODULE_SECTION(state, action) {
    const { customModules } = state
    const { moduleIndex, sectionIndex } = action.payload
    const customModule = customModules[moduleIndex]
    const { sections } = customModule

    return ({
      ...state,
      customModules: [
        ...customModules.slice(0, moduleIndex),
        Object.assign({}, customModule, {
          sections: [
            ...sections.slice(0, sectionIndex),
            ...sections.slice(sectionIndex + 1),
          ]
        }),
        ...customModules.slice(moduleIndex + 1),
      ],
    })
  },

  CHANGE_MODULE_SECTION(state, action) {
    const { customModules } = state
    const { section, moduleIndex, sectionIndex } = action.payload
    const customModule = customModules[moduleIndex]
    const { sections } = customModule

    return ({
      ...state,
      customModules: [
        ...customModules.slice(0, moduleIndex),
        Object.assign({}, customModule, {
          sections: [
            ...sections.slice(0, sectionIndex),
            Object.assign({}, sections[sectionIndex], section),
            ...sections.slice(sectionIndex + 1),
          ]
        }),
        ...customModules.slice(moduleIndex + 1),
      ],
    })
  },

  CHANGE_MODULE_TITLE(state, action) {
    const { customModules } = state
    const { preTitle, title } = action.payload
    const index = customModules.findIndex(module => module.text === preTitle)

    return ({
      ...state,
      customModules: [
        ...customModules.slice(0, index),
        Object.assign({}, customModules[index], { text: title }),
        ...customModules.slice(index + 1)
      ]
    })
  },

}, initialState)

export default reducers
