'use strict'
const axios = require('axios')
const moment = require('moment')
const creds = require('./creds')

const accountBal = async () => {
 let bal = axios({
      method: 'get',
      url: `https://api-fxtrade.oanda.com/v3/accounts/${creds.acntId}/summary`,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      }
    })
  return bal
}

const getCandlestickData = async (pair, from, to, granularity) => {
  let fromDate = moment().subtract(from, 'days').unix()
  let toDate = moment().subtract(to, 'days').unix()
  let url = `https://api-fxtrade.oanda.com/v3/instruments/${pair}/candles?&price=BA&from=${fromDate}&to=${toDate}&granularity=${granularity}`
  try {
    let data = await axios({
      methods: 'get',
      url: url,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      }
    })
    return data
  } catch (error) {
    if (error) throw new Error(error)
  }
}

const openLongPosition = async (pair) => {
  try {
    let bal = await accountBal()
    let res = await axios({
      method: 'post',
      url: `https://api-fxtrade.oanda.com/v3/accounts/${creds.acntId}/orders`,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      },
      data: {
        'order': {
          'units': Math.round(0.99 * bal.data.account.balance),
          'instrument': pair,
          'timeInForce': 'IOC',
          'type': 'MARKET',
          'positionFill': 'DEFAULT'
        }
      }
    })
    return res
  } catch (error) {
    console.log(error)
  }
}

const openShortPosition = async (pair) => {
  try {
    let bal = await accountBal()
    let res = await axios({
      method: 'post',
      url: `https://api-fxtrade.oanda.com/v3/accounts/${creds.acntId}/orders`,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      },
      data: {
        'order': {
          'units': -Math.round(0.69 * bal.data.account.balance),
          'instrument': pair,
          'timeInForce': 'IOC',
          'type': 'MARKET',
          'positionFill': 'DEFAULT'
        }
      }
    })
    return res
  } catch (error) {
    console.log(error)
  }
}

const closeLongPosition = (pair) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: `https://api-fxtrade.oanda.com/v3/accounts/${creds.acntId}/positions/${pair}/close`,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      },
      data: {
        'longUnits': 'ALL'
      }
    }).then((res) => {
      resolve(res.data)
    }).catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}

const closeShortPosition = (pair) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: `https://api-fxtrade.oanda.com/v3/accounts/${creds.acntId}/positions/${pair}/close`,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      },
      data: {
        'shortUnits': 'ALL'
      }
    }).then((res) => {
      resolve(res.data)
    }).catch((error) => {
      console.log(error)
      reject(error)
    })
  })
}

const openPositions = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `https://api-fxtrade.oanda.com/v3/accounts/${creds.acntId}/openPositions`,
      headers: {
        'Authorization': `Bearer ${creds.key}`
      }
    })
    .then((res) => {
      var data = res.data.positions
      resolve(data)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  accountBal,
  getCandlestickData,
  openLongPosition,
  openShortPosition,
  closeLongPosition,
  closeShortPosition,
  openPositions
}
