
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
  RESUME_SECTION_IDS,
  DEFAULT_RESUME_SECTIONS,
  validateResumeSection
} from 'UTILS/constant/resume'
import { validateSocialLinks } from 'UTILS/resume'
import objectAssign from 'UTILS/object-assign'
import dateHelper from 'UTILS/date'
import { sortBySeconds } from 'UTILS/helper'

const sortByDate = sortBySeconds('startTime', -1)
const getDateBeforeYears = dateHelper.date.beforeYears
const getCurrentDate = dateHelper.validator.fullDate

const initialState = {
  loading: true,
  posting: false,
  edited: false,
  info: objectAssign({}, INFO),
  educations: [],
  workExperiences: [],
  personalProjects: [],
  others: objectAssign({}, OTHERS),
  shareInfo: {
    url: '',
    github: {},
    openShare: false,
    useGithub: false,
    resumeHash: '',
    template: 'v1',
    autosave: false,
    resumeSections: [...DEFAULT_RESUME_SECTIONS]
  },
  customModules: [],
  downloadDisabled: false,
  activeSection: DEFAULT_RESUME_SECTIONS[0].id,
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

    const { shareInfo } = state
    const { resumeSections } = shareInfo

    return ({
      ...state,
      loading: false,
      activeSection: resumeSections[0].id,
      info: objectAssign({}, state.info, info),
      educations: [...educations].sort(sortByDate),
      workExperiences: workExperiences.map((workExperience, i) => objectAssign({}, workExperience, {
        id: `workExperiences.${i + 1}`,
        projects: workExperience.projects.map((project, j) => objectAssign({}, project, {
          id: `workExperiences.${i + 1}.projects.${j + 1}`
        }))
      })).sort(sortByDate),
      personalProjects: personalProjects.map(
        (personalProject, i) => objectAssign({}, personalProject, {
          id: `personalProjects.${i + 1}`
        })),
      others: objectAssign({}, state.others, objectAssign({}, others, {
        socialLinks: [...validateSocialLinks(others.socialLinks)]
      })),
      customModules: [...customModules],
      shareInfo: objectAssign({}, shareInfo, {
        resumeSections: resumeSections.reduce((list, section) => {
          const item = validateResumeSection(section, customModules)
          item && list.push(item)
          return list
        }, [])
      })
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

    return ({
      ...state,
      info: objectAssign({}, info, action.payload),
    })
  },

  // educations
  ADD_EDUCATION(state, action) {
    const { educations } = state
    const index = action.payload || educations.length

    const newEdu = objectAssign({}, EDU, {
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
        objectAssign({}, educations[index], edu),
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
        objectAssign({}, WORK_EXPERIENCE, {
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
        objectAssign({}, workExperience, {
          projects: [...workExperience.projects, objectAssign({}, WORK_PROJECT, {
            id: `workExperiences.${index + 1}.projects.${workExperience.projects.length + 1}`
          })]
        }),
        ...workExperiences.slice(index + 1)
      ]
    })
  },

  REORDER_WORK_PROJECTS(state, action) {
    const { workExperiences } = state
    const { workIndex, order } = action.payload

    const workExperience = workExperiences[workIndex]
    const { projects } = workExperience

    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return state

    const [project] = projects.splice(fromIndex, 1)
    projects.splice(toIndex, 0, project)

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectAssign({}, workExperience, {
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
        objectAssign({}, workExperience, {
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
        objectAssign({}, workExperience, {
          projects: [
            ...projects.slice(0, projectIndex),
            objectAssign({}, project, {
              details: [...project.details, detail]
            }),
            ...projects.slice(projectIndex + 1)
          ]
        }),
        ...workExperiences.slice(workIndex + 1)
      ]
    })
  },

  REORDER_WORK_PROJECT_DETAILS(state, action) {
    const { workExperiences } = state
    const { workIndex, projectIndex, order } = action.payload

    const { projects } = workExperiences[workIndex]
    const { details } = projects[projectIndex]

    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return state

    const [detail] = details.splice(fromIndex, 1)
    details.splice(toIndex, 0, detail)

    return ({
      ...state,
      workExperiences: [
        ...workExperiences.slice(0, workIndex),
        objectAssign({}, workExperiences[workIndex], {
          projects: [
            ...projects.slice(0, projectIndex),
            objectAssign({}, projects[projectIndex], {
              details: [...details]
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
        objectAssign({}, workExperience, {
          projects: [
            ...projects.slice(0, projectIndex),
            objectAssign({}, project, {
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
        objectAssign({}, workExperience, {
          projects: [
            ...projects.slice(0, projectIndex),
            objectAssign({}, project, workProject),
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
        objectAssign({}, workExperiences[index], workExperience),
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
        objectAssign({}, PERSONAL_PROJECT, {
          id: `personalProjects.${personalProjects.length + 1}`
        })
      ]
    })
  },

  REORDER_PERSONAL_PROJECTS(state, action) {
    const { personalProjects } = state
    const order = action.payload

    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return state

    const [personalProject] = personalProjects.splice(fromIndex, 1)
    personalProjects.splice(toIndex, 0, personalProject)

    return ({
      ...state,
      personalProjects: [...personalProjects]
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
        objectAssign({}, personalProjects[index], personalProject),
        ...personalProjects.slice(index + 1)
      ]
    })
  },

  ADD_PROJECT_TECH(state, action) {
    const { tech, projectIndex } = action.payload
    const { personalProjects } = state
    const personalProject = personalProjects[projectIndex]

    return ({
      ...state,
      personalProjects: [
        ...personalProjects.slice(0, projectIndex),
        objectAssign({}, personalProject, {
          techs: [...personalProject.techs, tech]
        }),
        ...personalProjects.slice(projectIndex + 1)
      ]
    })
  },

  REORDER_PROJECT_TECH(state, action) {
    const { techs, projectIndex } = action.payload

    const { personalProjects } = state
    const personalProject = personalProjects[projectIndex]

    return ({
      ...state,
      personalProjects: [
        ...personalProjects.slice(0, projectIndex),
        objectAssign({}, personalProject, {
          techs: [...techs]
        }),
        ...personalProjects.slice(projectIndex + 1)
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
        objectAssign({}, personalProject, {
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
      others: objectAssign({}, others, action.payload)
    })
  },

  ADD_LOCATION(state, action) {
    const { others } = state
    const { expectLocations } = others
    return ({
      ...state,
      others: objectAssign({}, others, {
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
      others: objectAssign({}, others, {
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
      others: objectAssign({}, others, {
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
      others: objectAssign({}, others, {
        supplements: [...supplements, action.payload]
      })
    })
  },

  REORDER_SUPPLEMENTS(state, action) {
    const { others } = state
    const { supplements } = others

    const order = action.payload

    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return state

    const [supplement] = supplements.splice(fromIndex, 1)
    supplements.splice(toIndex, 0, supplement)

    return ({
      ...state,
      others: objectAssign({}, others, {
        supplements: [...supplements]
      })
    })
  },

  DELETE_SUPPLEMENT(state, action) {
    const { others } = state
    const { supplements } = others
    const index = action.payload
    return ({
      ...state,
      others: objectAssign({}, others, {
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
      others: objectAssign({}, others, {
        socialLinks: [
          ...socialLinks.slice(0, index),
          objectAssign({}, socialLinks[index], option),
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
      others: objectAssign({}, others, {
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
      others: objectAssign({}, others, {
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
      shareInfo: objectAssign({}, shareInfo, newShareInfo)
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
    const { customModules, shareInfo } = state
    const { resumeSections } = shareInfo
    const id = shortid.generate()

    return ({
      ...state,
      customModules: [
        ...customModules,
        { id, text: action.payload, sections: [] }
      ],
      activeSection: id,
      shareInfo: objectAssign({}, shareInfo, {
        resumeSections: [
          ...resumeSections,
          {
            id,
            title: action.payload,
            enabled: true,
            editable: true,
            tag: RESUME_SECTION_IDS.CUSTOM,
          }
        ]
      })
    })
  },

  REMOVE_CUSTOM_MODULE(state, action) {
    const moduleId = action.payload
    const { shareInfo, customModules, activeSection } = state
    const { resumeSections } = shareInfo

    const sectionIndex = resumeSections.findIndex(section => section.id === moduleId)
    const moduleIndex = customModules.findIndex(module => module.id === moduleId)

    const newModules = [
      ...customModules.slice(0, moduleIndex),
      ...customModules.slice(moduleIndex + 1)
    ]

    let activeSectionId = activeSection
    if (moduleId === activeSection) {
      const activeIndex = sectionIndex === resumeSections.length - 1
        ? sectionIndex - 1
        : sectionIndex + 1
      activeSectionId = resumeSections[activeIndex].id
    }

    return ({
      ...state,
      customModules: newModules,
      activeSection: activeSectionId,
      shareInfo: objectAssign({}, shareInfo, {
        resumeSections: [
          ...resumeSections.slice(0, sectionIndex),
          ...resumeSections.slice(sectionIndex + 1)
        ]
      })
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

  UPDATE_MODULE_SECTIONS(state, action) {
    const { customModules } = state
    const { sections, moduleIndex } = action.payload
    const customModule = customModules[moduleIndex]

    return ({
      ...state,
      customModules: [
        ...customModules.slice(0, moduleIndex),
        Object.assign({}, customModule, {
          sections: [
            ...sections
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
