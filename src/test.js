const jwt = require('jsonwebtoken');

const secret = 'leien';

const tk = jwt.sign({ test: 1 }, secret, { expiresIn: '1000' });

console.log('start');
setTimeout(() => {
  try {
    jwt.verify(tk, secret, (err, decoded) => {
      console.log('callback');
      console.log(err, decoded);
    });
    console.log('success');
  } catch (err) {
    console.error(err);
  }
  console.log('end');
}, 2000);
