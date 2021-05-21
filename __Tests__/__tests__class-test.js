const assert = require('assert');
const {test} = require('./test-util');

module.exports = eva => {

    test(eva,
        `
        (class Point null
            (begin
              (def constructor (this x y)
                (begin
                  
                  (set (prop this x) x)
                  (set (prop this y) y)))
              (def calc (this)
                (+ (prop this x) (prop this y)))))
          (var p (new Point 10 20))
          ((prop p calc) p)

        `,
        30); 
    
/* In the above example, the statement ((prop p calc) p), goes to isArray. 
The exp[0] i.e. (prop p calc) is evaluated that returns an array {params, body, env} 
and the next term, i.e. exp[1] i.e. p is the argument 'this' passed in it and this 
whole gives the value 30 */ 
            

      test(eva,
            `
              (class Point3D Point
                (begin
                  (def constructor (this x y z)
                    (begin
                      ((prop (super Point3D) constructor) this x y)
                      (set (prop this z) z)))
                  (def calc (this)
                    (+ ((prop (super Point3D) calc) this)
                       (prop this z)))))
              (var p (new Point3D 10 20 30))
              ((prop p calc) p)
            `,
            60);  

};

