const Eva = require('../Eva');
const Environment = require('../Environment');
const testUtil = require('./test-util.js');

const tests = [
    require('./__tests__self-eval-test.js'),
    require('./__tests__math-test.js'),
    require('./__tests__variables-test.js'), 
    require('./__tests__block-tests.js'),
    require('./__tests__if-test.js'),
    require('./__tests__built-in-function-tests.js'), 
    require('./__tests__user-defined-functions.js'),
    require('./__tests__lambda-functions.js'),
    require('./__tests__Switch-tests.js'), 
    require('./__tests__for-loop-test.js'),
    require('./__tests__short-hand-tests.js'), 
    require('./__tests__class-test.js'), 
    require('./__tests__module-tests.js'),  
    require('./__tests__import-tests.js'),
    require('./__tests__array-tests.js'),
    require('./__tests__stack-tests.js'), 
    require('./__tests__queue-tests.js'), 
    require('./__tests__binary-tree-tests.js'), 
    require('./__tests__bub-sort-tests.js'),
    require('./__tests__quick-sort-tests.js'),
];

const eva = new Eva ();

tests.forEach(test => test(eva));

//  eva.eval(['print' , '"Hello,"', '"World"']);

console.log('All assertions passed');
