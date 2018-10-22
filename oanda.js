const axios = require('axios')
const moment = require('moment')
const creds = require('./creds')

module.exports = {
  getCandlestickData: async (pair, from, to, granularity) => {
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
}
