'use strict';
const oanda = require('./oanda.js');
const nn = require('./nn.js');
const schedule = require('node-schedule');

// Set schedule to pull price data and make trades every half hour, M - F, 8:30 AM - 10:30 AM
let tradeRule = new schedule.RecurrenceRule()
tradeRule.dayOfWeek = [new schedule.Range(1, 5)]
tradeRule.hour = [new schedule.Range(8, 10)]
tradeRule.minute = [1, 31]

// Set schedule to close out the final trade of the day, M - F 11:00 AM
let closeDayRule = new schedule.RecurrenceRule()
closeDayRule.dayOfWeek = [new schedule.Range(1, 5)]
closeDayRule.hour = 11
closeDayRule.minute = 0

const train = async () => {
  let trainedNetwork = await nn.trainNN()
  return trainedNetwork
}

const getPrices = async () => {
  let input = []
  let res = await oanda.getCandlestickData('EUR_USD', 1, 0, 'M30')
  input.push(
    res.data.candles[res.data.candles.length - 1].volume / 10000,
    1 / Number(res.data.candles[res.data.candles.length - 1].bid.o),
    1 / Number(res.data.candles[res.data.candles.length - 1].bid.h),
    1 / Number(res.data.candles[res.data.candles.length - 1].bid.l),
    1 / Number(res.data.candles[res.data.candles.length - 1].bid.c),
    res.data.candles[res.data.candles.length - 2].volume / 10000,
    1 / Number(res.data.candles[res.data.candles.length - 2].bid.o),
    1 / Number(res.data.candles[res.data.candles.length - 2].bid.h),
    1 / Number(res.data.candles[res.data.candles.length - 2].bid.l),
    1 / Number(res.data.candles[res.data.candles.length - 2].bid.c),
    res.data.candles[res.data.candles.length - 3].volume / 10000,
    1 / Number(res.data.candles[res.data.candles.length - 3].bid.o),
    1 / Number(res.data.candles[res.data.candles.length - 3].bid.h),
    1 / Number(res.data.candles[res.data.candles.length - 3].bid.l),
    1 / Number(res.data.candles[res.data.candles.length - 3].bid.c)
  )
  return input
}

train().then(trainedNetwork => {
  schedule.scheduleJob(tradeRule, async () => {
    let res = await oanda.openPositions()
    if (res[0].long.units !== '0') {
      let close = await oanda.closeLongPosition('EUR_USD')
      console.log(close)
    }
    if (res[0].short.units !== '0') {
      let close = await oanda.closeShortPosition('EUR_USD')
      console.log(close)
    }
    let input = await getPrices()
    let prediction = Math.round(trainedNetwork(input))
    if (prediction === 1) {
      oanda.openShortPosition('EUR_USD')
    } else if (prediction === 0) {
      oanda.openLongPosition('EUR_USD')
    } else {
      console.log('Unable to open a position...')
    }
  })
  schedule.scheduleJob(closeDayRule, async () => {
    let res = await oanda.openPositions()
    if (res[0].long.units !== '0') {
      let close = await oanda.closeLongPosition('EUR_USD')
      console.log(close)
    }
    if (res[0].short.units !== '0') {
      let close = await oanda.closeShortPosition('EUR_USD')
      console.log(close)
    }
  })
})
