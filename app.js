'use strict';
const schedule = require('node-schedule');
const oanda = require('./oanda.js');
const nn = require('./nn.js');

let rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [new scheduleRange(1, 5)]
rule.hour = [new scheduleRange(8, 10)]
rule.minute = 30
let trainedNetwork

const train = async () => {
  trainedNetwork = await nn.trainNN()
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

train().then(() => {
  schedule.scheduleJob(rule, async () => {
    let input = await getPrices()
    console.log(`Prediction: ${Math.round(trainedNetwork(input))}`)
  })
})
