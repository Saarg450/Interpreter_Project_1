const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => { 

    test(eva,
  `
    (import stack_)
    
    (var s (new (prop stack_ stack)))

    ((prop s push) s 10)

    ((prop s push) s 20)

    ((prop s push) s 30)

    ((prop s peek) s)

    ((prop s pop) s)

    ((prop s peek) s)
  `,
  20);  

    test(eva,
    `
      (import stack_)
      
      (var s (new (prop stack_ stack)))
  
      ((prop s push) s 10)

      ((prop s push) s 20)

      ((prop s push) s 30)

      ((prop s pop) s)
  
      ((prop s peek) s)
    `,
    20); 

    test(eva,
      `
        (import Data_Structures)
        
        (var s (new (prop Data_Structures stack)))
    
        ((prop s push) s 10)
  
        ((prop s push) s 20)
  
        ((prop s push) s 30)
  
        ((prop s pop) s)
    
        ((prop s peek) s)
      `,
      20); 

   /* test(eva,
      `
        (import stacks_)
        
        (var s (new (prop stacks_ stack_)))
    
        (prop s top)
    
       
      `,
      2); */

};