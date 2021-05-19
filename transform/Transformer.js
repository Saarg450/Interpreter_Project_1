/*
  AST Transformer
*/

class Transformer {

    /* ->Transforms 'def' expression (function decelaration)
         into a variable decelaration with a lambda expression */  

    transformDefToLambda(defExp) {
        const [_tag, name, params, body] = defExp;
        return ['var', name, ['lambda', params, body]];
    }

    // Transform switch to nested if expression 
    // Good code, see it again. 
    transformSwitchToIf(switchExp) {
      const[_tag, ...cases] = switchExp;

      const ifExp = ['if', null, null, null]; // ifExp is an array.

      let current = ifExp; // An array is copied, ie.e current points to the same reference. i.e. current and ifExp are same.

      for(let i = 0; i < cases.length - 1; i++) {
        const [currentCond, currentBlock] = cases[i];

        current[1] = currentCond;       // Doubt: If a condition is true, then how should we know to stop.
        current[2] = currentBlock;

        const next = cases[i+1];
        const [nextCond, nextBlock] = next;

        current[3] = nextCond === 'else'
          ? nextBlock
          : ['if'];

          current = current[3];  // Is this current a new local variable current? 
          // So are the changes in current reflected in current[3] like in that of ifExp above?
      }
      return ifExp; // current and ifExp are one and the same. Since ifExp is an array and is not copied but addressed is passed. 
    }
  
    
    // Transforms `for` to `while` 

    transformForToWhile(forExp) {
      const[_tag, init, condition, modifier, exp] = forExp;

      const whileExp = ['begin', init, ['while', condition, ['begin', exp, modifier]]];

      return whileExp;

    } 


    // Transforms `++ foo` to (set foo (+ foo 1))
 
    transformIncToSet(incExp) {

      const [_tag, exp] = incExp;
      return ['set', exp, ['+', exp, 1]];
    
    }

   
   // Transforms `-- foo` to (set foo (- foo 1))
   
    transformDecToSet(decExp) {

      const [_tag, exp] = decExp;
      return ['set', exp, ['-', exp, 1]];
    
    }


  // Transforms `+= foo val` to (set foo (+ foo val))
   
  transformIncValToSet(incExp) {
    const [_tag, exp, val] = incExp;
    return ['set', exp, ['+', exp, val]];
  }


  // Transforms `-= foo val` to (set foo (- foo val))

    transformDecValToSet(decExp) {
      const [_tag, exp, val] = decExp;
      return ['set', exp, ['-', exp, val]];
    }


  // Transforms `*= foo val` to (set foo (* foo val))

    transformMulValToSet(mulExp) {
      const [_tag, exp, val] = mulExp;
      return ['set', exp, ['*', exp, val]];
    }


  // Transforms `-/ foo val` to (set foo (/ foo val))

    transformDivValToSet(divExp) {
      const [_tag, exp, val] = divExp;
      return ['set', exp, ['/', exp, val]];
    }

}

module.exports = Transformer;