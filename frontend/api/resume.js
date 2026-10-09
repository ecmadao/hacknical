
import API from './base'
import { getLocale } from 'LOCALES'

const locale = getLocale()

const getResume = (options = {}) => {
  const { resumeId } = options
  return API.get('/resume/data', { locale, ...(resumeId ? { resumeId } : {}) })
}

const setResume = (resume, ...params) => {
  const { resumeId, ...rest } = resume
  const queryParts = params.filter(Boolean)
  if (resumeId) queryParts.push(`resumeId=${encodeURIComponent(resumeId)}`)
  const queryString = queryParts.length ? `?${queryParts.join('&')}` : ''
  return API.put(`/resume/data${queryString}`, { resume: rest, resumeId, locale })
}

const download = (pageStyle, options = {}) => {
  const { resumeId } = options
  return API.get('/resume/download', { pageStyle, locale, ...(resumeId ? { resumeId } : {}) })
}

const getPubResume = hash => API.get('/resume/shared/public', { hash, locale })

const getResumeInfo = (options = {}) => {
  const { hash, userId, resumeId } = options
  const qs = { locale }
  if (hash) qs.hash = hash
  if (userId) qs.userId = userId
  if (resumeId) qs.resumeId = resumeId
  return API.get('/resume/info', qs)
}

const patchResumeInfo = (info, options = {}) => {
  const { resumeId } = options
  return API.patch('/resume/info', { info, ...(resumeId ? { resumeId } : {}) })
}

const getShareRecords = (options = {}) => {
  const { resumeId } = options
  return API.get('/resume/records', resumeId ? { resumeId } : {})
}
const getViewLogs = qs => API.get('/resume/logs', qs)

const getImageUploadUrl = qs => API.get('/resume/image/upload', qs)

const getSchoolInfo = qs => API.get('/resume/school', qs)

// 多简历管理接口
const getResumeList = () => API.get('/resume/list')
const createResume = data => API.post('/resume/new', data)
const deleteResume = resumeId => API.delete(`/resume/${resumeId}`)
const setDefaultResume = resumeId => API.post('/resume/default', { resumeId })
const renameResume = (resumeId, title) => API.post('/resume/rename', { resumeId, title })
const copyResume = (resumeId, title) => API.post('/resume/copy', { resumeId, title })

export default {
  getResume,
  setResume,
  // =================================
  download,
  getPubResume,
  patchResumeInfo,
  getResumeInfo,
  getViewLogs,
  getShareRecords,
  getImageUploadUrl,
  getSchoolInfo,
  // =================================
  getResumeList,
  createResume,
  deleteResume,
  setDefaultResume,
  renameResume,
  copyResume
}
