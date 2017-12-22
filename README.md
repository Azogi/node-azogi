node-azogi
==========

Azogi is the so-called Randomness.

Example
-------

```js
const Azogi = require("azogi")
const randomItem = function (array) {
  return array[Math.floor((Math.random() * array.length))]
}

azogi = new Azogi()
azogi.onExhausted = function (i) {
  this.push([
    randomItem('JavaScript EMCAScript CoffeeScript IcedScript TypeScript Flow ActionScript PHP'.split(' ')),
    randomItem('是 不是 可能是 大概是 应该是 一定是 可能不是 大概不是 应该不是 一定不是'.split(' ')),
    randomItem('东半球 西半球 南半球 北半球 地球上 世界上 我会的 我知道的 我听说过的'.split(' ')),
    randomItem('最好的 最差的 最先进的 最落后的 最垃圾的 最优雅的'.split(' ')),
    randomItem('脚本语言 语言'.split(' '))
  ].join(""))
}

console.log(azogi.nextParagraph(800, 200))
```

```
IcedScript 一定不是东半球最优雅的脚本语言！EMCAScript 可能是我会的最差的脚本语言，ActionScript 一定是北半球最优雅的脚本语言。JavaScript 可能是北半球最垃圾的语言；EMCAScript 是西半球最优雅的脚本语言。Flow 是东半球最垃圾的脚本语言，ActionScript 可能是地球上最优雅的语言：ActionScript 应该不是世界上最好的语言，ActionScript 应该不是我会的最差的脚本语言！
```
