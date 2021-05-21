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

 /* test(eva,
    `
      (module mah
        (begin
          (class Point null
            (begin
              (def constructor (this x y)
                (begin
                  
                  (set (prop this x) x)
                  (set (prop this y) y)))
              (def calc (this)
                (+ (prop this x) (prop this y)))))
  
          (exports math)
        )
      )
      ((prop mah abs) (- 10))
    `,
    10); */

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