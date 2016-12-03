import { createAction, createActions } from 'redux-actions';

/**
 * info
 */
const handleInfoChange = createAction('HANDLE_INFO_CHANGE');

/**
 * Education
 */
const {
  addEducation,
  deleteEducation,
  handleEduChange
} = createActions('ADD_EDUCATION', 'DELETE_EDUCATION', {
  HANDLE_EDU_CHANGE: (edu, index) => ({edu, index})
});

/**
 * WorkExperience
 */
const {
  addWorkExperience,
  deleteWorkExperience,
  addWorkProject,
  deleteWorkProject,
  addWorkProjectDetail,
  deleteWorkProjectDetail,
  handleWorkProjectChange,
  handleWorkExperienceChange
} = createActions('ADD_WORK_EXPERIENCE', 'DELETE_WORK_EXPERIENCE', 'ADD_WORK_PROJECT', {
  DELETE_WORK_PROJECT: (workIndex, projectIndex) => ({workIndex, projectIndex}),
  ADD_WORK_PROJECT_DETAIL: (detail, workIndex, projectIndex) => ({detail, workIndex, projectIndex}),
  DELETE_WORK_PROJECT_DETAIL: (workIndex, projectIndex, detailIndex) => ({workIndex, projectIndex, detailIndex}),
  HANDLE_WORK_PROJECT_CHANGE: (workProject, workIndex, projectIndex) => ({workProject, workIndex, projectIndex}),
  HANDLE_WORK_EXPERIENCE_CHANGE: (workExperience, index) => ({workExperience, index})
});

/**
 * PersonalProject
 */
const {
  addPersonalProject,
  deletePersonalProject,
  handlePersonalProjectChange,
  addProjectTech,
  deleteProjectTech
} = createActions('ADD_PERSONAL_PROJECT', 'DELETE_PERSONAL_PROJECT', {
  HANDLE_PERSONAL_PROJECT_CHANGE: (personalProject, index) => ({personalProject, index}),
  ADD_PROJECT_TECH: (tech, index) => ({tech, index}),
  DELETE_PROJECT_TECH: (projectIndex, techIndex) => ({projectIndex, techIndex})
});

/**
 * others
 */
const {
  handleOthersInfoChange,
  addLocation,
  deleteLocation,
  addSupplement,
  deleteSupplement
} = createActions(
  'HANDLE_OTHERS_INFO_CHANGE',
  'ADD_LOCATION',
  'DELETE_LOCATION',
  'ADD_SUPPLEMENT',
  'DELETE_SUPPLEMENT'
);

export default {
  // info
  handleInfoChange,
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
  handleOthersInfoChange,
  addLocation,
  deleteLocation,
  addSupplement,
  deleteSupplement
}
