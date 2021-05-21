const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => { 

    test(eva,
  `
    (import queue_)
    
    (var q (new (prop queue_ queue)))

    ((prop q push_back) q 10)

    ((prop q push_back) q 20)

    ((prop q push_back) q 30)

    ((prop q peek) q)

    ((prop q pop) q)

    ((prop q peek) q)
  `,
  20); 
  

  
  test(eva,
    `
      (import queue_)
      
      (var q (new (prop queue_ queue)))
  
      ((prop q push_back) q 10)

      ((prop q pop) q)

      ((prop q push_back) q 20)
  
      ((prop q peek) q)
    `,
    20); 




};