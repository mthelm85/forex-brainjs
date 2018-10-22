const oanda = require('./oanda.js')

let formattedData = async () => {
  let priceData = []
  let label = (lastPrice, currentPrice) => {
    return currentPrice > lastPrice ? 1 : 0
  }
  try {
    let res = await oanda.getCandlestickData('EUR_USD', 100, 0, 'M30')
    for (let i = 0; i < Math.floor(res.data.candles.length / 3); i += 3) {
      priceData.push({
        input: [
          res.data.candles[i].volume / 10000,
          1 / Number(res.data.candles[i].bid.o),
          1 / Number(res.data.candles[i].bid.h),
          1 / Number(res.data.candles[i].bid.l),
          1 / Number(res.data.candles[i].bid.c),
          res.data.candles[i + 1].volume / 10000,
          1 / Number(res.data.candles[i + 1].bid.o),
          1 / Number(res.data.candles[i + 1].bid.h),
          1 / Number(res.data.candles[i + 1].bid.l),
          1 / Number(res.data.candles[i + 1].bid.c),
          res.data.candles[i + 2].volume / 10000,
          1 / Number(res.data.candles[i + 2].bid.o),
          1 / Number(res.data.candles[i + 2].bid.h),
          1 / Number(res.data.candles[i + 2].bid.l),
          1 / Number(res.data.candles[i + 2].bid.c)
        ],
        output: [
          // label(1 / Number(res.data.candles[i + 2].bid.c), 1 / Number(res.data.candles[i + 3].bid.c))
          1 / Number(res.data.candles[i + 3].bid.c)
        ]
      })
    }
  } catch (error) {
    if (error) throw new Error(error)
  }
  return priceData
}

module.exports = {
  formattedData
}
