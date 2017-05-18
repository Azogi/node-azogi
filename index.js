const Bluebird = require('bluebird')

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
    let items = text.replace(/[\(\)\*\#　!:^%@$0-9A-Za-z：；「」，？！。、.,'＜＞．／＇＂［］｛｝＼｜＿＋－＝｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ１２３４５６７８９０＠＃＄％＾＆＊"\]\[:;<>?+_\-={}\\~`『』【】”“‘’￥…×（）—·～\/《》]|\s/g, "\n").replace(/\n+/g, "\n").split(/\n/)
    items = [...new Set(items)]

    let count = this.library.length
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i]) continue
      if (items[i].length < 2) continue

      let position = Math.floor(Math.random() * (count + 1))
      this.library.splice(position, 0, items[i])
      count += 1
    }
  }

  pushOne(text) {
    if (!text) return

    let position = Math.floor(Math.random() * (this.library.length + 1))
    this.library.splice(position, 0, text)
  }

  next() {
    let result = this.library.shift()
    if (result) return result

    this.onExhausted()
    result = this.library.shift()
    if (result) return result
 
    throw new Error('Running out of materials')
  }

  async nextAsync() {
    let result = this.library.shift()
    if (result) return result

    await this.onExhaustedAsync()
    result = this.library.shift()
    if (result) return result
 
    this.onExhausted()
    result = this.library.shift()
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