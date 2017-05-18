function randomItem(array) {
  return array[Math.floor((Math.random() * array.length))]
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
    if (!result)
      throw new Error('Running out of materials')
    return result
  }

  nextParagraph(maxLength = 80, minLength = 40) {
    if (maxLength < minLength)
      throw new RangeError('maxLength must be greater than minLength')

    let res = this.next()
    while (true) {
      let ne = this.next()
      let nes = randomItem(["，", "，", "，", "，", "，", "。", "。", "。", "。", "？", "！", "……", "：", "；"]) + ne
      if (Math.random() > 0.5 && res.length > minLength) break

      if (res.length + nes.length < maxLength - 5) {
        res += nes
      } else {
        this.pushOne(ne)
      }
    }
    res += randomItem(["。", "。", "。", "。", "？", "！", "……"])
    return res
  }
}

module.exports = Azogi
Azogi.Azogi = Azogi