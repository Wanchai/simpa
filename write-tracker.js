/* eslint-disable @typescript-eslint/no-var-requires */
var fs = require('fs');

const data = fs.readFileSync('public/tracker-template.js', 'utf8');

console.log(process.env);
console.log(process.env.SIMPA_ADDRESS);

fs.writeFile(
  'public/tracker.js',
  data.replace(
    'SIMPA_ADDRESS',
    process.env.SIMPA_ADDRESS || 'http://localhost:3000',
  ),
  (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  },
);
