
import EventEmitter from 'eventemitter3'
import API from 'API'
import HeartBeat from 'UTILS/heartbeat'

const emitter = new EventEmitter()

emitter.once('refresh', (heartBeat) => {
  heartBeat && heartBeat.takeoff()
})

const fire = (time, callback) => {
  const heartBeat = new HeartBeat({
    interval: time,
    callback: () => API.github.getUpdateStatus().then((result) => {
      if (result && result.finished) {
        heartBeat.stop()
        callback && callback(result)
      }
    })
  })
  emitter.emit('refresh', heartBeat)
}

export default {
  fire
}
