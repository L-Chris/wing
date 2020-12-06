import {
  Wing
} from './wing'

const view = new Wing({
  el: '#root',
  template: `<div>{name}</div>`,
  data: {
    name: 1
  }
})

setTimeout(() => {
  view.data.name = 2
}, 3000)
