const assert = require('assert');
const testUtil = require('./test-util.js');

module.exports = eva => {
assert.strictEqual(eva.eval(
    ['begin',

    ['var', 'x', 10],
    ['var', 'y', 20],

    ['+', ['*', 'x', 'y'], 30],

    ]), 230);
 
    assert.strictEqual(eva.eval(
        ['begin',
    
            ['var', 'value', 10],

            ['var', 'result', ['begin',

                ['var', 'x', ['+', 'value', 10]],
                'x'   
            ] ],
    
            'result'  
        ]),        
    20);

    testUtil.test(eva, `
        (begin
            (var x 10)
            (var y 20)
            (30 + (x * 10))

            (def abs (value)
                (if (value < 0)
                    (- value)
                    value))

            (if (x > 5)
                (set x 70)
                (set x 60))

            (abs -10)

            
            (var i 0)

            (for (var j 0) ( j <= 5) (++ j)

            (if (j <= 7) 
            
                (begin

                    (++ i)

                )

                (begin

                    (var hhvkjjn 80)

                )

            ) )

            

            i

        )
        `,
        6);


};