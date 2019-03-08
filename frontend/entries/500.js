
import 'SRC/vendor/500.css'
import 'STYLES/fonts-hack.css'
import Rock from 'PAGES/initial/rock'

$(() => {
  const $content = $('.content-wrapper')
  const rock = new Rock($content, 50)
  rock
    .roll({ chars: '$ some terrible things happened.. ' })
    .then(instance => instance.wait(1000))
    .then(instance => instance.roll({ chars: '$ cd /home/bed && sleep' }))
})
