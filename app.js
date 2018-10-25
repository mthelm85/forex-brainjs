const oanda = require('./oanda.js')
const nn = require('./nn.js')

oanda.getCandlestickData('EUR_USD', 1, 0, 'M30').then(res => {
  console.log(res.data.candles[res.data.candles.length - 1])
})


// nn.trainNN().then((predict) => {
//   predict([0.86, 0.54])
// })
