import { createAction } from 'redux-actions';
import objectAssign from 'object-assign';

/**
 * info
 */
const handleInfoChange = createAction('HANDLE_INFO_CHANGE');

/**
 * WorkExperience
 */
const addWorkExperience = createAction('ADD_WORK_EXPERIENCE');
const deleteWorkExperience = createAction('DELETE_WORK_EXPERIENCE');

/**
 * Education
 */
const addEducation = createAction('ADD_EDUCATION');
const deleteEducation = createAction('DELETE_EDUCATION');

/**
 * PersonalProject
 */
const addPersonalProject = createAction('ADD_PERSONAL_PROJECT');
const deletePersonalProject = createAction('DELETE_PERSONAL_PROJECT');

/**
 * others
 */
const handleOthersInfoChange = createAction('HANDLE_OTHERS_INFO_CHANGE');

const addLocation = createAction('ADD_LOCATION');
const deleteLocation = createAction('DELETE_LOCATION');

const addSupplement = createAction('ADD_SUPPLEMENT');
const deleteSupplement = createAction('DELETE_SUPPLEMENT');

export default {
  handleInfoChange,
  addWorkExperience,
  deleteWorkExperience,
  addEducation,
  deleteEducation,
  addPersonalProject,
  deletePersonalProject,
  handleOthersInfoChange,
  addLocation,
  deleteLocation,
  addSupplement,
  deleteSupplement
}
