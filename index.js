const brain = require('brain.js')
const formatData = require('./formatData.js')

let trainingData
let testData

// const net = new brain.NeuralNetwork({
//   activation: 'sigmoid',
//   hiddenLayers: [256],
//   iterations: 25,
//   learningRate: 0.3
// })

const config = {
  inputSize: 15,
  hiddenSizes: [15],
  outputSize: 1,
  learningRate: .3
}

const net = new brain.recurrent.LSTM(config)

formatData.formattedData().then((data) => {
  trainingData = data.slice(0, Math.floor(data.length * 0.8))
  testData = data.slice(Math.floor(data.length * 0.8), data.length + 1)
  net.train(data, {
    iterations: 250,
    log: true,
    logPeriod: 1,
    errorThresh: .005
  })
  // net.trainAsync(data, {
  //   log: true,
  //   logPeriod: 100,
  //   errorThresh: 0.005
  // })
  // .then((res) => {
  //   for (i = 0; i < testData.length; i++) {
  //     console.log(`P: ${net.run(testData[i].input)}, A: ${testData[i].output}`)
  //   }
  // })
  // .catch(error => console.log(error))
})
