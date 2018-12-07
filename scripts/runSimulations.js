// const exec = require('child_process').exec;
// const runSimulations = exec('sh script/runSimulations.sh');

// runSimulations.stdout.on('data', data => {
//   console.log(data);
// });

// runSimulations.stderr.on('data', data => {
//   console.log(data);
// });
// // const runSimulations = () => {
// //   console.log('running')
// //   execSync('sh script/runSimulations.sh',
// //     (err, stdout, stderr) => {
// //       console.log('in')
// //       console.log(`${stdout}`);
// //       console.log(`${stderr}`);
// //       if (err !== null) {
// //         console.log(`exec error: ${err}`);
// //       }
// //     })
  
// // }

// // runSimulations()

// module.exports = runSimulations;

const R = require('r-script');
const out = R('simulationmodel.R')
  .data()
  .callSync((err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
  });

console.log(out)