import { handleActions } from 'redux-actions';

import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS
} from 'SHARED/datas/resume';
import {
  objectassign,
  validateSocialLinks
} from 'SHARED/utils/resume';
import dateHelper from 'UTILS/date';

const getDateBeforeYears = dateHelper.date.beforeYears;
const getCurrentDate = dateHelper.validator.fullDate;
const initialState = {
  loading: true,
  posting: false,
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
    resumeHash: ''
  },
  downloadDisabled: false
};


const reducers = handleActions({
  // initial
  INITIAL_RESUME(state, action) {
    const {
      info,
      educations,
      workExperiences,
      personalProjects,
      others
    } = action.payload;
    return ({
      ...state,
      loading: false,
      info: objectassign(state.info, info),
      educations: [...educations],
      workExperiences: [...workExperiences],
      personalProjects: [...personalProjects],
      others: objectassign(state.others, objectassign(others, {
        socialLinks: [...validateSocialLinks(others.socialLinks)]
      }))
    });
  },
  // loading
  TOGGLE_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },
  TOGGLE_POSTING(state, action) {
    return ({
      ...state,
      posting: action.payload
    });
  },
  // info
  HANDLE_INFO_CHANGE(state, action) {
    const { info } = state;
    return ({
      ...state,
      info: objectassign(info, action.payload)
    });
  },

  // educations
  ADD_EDUCATION(state, action) {
    const { educations } = state;
    const newEdu = objectassign(EDU, {
      startTime: getDateBeforeYears(1),
      endTime: getCurrentDate()
    });
    return ({
      ...state,
      educations: [...educations, newEdu]
    });
  },

  DELETE_EDUCATION(state, action) {
    const { educations } = state;
    const index = action.payload;
    return ({
      ...state,
      educations: [...educations.slice(0, index),
        ...educations.slice(index + 1)]
    });
  },

  HANDLE_EDU_CHANGE(state, action) {
    const { educations } = state;
    const { edu, index } = action.payload;
    return ({
      ...state,
      educations: [...educations.slice(0, index),
        objectassign(educations[index], edu),
        ...educations.slice(index + 1)]
    });
  },

  // workExperiences
  ADD_WORK_EXPERIENCE(state, action) {
    const { workExperiences } = state;
    return ({
      ...state,
      workExperiences: [...workExperiences, objectassign(WORK_EXPERIENCE, {
        startTime: getDateBeforeYears(1),
        endTime: getCurrentDate(),
        projects: []
      })]
    });
  },

  DELETE_WORK_EXPERIENCE(state, action) {
    const { workExperiences } = state;
    const index = action.payload;
    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, index),
        ...workExperiences.slice(index + 1)]
    });
  },

  ADD_WORK_PROJECT(state, action) {
    const { workExperiences } = state;
    const index = action.payload;
    const workExperience = workExperiences[index];

    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, index),
        objectassign(workExperience, {
          projects: [...workExperience.projects, WORK_PROJECT]
        }),
        ...workExperiences.slice(index + 1)]
    });
  },

  DELETE_WORK_PROJECT(state, action) {
    const { workExperiences } = state;
    const { workIndex, projectIndex } = action.payload;
    const workExperience = workExperiences[workIndex];
    const { projects } = workExperience;

    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [...projects.slice(0, projectIndex),
            ...projects.slice(projectIndex + 1)]
        }),
        ...workExperiences.slice(workIndex + 1)]
    });
  },

  ADD_WORK_PROJECT_DETAIL(state, action) {
    const { workExperiences } = state;
    const { detail, workIndex, projectIndex } = action.payload;
    const workExperience = workExperiences[workIndex];
    const { projects } = workExperience;
    const project = projects[projectIndex];

    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [...projects.slice(0, projectIndex),
            objectassign(project, {
              details: [...project.details, detail]
            }),
            ...projects.slice(projectIndex + 1)]
        }),
        ...workExperiences.slice(workIndex + 1)]
    })
  },

  DELETE_WORK_PROJECT_DETAIL(state, action) {
    const { workExperiences } = state;
    const { detailIndex, workIndex, projectIndex } = action.payload;
    const workExperience = workExperiences[workIndex];
    const { projects } = workExperience;
    const project = projects[projectIndex];

    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [...projects.slice(0, projectIndex),
            objectassign(project, {
              details: [...project.details.slice(0, detailIndex),
                ...project.details.slice(detailIndex + 1)]
            }),
            ...projects.slice(projectIndex + 1)]
        }),
        ...workExperiences.slice(workIndex + 1)]
    })
  },

  HANDLE_WORK_PROJECT_CHANGE(state, action) {
    const { workExperiences } = state;
    const { workProject, workIndex, projectIndex } = action.payload;
    const workExperience = workExperiences[workIndex];
    const { projects } = workExperience;
    const project = projects[projectIndex];

    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, workIndex),
        objectassign(workExperience, {
          projects: [...projects.slice(0, projectIndex),
            objectassign(project, workProject),
            ...projects.slice(projectIndex + 1)]
        }),
        ...workExperiences.slice(workIndex + 1)]
    })
  },

  HANDLE_WORK_EXPERIENCE_CHANGE(state, action) {
    const { workExperiences } = state;
    const { workExperience, index } = action.payload;

    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, index),
        objectassign(workExperiences[index], workExperience),
        ...workExperiences.slice(index + 1)]
    });
  },

  // personalProjects
  ADD_PERSONAL_PROJECT(state, action) {
    const { personalProjects } = state;
    return ({
      ...state,
      personalProjects: [...personalProjects, objectassign({}, PERSONAL_PROJECT)]
    });
  },

  DELETE_PERSONAL_PROJECT(state, action) {
    const { personalProjects } = state;
    const index = action.payload;

    return ({
      ...state,
      personalProjects: [...personalProjects.slice(0, index),
        ...personalProjects.slice(index + 1)]
    });
  },

  HANDLE_PERSONAL_PROJECT_CHANGE(state, action) {
    const { personalProject, index } = action.payload;
    const { personalProjects } = state;

    return ({
      ...state,
      personalProjects: [...personalProjects.slice(0, index),
        objectassign(personalProjects[index], personalProject),
        ...personalProjects.slice(index + 1)]
    });
  },

  ADD_PROJECT_TECH(state, action) {
    const { tech, index } = action.payload;
    const { personalProjects } = state;
    const personalProject = personalProjects[index];

    return ({
      ...state,
      personalProjects: [...personalProjects.slice(0, index),
        objectassign(personalProject, {
          techs: [...personalProject.techs, tech]
        }),
        ...personalProjects.slice(index + 1)]
    });
  },

  DELETE_PROJECT_TECH(state, action) {
    const { projectIndex, techIndex } = action.payload;
    const { personalProjects } = state;
    const personalProject = personalProjects[projectIndex];
    const { techs } = personalProject;

    return ({
      ...state,
      personalProjects: [...personalProjects.slice(0, projectIndex),
        objectassign(personalProject, {
          techs: [...techs.slice(0, techIndex), ...techs.slice(techIndex + 1)]
        }),
        ...personalProjects.slice(projectIndex + 1)]
    });
  },

  // others
  HANDLE_OTHERS_INFO_CHANGE(state, action) {
    const { others } = state;
    return ({
      ...state,
      others: objectassign(others, action.payload)
    });
  },

  ADD_LOCATION(state, action) {
    const { others } = state;
    const { expectLocations } = others;
    return ({
      ...state,
      others: objectassign(others, {
        expectLocations: [...expectLocations, action.payload]
      })
    });
  },

  DELETE_LOCATION(state, action) {
    const { others } = state;
    const { expectLocations } = others;
    const index = action.payload;
    return ({
      ...state,
      others: objectassign(others, {
        expectLocations: [...expectLocations.slice(0, index),
          ...expectLocations.slice(index + 1)]
      })
    });
  },

  CHANGE_SUPPLEMENT(state, action) {
    const { others } = state;
    const { supplements } = others;
    const { supplement, index } = action.payload;

    return ({
      ...state,
      others: objectassign(others, {
        supplements: [...supplements.slice(0, index),
          supplement,
          ...supplements.slice(index + 1)]
      })
    });
  },

  ADD_SUPPLEMENT(state, action) {
    const { others } = state;
    const { supplements } = others;
    return ({
      ...state,
      others: objectassign(others, {
        supplements: [...supplements, action.payload]
      })
    });
  },

  DELETE_SUPPLEMENT(state, action) {
    const { others } = state;
    const { supplements } = others;
    const index = action.payload;
    return ({
      ...state,
      others: objectassign(others, {
        supplements: [...supplements.slice(0, index),
          ...supplements.slice(index + 1)]
      })
    });
  },

  CHANGE_SOCIAL_LINK(state, action) {
    const { others } = state;
    const { socialLinks } = others;
    const { url, index } = action.payload;
    return ({
      ...state,
      others: objectassign(others, {
        socialLinks: [...socialLinks.slice(0, index),
          objectassign(socialLinks[index], { url }),
          ...socialLinks.slice(index + 1)]
      })
    });
  },

  // resume share
  INITIAL_PUB_RESUME_STATUS(state, action) {
    const newShareInfo = action.payload;
    const { shareInfo } = state;
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, newShareInfo)
    });
  },

  SET_PUB_RESUME_STATUS(state, action) {
    const openShare = action.payload;
    const { shareInfo } = state;
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, { openShare })
    });
  },

  // resume download
  TOGGLE_DOWNLOAD_BUTTON(state, action) {
    return ({
      ...state,
      downloadDisabled: action.payload
    });
  },

}, initialState);

export default reducers;
