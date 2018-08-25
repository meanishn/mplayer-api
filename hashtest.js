const crypto = require('crypto');

const NS_PER_SEC = 1e9;

let string = '';

for (let n = 0; n < 252941; n++) {
    string += 'g';
}

const time = process.hrtime();
const shasum = crypto.createHash('sha1');
shasum.update(string);
const diff = process.hrtime(time);
console.log(shasum.digest('hex'));
console.log('time taken: ', `Benchmark took ${(diff[0] * NS_PER_SEC + diff[1])/ 1000000} miliseconds}`);

