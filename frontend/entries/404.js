
import 'STYLES/fonts-hack.css'
import renderApp from 'PAGES/error'

$(() => {
  $(document).bind('contextmenu', () => false)

  renderApp('error', {
    wordLines: [
      '$ seems nothing could found',
      '$ start redirecting....',
      '$ 5   4   3   2   1   0'
    ],
    onFinish: () => window.location = '/'
  })
})
