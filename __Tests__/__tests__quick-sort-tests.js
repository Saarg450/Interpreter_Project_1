const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => {


    test(eva,
        `
          (import Sorting_Methods)
          (var qs (prop Sorting_Methods Qsort))
      
          (qs (list a ( 4 7 2 8 0 3 1)) 0 6)
      
          (ALL a)
        `,
        '(0 || 1 || 2 || 3 || 4 || 7 || 8)');  

   test(eva,
  `
    (import QSort)
    (var qs (prop QSort Qsort))

    (qs (list a ( 4 7 2 8 0 3 1)) 0 6)

    (ALL a)
  `,
  '(0 || 1 || 2 || 3 || 4 || 7 || 8)');  

  test(eva,
    `
      (import QSort)
      (var qs (prop QSort Qsort))

      (var y (list a ( 4 7 2 8 0 3 1)))
  
      (qs y 0 6)
  
      (ALL a)
    `,
    '(0 || 1 || 2 || 3 || 4 || 7 || 8)');  

    test(eva,
        `
          (import QSort)
          (var qs (prop QSort Qsort))
    
          (var y (list a ( 4 7 2 8 0 3 1)))

          ((prop QSort Qsort) y 0 6)
      
          (ALL a)
        `,
        '(0 || 1 || 2 || 3 || 4 || 7 || 8)'); 


};