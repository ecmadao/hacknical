
import { cloneElement } from 'react'
import deepcopy from 'deepcopy'
import objectAssign from 'UTILS/object-assign'
import { validateSocialLinks } from 'UTILS/resume'
import dateHelper from 'UTILS/date'
import { sortBySeconds, isUrl } from 'UTILS/helper'
import { formatUrl } from 'UTILS/formatter'
import locales from 'LOCALES'
import { LINK_NAMES, EDUCATIONS } from 'UTILS/constant/resume'

const localeTexts = locales('datas.dateSlider')

const eduMap = EDUCATIONS.reduce((map, edu) => {
  map.set(edu.id, edu.value)
  return map
}, new Map())
const validateDate = dateHelper.validator.date
const sortByDate = sortBySeconds('startTime', -1)
const getLinkText = social =>
  social.text
  || LINK_NAMES[social.name]
  || LINK_NAMES[social.name.toLowerCase()]
  || social.name

const formatResumeInfo = (info) => {
  if (!info || !info.phone || !info.privacyProtect) return info
  return Object.assign({}, info, {
    phone: `${info.phone.slice(0, 3)}****${info.phone.slice(7)}`
  })
}

const formatResume = (resume) => {
  const {
    others,
    educations,
    workExperiences,
    personalProjects,
    customModules = [],
    languages = []
  } = resume
  const { socialLinks } = others

  const formatWorkExperiences = workExperiences
    .sort(sortByDate)
    .reduce((list, experience) => {
      if (!experience.company) return list

      const {
        url,
        company,
        startTime,
        endTime,
        position,
        projects,
        untilNow,
        techs = [],
      } = experience

      const validateEnd = untilNow
        ? localeTexts.untilNow
        : validateDate(endTime)
      list.push({
        techs,
        company,
        position,
        untilNow,
        url: formatUrl(url),
        endTime: validateEnd,
        startTime: validateDate(startTime),
        projects: projects
          .reduce((pList, project) => {
            if (!project.name) return pList
            pList.push(
              objectAssign({}, deepcopy(project), {
                url: formatUrl(project.url),
                details: project.details || []
              })
            )
            return pList
          }, [])
      })
      return list
    }, [])

  const formatEducations = educations
    .sort(sortByDate)
    .reduce((list, edu) => {
      if (!edu.school) return list
      const {
        education,
        endTime,
        startTime,
        experiences = []
      } = edu

      list.push(Object.assign({}, edu, {
        experiences: experiences.filter(d => d),
        endTime: validateDate(endTime),
        startTime: validateDate(startTime),
        education: eduMap.get(education) || education,
      }))

      return list
    }, [])

  const formatPersonalProjects = personalProjects
    .reduce((list, project) => {
      if (!project.title) return list
      list.push(
        objectAssign({}, deepcopy(project), {
          url: formatUrl(project.url)
        })
      )
      return list
    }, [])

  const formatSocials = validateSocialLinks(socialLinks)
    .reduce((list, social) => {
      const { url } = social
      if (!isUrl(url)) return list

      list.push(objectAssign({}, deepcopy(social), {
        text: getLinkText(social),
        validateUrl: formatUrl(url)
      }))
      return list
    }, [])

  const formattedModules = customModules
    .reduce((list, module) => {
      if (!module.text) return list

      const sections = (module.sections || []).reduce((list, section) => {
        if (!section.title) return list
        list.push(
          objectAssign({}, section, {
            url: formatUrl(section.url),
            details: section.details || []
          })
        )
        return list
      }, [])

      list.push(
        objectAssign({}, deepcopy(module), {
          sections,
          url: formatUrl(module.url)
        })
      )
      return list
    }, [])

  return objectAssign({}, resume, {
    languages,
    info: formatResumeInfo(resume.info),
    educations: formatEducations,
    workExperiences: formatWorkExperiences,
    personalProjects: formatPersonalProjects,
    others: objectAssign({}, deepcopy(others), {
      socialLinks: formatSocials
    }),
    customModules: formattedModules
  })
}

const ResumeFormatter = (props) => {
  const { resume, children } = props
  const componentProps = objectAssign({}, props)
  delete componentProps.resume
  delete componentProps.children

  const component = cloneElement(children, {
    ...componentProps,
    resume: formatResume(resume)
  })
  return component
}

export default ResumeFormatter
