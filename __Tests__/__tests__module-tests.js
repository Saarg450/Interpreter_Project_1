const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => {

  test(eva,
  `
    (module math
      (begin
        (def abs (value)
          (if (< value 0)
              (- value)
              value))
        (def square (x)
          (* x x))
        (var MAX_VALUE 1000)

        (exports math)
      )
    )
    ((prop math abs) (- 10))
  `,
  10);

  test(eva,
    `
      (var abs (prop math abs))
      (abs (- 10))
    `,
    10);
    
  
    test(eva,
    `
      (prop math MAX_VALUE)
    `,
    1000); 

};