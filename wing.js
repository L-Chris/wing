class Wing {
  constructor({
    el,
    template,
    data,
    children = []
  }) {
    this.el = document.querySelector(el)
    this.rawData = data
    this.data = this.defineReactiveProperties(this.rawData)
    this.template = template
    this.stack = this.compile(template)
    this.children = children

    this.render()
  }

  defineReactiveProperties(obj) {
    const that = this

    const p = new Proxy(obj, {
      set(target, key, value, receiver) {
        obj[key] = value

        that.render()

        return true
      }
    })

    return p
  }

  compile(template) {
    const REG_TAG_START = /^<(\w+)>/
    const REG_TAG_END = /^<\/(\w+)>/
    const REG_VALUE = /^\{(\w+)\}/

    let str = template

    const stack = []

    while(str.length) {
      let matcher
      if (matcher = REG_TAG_START.exec(str)) {
        const index = matcher[0].length
        str = str.slice(index)
        stack.push({
          type: 0,
          name: matcher[1]
        })
      } else if (matcher = REG_TAG_END.exec(str)) {
        const index = matcher[0].length
        str = str.slice(index)

        stack.push({
          type: 1,
          name: matcher[1]
        })
      } else if (matcher = REG_VALUE.exec(str)) {
        const index = matcher[0].length
        str = str.slice(index)

        stack.push({
          type: 2,
          name: matcher[1]
        })
      }
    }

    return stack
  }

  render() {
    const str = this.stack.reduce((pre, val) => {
      let item

      const {
        type,
        name
      } = val

      switch (type) {
        case 0:
          item = `<${name}>`
          break;
        case 1:
          item = `</${name}>`
          break;
        case 2:
          item = `${this.data[name]}`
          break;
        default:
          break;
      }

      pre += item

      return pre
    }, '')

    this.el.innerHTML = str
  }
}

export {
  Wing
}
