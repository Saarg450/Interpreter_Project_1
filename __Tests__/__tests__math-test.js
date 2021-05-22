const assert = require('assert');



module.exports = eva => {
    
   assert.strictEqual(eva.eval(['+', ['*', 3, 3], 7]), 16);
   assert.strictEqual(eva.eval(['+', 8, 7]), 15);
   assert.strictEqual(eva.eval(['*', -8, 7.3]), -58.4); 
   assert.strictEqual(eva.eval([8.5, '+' ,7]), 15.5);

};