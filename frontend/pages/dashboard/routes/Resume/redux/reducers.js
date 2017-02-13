import { handleActions } from 'redux-actions';

import {
  EDU,
  INFO,
  OTHERS,
  WORK_EXPERIENCE,
  WORK_PROJECT,
  PERSONAL_PROJECT,
  SOCIAL_LINKS
} from 'SHAREDPAGE/datas/resume';
import {
  objectassign,
  validateSocialLinks
} from 'SHAREDPAGE/utils/resume';
import dateHelper from 'UTILS/date';

const getDateBeforeYears = dateHelper.date.beforeYears;
const getCurrentDate = dateHelper.validator.fullDate;
const initialState = {
  loading: true,
  info: objectassign({}, INFO),
  educations: [],
  workExperiences: [],
  personalProjects: [],
  others: objectassign({}, OTHERS),
  shareInfo: {
    url: '',
    openShare: true,
    useGithub: true
  }
};

// const initialState = {
//   info: {
//     name: 'ecmadao',
//     email: 'wlec@outlook.com',
//     phone: '15659279468',
//     gender: 'male',
//     location: 'beijing',
//     avator: 'https://avatars0.githubusercontent.com/u/10706318?v=3&u=a88a9a2703b6b014e7b7b0a2039b8663dfcf2c6f&s=400',
//     intention: 'Node全栈工程师'
//   },
//   educations: [
//     {
//       school: '厦门大学',
//       major: '材料科学与工程',
//       education: '本科',
//       startTime: '2011-11-01',
//       endTime: '2016-07-01'
//     },
//     {
//       school: '厦门大学',
//       major: '材料科学与工程',
//       education: '本科',
//       startTime: '2011-11-01',
//       endTime: '2016-07-01'
//     }
//   ],
//   workExperiences: [
//     {
//       company: '厦门市创艺社',
//       url: 'tshe.com',
//       startTime: '2016-02-01',
//       endTime: '2016-11-01',
//       position: '前端工程师',
//       projects: [
//         {
//           name: 'T社官网建设与更新、维护',
//           details: ['官网核心功能建设', '网站一周一次的功能迭代和部署', '独立编写内部流程管理App', '内部后台网站更新']
//         },
//         {
//           name: 'T社后台供应链App',
//           details: ['学习React Native', '走访工厂，调研需求', 'App页面设计与架构设计', '最终使用RN + Redux开发出一套后台工厂人员使用的流程管理Android App']
//         }
//       ]
//     }
//   ],
//   personalProjects: [
//     {
//       url: 'https://ecmadao.github.io/react-times',
//       title: 'React 时间选择器',
//       desc: '基于 React 的时间选择器，没有 jQuery 依赖。已发布为NPM包',
//       techs: ['javascript', 'webpack', 'react']
//     }
//   ],
//   others: {
//     expectLocation: '北京',
//     expectLocations: ['北京'],
//     expectSalary: '20000',
//     // expectPosition: 'NodeJS全栈',
//     dream: '希望能进入到一个活跃的、学习氛围很好的很极客的团队',
//     supplements: [
//       '很强的学习能力和兴趣',
//       '除去开发以外，对设计、交互、产品都有自己的见解和追求',
//       '长期活跃于github，不断学习并贡献内容',
//       '想成为一个优秀的全栈。但自己所理解的全栈并不仅仅是前后端开发，而是能够从产品、设计、开发等多角度切入，善于思考与创作产品的开发者'
//     ],
//     socialLinks: [...SOCIAL_LINKS]
//   }
// };


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
    return ({
      ...state,
      educations: [...educations, objectassign(EDU, {
        startTime: getDateBeforeYears(1),
        endTime: getCurrentDate()
      })]
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
    const { openShare, url, useGithub } = action.payload;
    const { shareInfo } = state;
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, { openShare, url, useGithub })
    });
  },

  SET_PUB_RESUME_STATUS(state, action) {
    const openShare = action.payload;
    const { shareInfo } = state;
    return ({
      ...state,
      shareInfo: objectassign(shareInfo, { openShare })
    });
  }
}, initialState);

export default reducers;
