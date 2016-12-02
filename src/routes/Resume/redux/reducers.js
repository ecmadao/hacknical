import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';

const initialState = {
  info: {
    name: 'ecmadao',
    email: 'wlec@outlook.com',
    phone: '15659279468',
    gender: 'male',
    location: 'beijing',
    avator: '',
    intention: 'Node全栈工程师'
  },
  workExperiences: [
    {
      company: '厦门市创艺社',
      startTime: '2016-02-01',
      endTime: '2016-11-01',
      position: '前端工程师',
      projects: [
        {
          name: 'T社官网建设与更新、维护',
          details: ['官网核心功能建设', '网站一周一次的功能迭代和部署', '独立编写内部流程管理App', '内部后台网站更新']
        },
        {
          name: 'T社后台供应链App',
          details: ['学习React Native', '走访工厂，调研需求', 'App页面设计与架构设计', '最终使用RN + Redux开发出一套后台工厂人员使用的流程管理Android App']
        }
      ]
    }
  ],
  educations: [
    {
      school: '厦门大学',
      major: '材料科学与工程',
      education: '本科'
    }
  ],
  personalProjects: [
    {
      url: 'https://ecmadao.github.io/react-times',
      desc: '基于React的时间选择器，没有jQuery依赖。已发布为NPM包',
      tech: ['javascript', 'webpack', 'react']
    }
  ],
  others: {
    expectLocations: ['北京'],
    expectSalary: '20000',
    expectPosition: 'NodeJS全栈',
    dream: '望能进入到一个活跃的、学习氛围很好的很极客的团队',
    supplements: [
      '很强的学习能力和兴趣',
      '除去开发以外，对设计、交互、产品都有自己的见解和追求',
      '长期活跃于github，不断学习并贡献内容',
      '想成为一个优秀的全栈。但自己所理解的全栈并不仅仅是前后端开发，而是能够从产品、设计、开发等多角度切入，善于思考与创作产品的开发者'
    ]
  }
};

const reducers = handleActions({
  HANDLE_INFO_CHANGE(state, action) {
    const {info} = state;
    return ({
      ...state,
      info: objectAssign({}, info, action.payload)
    });
  },

  // workExperiences
  ADD_WORK_EXPERIENCE(state, action) {
    const {workExperiences} = state;
    return ({
      ...state,
      workExperiences: [...workExperiences, action.payload]
    });
  },

  DELETE_WORK_EXPERIENCE(state, action) {
    const {workExperiences} = state;
    const index = action.payload;
    return ({
      ...state,
      workExperiences: [...workExperiences.slice(0, index), ...workExperiences.slice(index + 1)]
    });
  },

  // educations
  ADD_EDUCATION(state, action) {
    const {educations} = state;
    return ({
      ...state,
      educations: [...educations, action.payload]
    });
  },

  DELETE_EDUCATION(state, action) {
    const {educations} = state;
    const index = action.payload;
    return ({
      ...state,
      educations: [...educations.slice(0, index), ...educations.slice(index + 1)]
    });
  },

  // personalProjects
  ADD_PERSONAL_PROJECT(state, action) {
    const {personalProjects} = state;
    return ({
      ...state,
      personalProjects: [...personalProjects, action.payload]
    });
  },

  DELETE_PERSONAL_PROJECT(state, action) {
    const {personalProjects} = state;
    const index = action.payload;
    return ({
      ...state,
      personalProjects: [...personalProjects.slice(0, index), ...personalProjects.slice(index + 1)]
    });
  },

  // others
  HANDLE_OTHERS_INFO_CHANGE(state, action) {
    const {others} = state;
    return ({
      ...state,
      others: objectAssign({}, others, action.payload)
    });
  },

  ADD_LOCATION(state, action) {
    const {others} = state;
    const {expectLocations} = others;
    return ({
      ...state,
      others: objectAssign({}, others, {
        expectLocations: [...expectLocations, action.payload]
      })
    });
  },

  DELETE_LOCATION(state, action) {
    const {others} = state;
    const {expectLocations} = others;
    const index = action.payload;
    return ({
      ...state,
      others: objectAssign({}, others, {
        expectLocations: [...expectLocations.slice(0, index), ...expectLocations.slice(index + 1)]
      })
    });
  },

  ADD_SUPPLEMENT(state, action) {
    const {others} = state;
    const {supplements} = others;
    return ({
      ...state,
      others: objectAssign({}, others, {
        supplements: [...supplements, action.payload]
      })
    });
  },

  DELETE_SUPPLEMENT(state, action) {
    const {others} = state;
    const {supplements} = others;
    const index = action.payload;
    return ({
      ...state,
      others: objectAssign({}, others, {
        supplements: [...supplements.slice(0, index), ...supplements.slice(index + 1)]
      })
    });
  },
}, initialState);

export default reducers;
