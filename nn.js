'use strict'
const brain = require('brain.js')
const formatData = require('./formatData.js')

const net = new brain.NeuralNetwork({
  activation: 'sigmoid',
  hiddenLayers: [15], //15
  iterations: 250000, //250000
  learningRate: 0.15 //.15
})

let trainNN = () => {
  return new Promise((resolve, reject) => {
    formatData.formatData().then((data) => {
      let trainingData = data.slice(0, Math.floor(data.length * 0.8))
      let testData = data.slice(Math.floor(data.length * 0.8), data.length + 1)

      net.trainAsync(data, {
        log: true,
        logPeriod: 10000
      })
      .then((res) => {
        let correctPredictions = []
        testData.forEach(x => {
          if (Math.round(net.run(x.input)) === x.output[0]) {
            correctPredictions.push(0)
          }
        })
        console.log(`Accuracy rate: ${Math.round((correctPredictions.length / testData.length) * 100)}%`)
        let predictMovement = net.toFunction()
        resolve(predictMovement)
      })
      .catch(error => reject(error))
    })
  })
}

module.exports = {
  trainNN
}
