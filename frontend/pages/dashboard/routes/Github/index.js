
import asyncComponent from 'COMPONENTS/AsyncComponent'

export default (store, options) => {
  const { login, device } = options

  const GithubComponent = asyncComponent(
    () => System.import(`./Components/${device[0].toUpperCase()}${device.slice(1).toLowerCase()}`)
      .then(component => component.default)
  )
  return {
    path: `/${login}/visualize`,
    component: GithubComponent
  }
}
