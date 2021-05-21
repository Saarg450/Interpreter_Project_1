const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => {


   test(eva,
  `
    (import BubSort)
    (var bs (prop BubSort bubsort))

    (bs (list a ( 4 7 2 8 0 3 1)) 7)

    (ALL a)
  `,
  '(0 || 1 || 2 || 3 || 4 || 7 || 8)');  

  test(eva,
    `
      (import BubSort)
      (var bs (prop BubSort bubsort))

      (var y (list a ( 4 7 2 8 0 3 1)))
  
      (bs y 7)
  
      (ALL a)
    `,
    '(0 || 1 || 2 || 3 || 4 || 7 || 8)');  

    test(eva,
        `
          (import BubSort)
          (var bs (prop BubSort bubsort))
    
          (var y (list a ( 4 7 2 8 0 3 1)))

          ((prop BubSort bubsort) y 7)
      
          (ALL a)
        `,
        '(0 || 1 || 2 || 3 || 4 || 7 || 8)'); 


};