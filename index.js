const Bluebird = require('bluebird')
const pangu = require('pangu')

const randomItem = function (array) {
  return array[Math.floor((Math.random() * array.length))]
}

let defineSyncAndAsyncFunction = function (klass, name, generatorFunction) {
  Object.defineProperty(generatorFunction, "name", { value: name + "Generator" })

  let syncFunction = function() {
    let generator = generatorFunction(this, true, ...arguments)
    let value = {}
    while (true) {
      value = generator.next(value.value)
      if (value.done) {
        return value.value
      }
    }
  }
  Object.defineProperty(syncFunction, "name", { value: name })
  klass.prototype[name] = syncFunction

  let asyncPromise = Bluebird.coroutine(generatorFunction)
  let asyncFunction = function() {
    return asyncPromise(this, false, ...arguments)
  }
  Object.defineProperty(asyncFunction, "name", { value: name + "Async" })
  klass.prototype[name + "Async"] = asyncFunction
}

class Azogi {
  constructor() {
    this.library = []
  }

  push(text) {
    // http://stackoverflow.com/a/21113538
    let items = pangu.spacing(text).replace(/ +/g, " ").match(/(?:[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]| *[a-zA-z0-9]+ *)+/g)
    items = items.map((i) => i.trim())
    items = [...new Set(items)].filter((i) => !!i.replace(/^[0-9A-Za-z ]+$/g, "") && i.length >= 2)
    this.library.splice.apply(this.library, [0, 0, ...items])
  }

  pushOne(text) {
    if (!text) return
    this.library.push(text)
  }

  nextPresent() {
    let position = Math.floor(Math.random() * this.library.length)
    return this.library.splice(position, 1)[0]
  }

  next() {
    let result = this.nextPresent()
    if (result) return result

    this.onExhausted()
    result = this.nextPresent()
    if (result) return result
 
    throw new Error('Running out of materials')
  }

  async nextAsync() {
    let result = this.nextPresent()
    if (result) return result

    await this.onExhaustedAsync()
    result = this.nextPresent()
    if (result) return result
 
    this.onExhausted()
    result = this.nextPresent()
    if (result) return result

    throw new Error('Running out of materials')
  }

  onExhausted() {}
  async onExhaustedAsync() {}
}

defineSyncAndAsyncFunction(Azogi, "nextParagraph", 
  function *(self, sync, maxLength = 80, minLength = 40) {
    if (maxLength < minLength)
      throw new RangeError('maxLength must be greater than minLength')

    let res = yield (sync ? self.next() : self.nextAsync())
    while (true) {
      let ne = yield (sync ? self.next() : self.nextAsync())
      let nes = randomItem(["，", "，", "，", "，", "，", "。", "。", "。", "。", "？", "！", "……", "：", "；"]) + ne
      if (Math.random() > 0.5 && res.length > minLength) break

      if (res.length + nes.length < maxLength - 5) {
        res += nes
      } else {
        self.pushOne(ne)
      }
    }
    res += randomItem(["。", "。", "。", "。", "？", "！", "……"])
    return res
  }
)

module.exports = Azogi
Azogi.Azogi = Azogi