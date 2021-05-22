const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => {

  // Pass lambda as a callback

  test(eva,
  `
    (begin
      (var x 10)
      (++ x)
      (switch ((== x 10) 100)
              ((> x 10) 200)
              (else     300))
    )
  `,
  200);

  test(eva,
    `
      (* -2 3)
    `,
    -6);

    test(eva,
      `
        (3 - (-2 * 3))
      `,
      9);

};