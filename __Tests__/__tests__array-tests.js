const assert = require('assert');
const testUtil = require('./test-util.js');

module.exports = eva => {


 /*   testUtil.test(eva, `
    (begin 
        (var x "(Cat Rat)")
        x
        )
    `,
    '(Cat Rat)'); */

    testUtil.test(eva, `
        (begin 
            (list jjh (2 4 "a" "Hello" "Hi World" true))

            (ALL jjh)
            )
        `,
        `(2 || 4 || 'a' || 'Hello' || 'Hi World' || true)`); 

    testUtil.test(eva, `
        (begin 
            (list jjh (2 4 "cv" "a b c d g" "Hello, World" true))

            (jjh -> 4)
            )
        `,
        'Hello, World'); 


    testUtil.test(eva, `
        (begin 
            (var x 10)
            (list jjh (2 4 "cv" "a b c d g" x "Hello, World" true))

            (jjh -> 4)
            )
        `,
        10); 


    testUtil.test(eva, `
        (begin 
            (list jjh (2 4 "cv" "a b c d g" "Hello, World" true))

            (set (jjh -> 1) "Changed")

            (jjh -> 1)
            )
        `,
        'Changed'); 

     testUtil.test(eva, `
        (begin 
            (list jjh (2 "Hello, World" true))

            (set (jjh -> 5) false)

            (jjh -> 5)
            )
        `,
        false); 

};