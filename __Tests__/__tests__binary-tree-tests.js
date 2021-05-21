const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => { 
 

    test(eva,
        `
          (import BTree_)
          
          (var b (new (prop BTree_ btree) 10))
    
          ((prop b left) b 0 20)
    
          ((prop b need) b 1)
        `,
        20);  



    test(eva,
  `
    (import BTree_)
    
    (var b (new (prop BTree_ btree) 10))

    (var x 0)

    ((prop b left) b x 20)

    ((prop b right) b 0 30)

    ((prop b left) b (+ 1 x) 40)

    ((prop b right) b 1 50)

    ((prop b right) b 2 60)

    ((prop b need) b 3)
  `,
  40);  



    test(eva,
        `
          (import BTree_)
          
          (var b (new (prop BTree_ btree) 10))

          (var r (prop b root))
      
          (var x 0)
      
          ((prop b left) b x 20)
      
          ((prop b right) b 0 30)
      
          ((prop b left) b (+ 1 x) 40)
      
          ((prop b right) b 1 50)
      
          ((prop b right) b 2 60)
      
          ((prop b need) b (r -->))

          (var c (r <--))

          ((prop b need) b (c -->))
        `,
        50); 


};