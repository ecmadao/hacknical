
import React from 'react'
import asyncComponent from 'COMPONENTS/AsyncComponent'

const sections = {
  info: asyncComponent(
    () => import('./Info')
      .then(component => component.default)
  ),
  educations: asyncComponent(
    () => import('./Educations')
      .then(component => component.default)
  ),
  workExperiences: asyncComponent(
    () => import('./WorkExperiences')
      .then(component => component.default)
  ),
  personalProjects: asyncComponent(
    () => import('./PersonalProjects')
      .then(component => component.default)
  ),
  others: asyncComponent(
    () => import('./Others')
      .then(component => component.default)
  ),
  custom: asyncComponent(
    () => import('./CustomModule')
      .then(component => component.default)
  )
}

const ResumeSection = (props) => {
  const { section } = props
  const Section = sections[section.id] || sections.custom
  const title = section.text

  return (
    <Section {...props} title={title} section={section.id} sectionId={section.id} />
  )
}

export default ResumeSection
