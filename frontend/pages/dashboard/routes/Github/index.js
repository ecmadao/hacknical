
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default (store, options) => {
  const { login, device } = options

  const isMobile = (device || '').toLowerCase() === 'mobile'
  const GithubComponent = asyncComponent(
    isMobile
      ? () => import('./Components/Mobile').then(component => component.default)
      : () => import('./Components/Desktop').then(component => component.default)
  )
  return {
    path: `/${login}/visualize`,
    component: GithubComponent
  }
}
