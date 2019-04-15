
import 'STYLES/fonts-hack.css'
import renderApp from 'PAGES/error'

$(() => {
  $(document).bind('contextmenu', () => false)

  renderApp('error', {
    wordLines: [
      '$ SOME TERRIBLE THINGS HAPPENED',
      '$ CD /HOME/BED && SLEEP',
      '$ PS',
      '$ NOBODY EXISTS ON PURPOSE',
      '$ NOBODY BELONGS ANYWHERE',
      '$ EVERYBODY\'S GONNA DIE',
      '$ SO, WHAT WOULD U DO IF U WEREN\'T AFRAID?'
    ]
  })
})
