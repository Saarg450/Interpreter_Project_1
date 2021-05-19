//  Eva Programming language

//  AST interpreter

const assert = require('assert');
const Environment = require('./Environment');

const { env } = require('process');
const { isString } = require('util');

const Transformer = require('./transform/Transformer');

const evaParser = require('./parser/evaParser');

const fs = require('fs');

//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------

// Eva Interpreter

class Eva {

// Creates an Eva instance with the global environment

    constructor(global = GlobalEnvironment){
        this.global = global;
        this._transformer = new Transformer();
    }

// Evaluates global code wrapping into a block

    evalGlobal(exp) {

       //return this.eBlock(expressions, this.global);
       return this.evalBody(exp, this.global);
    }

/* ->Evaluates an expression in the given environment 
   ->If while calling the eval method, we do not pass the environment, then by defualt, env
     will be initialized with this.global i.e. Global Environment. */
    eval(exp, env = this.global) {

//---------------------------------------------------------------------------------------------------------------------
// Self-evaluating expressions:

        if(this.isNo(exp)) {
           
            return exp;
        }

        if(this.isStr(exp)) {
            return exp.slice(1,-1);
        }

//-----------------------------------------------------------------------------------------------------------------------
// Block: Evaluating expressions:

        if(exp[0] === 'begin') {

            /* ->A new environment is created on entering the block and the block is
                 evaluated inside this new environment i.e. 'blockEnv'.
               ->The parent link of this new environment is set to the environment where
                 this block was defined. */
            const blockEnv = new Environment({}, env);

            /* ->Hence we pass the environment into eBlock function, so that the block
                 is evaluated in this new environment. */
            return this.eBlock(exp, blockEnv);
        }

//--------------------------------------------------------------------------------------------------------------------------
// Variables Decelaration:

        if(exp[0] === 'var') {
            const [_, name, value] = exp;

            /*-> The value of a variable might be any complex sub expression.
              ->  Hence we must evaluate this sub expression before assigning to the variable.
              ->  Hence we use this.eval(value, env).*/             
            return env.define(name, this.eval(value,env)); 
            /* ->If value is a lambda expression, then this.eval(value, env) will return function object which 
                 will be defined as value of variable name.*/
            
        }

//------------------------------------------------------------------------------------------------------------------------------
// Variables update:

        if(exp[0] === 'set') {
            const [_, ref, value] = exp;

            // Assignment to a property:

            if(ref[0] === 'prop') {
                const [_tag, instance, propName] = ref;
                const instanceEnv = this.eval(instance, env);

                /* ->remember we are using define not assign because we only want to alter our own record, 
                     i.e. the instanceEnv record. */
                return instanceEnv.define(
                    propName,
                    this.eval(value, env)
                );
            }

            // simple assignment:
            return env.assign(ref, this.eval(value,env));
        }

//-------------------------------------------------------------------------------------------------------------------
// Variables Access:

        if(this.isVariableName(exp)) {

            return env.lookup(exp);
        }

//---------------------------------------------------------------------------------------------------------------------------
// if-expressions:

        if(exp[0] === 'if') {
            const [_tag, condition, consequent, alternate] = exp;
            if(this.eval(condition, env)) {
                return this.eval(consequent, env);
            }

            return this.eval(alternate, env);
        }

//------------------------------------------------------------------------------------------------------------------------
// while-expressions:

        if(exp[0] === 'while') {
            const [_tag, condition, body] = exp;
            let result;

            while(this.eval(condition, env)){
                result = this.eval(body, env);
            }

            return result;
        }

//-------------------------------------------------------------------------------------------------------------------------------
// Function Decelarations: (def sqaure (x) (* x x))

// Syntactic Sugar: (var square (lambda x (* x x)))

        if(exp[0] === 'def') {

            // JIT - transpile to a variable decelaration

            const varExp = this._transformer.transformDefToLambda(exp);

            return this.eval(varExp, env);

        }

//---------------------------------------------------------------------------------------------------------------------------------
// Switch expression:

// Syntactic Sugar for nested if expressions:

        if(exp[0] === 'switch') {
            const ifExp = this._transformer.transformSwitchToIf(exp);

            return this.eval(ifExp, env);
        }

//-----------------------------------------------------------------------------------------------------------------------------------------
// For loop expression:

// Syntactic sugar for while loop expressions:

        if(exp[0] === 'for') {
            const whileExp = this._transformer.transformForToWhile(exp);

            return this.eval(whileExp, env);
        } 

//---------------------------------------------------------------------------------------------------------------------------------------------
// increment opeartion:

// Syntactic Sugar for setting a value:

if(exp[0] === '++') {
    const setExp = this._transformer.transformIncToSet(exp);

    return this.eval(setExp, env);
}

//----------------------------------------------------------------------------------------------------------------------------------------------
// decrement opeartion:

// Syntactic Sugar for setting a value:

if(exp[0] === '--') {
    const setExp = this._transformer.transformDecToSet(exp);

    return this.eval(setExp, env);
}

//-----------------------------------------------------------------------------------------------------------------------------------------------
// Short-hand + opeartion:

// Syntactic Sugar for setting a value:

if(exp[0] === '+=') {
    const setExp = this._transformer.transformIncValToSet(exp);

    return this.eval(setExp, env);
}

//----------------------------------------------------------------------------------------------------------------------------------------------------
// Short-hand - opeartion:

// Syntactic Sugar for setting a value:

if(exp[0] === '-=') {
    const setExp = this._transformer.transformDecValToSet(exp);

    return this.eval(setExp, env);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Short-hand * opeartion:

// Syntactic Sugar for setting a value:

if(exp[0] === '*=') {
    const setExp = this._transformer.transformMulValToSet(exp);

    return this.eval(setExp, env);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Short-hand / opeartion:

// Syntactic Sugar for setting a value:

if(exp[0] === '/=') {
    const setExp = this._transformer.transformDivValToSet(exp);

    return this.eval(setExp, env);
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
// Lambda functions:

        if(exp[0] === 'lambda') {
            const [_tag, params, body] = exp;

            return {
                params,
                body,
                env, //Closure
            };
        }

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Class Decelarations:

        if(exp[0] === 'class') {
            const [_tag, name, parent, body] = exp;

            /* ->Beacuse a class should inherit from both the parent environment and also the environment
                 in which the class was defined. Hence we use 'or' operator. */
            const parentEnv = this.eval(parent, env) || env; 
            /* ->We eval parent env i.e. 'this.eval(parent, env)' since we need the 'parent'(the name used in place of parent) environment
                 parent is just a name, by eval we get environement of the name used in place of parent.
                 And then we 'or' that environment with env.*/
            
            const classEnv = new Environment({}, parentEnv);

            // Body is evaluated in Class Environment

            this.evalBody(body, classEnv);

            // Class is accessible by name

            return env.define(name, classEnv);
        }

//----------------------------------------------------------------------------------------------------------------------------------------------------------
// Super expressions:

        if(exp[0] === 'super') {
            const[_tag, className] = exp;
            return this.eval(className, env).parent;
        }

//------------------------------------------------------------------------------------------------------------------------------------------------------------
// Class instaniation:

        if(exp[0] === 'new') {

            const classEnv = this.eval(exp[1], env);

            /* ->An instance of a class in an environment.
               ->The 'parent' component of an the instance environment is set to its class. */
            const instanceEnv = new Environment({}, classEnv);

            const args = exp.slice(2).map(arg => this.eval(arg, env));

            this.callUserDefinedFun(classEnv.lookup('constructor'),
            [instanceEnv, ...args]);

            // instanceEnv is an object of Environment class which is returned. 
            return instanceEnv; 
        }

//--------------------------------------------------------------------------------------------------------------------------------------------
// property access:

       if(exp[0] === 'prop') {
            const [_tag, instance, name] = exp;

            const instanceEnv = this.eval(instance, env);

            return instanceEnv.lookup(name);

            /* ->The examples given below, first go to the isArray function.
               ->This probably returns an object generated from the return statement of lambda function
                like {params, body, env}.
               ->This whole object is given in return to probably the isArray part as exp[0]
                the other part is the argument which is passed i.e. exp[1] and remaining.
                eg. this is the expression which probably led to all this
                eg. 1) ((prop p calc) p)  ----- Class-test //this whole first goes to isArray.
                eg. 2) ((prop math abs) (- 10)) ------ import-test. */
        }
 
//---------------------------------------------------------------------------------------------------------------------------------------------------
// Module decelaration:

        if(exp[0] === 'module') {
            const [_tag, name, body] = exp;

            const moduleEnv = new Environment({}, env);

            return env.define(name, this.evalBody(body, moduleEnv));
        }

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Module import:

        if(exp[0] === 'import') {

            if(exp.length == 2) {

            const [_tag, name] = exp;

            const moduleSrc = fs.readFileSync(`${__dirname}/modules/${name}.eva`, 'utf-8',);

            const body  = evaParser.parse(`(begin ${moduleSrc})`);

            const moduleExp = ['module', name, body];

            return this.eval(moduleExp, this.global); // This will return moduleEnv
            // should it be this.global or env? Does this.global increases the time needed to solve this. Is env better?

        }

            const [_tag, funm, name] = exp;

            const moduleSrc = fs.readFileSync(`${__dirname}/modules/${name}.eva`, 'utf-8',);

            const body  = evaParser.parse(`(begin ${moduleSrc})`);

            const moduleExp = ['module', name, body];

            const bufferEnv = new Environment({}, env);

            const fenv = this.eval(moduleExp, bufferEnv);
            // fenv here is moduleEnv or newModuleEnv depending upon the export expression.

            funm.forEach(funa => {
                env.define(funa, fenv.lookup(funa));
            }); 

            return;

    }

//----------------------------------------------------------------------------------------------------------------------------------------------------------
// Module exports:

         if(exp[0] === 'exports') {


            if(exp.length === 2) {
                return env;
            }

            const [_tag, name, ...funs] = exp;

            const newModuleEnv = new Environment({}, this.global);

            funs.forEach(funame => {
                (newModuleEnv).define(funame, env.lookup(funame));
            });

            return newModuleEnv;

        } 

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Function Calls:

       if(Array.isArray(exp)) {

                
            const fn = this.eval(exp[0], env);

            /* ->The arguments of the function are evaluated. Hence suppose in case of '+' function
                 defined in global environment, the opearands are that it receives are already evaluated
                 and hence do not need to be evaluated again. */
            const args = exp.slice(1).map(arg => this.eval(arg, env));

            // 1. Native function: Here implemented directly in the underline language i.e. Javascript

            if(typeof fn === 'function') {
               
                return fn(...args); //function call
            }

            // 2. User-defined function:

            return this.callUserDefinedFun(fn, args);

        }

//---------------------------------------------------------------------------------------------------------------------------------------------

        throw `Unimplemented ${JSON.stringify(exp)}`;
    }

//------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------

// Helper functions:

    callUserDefinedFun(fn, args) {

        const activationRecord = {};

        fn.params.forEach((param, index) =>{
            activationRecord[param] = args[index]; 
        });

        const activationEnv = new Environment(activationRecord, 
            fn.env // Static scope
            );

        return this.evalBody(fn.body, activationEnv);

    }

    evalBody(body, env) {
        if(body[0] === 'begin') {

            /* ->By checking the 'begin', we optimize since evaluating a block creates a new environment itself.
                Hence we check it and directly call eBlock since activationEnv is already created. We can evaluate
                the block in this environment. */
            return this.eBlock(body, env);
        }
        return this.eval(body, env);
    }

    /* ->eBlock accpets env as a parameter since, the block is to be evaluated in a new environment
         which is created specifically on entering the block. Hence we gain access to the value of a variable 
         defined in local scope even though the same varaible name may be used in global scope. */
    eBlock(block, env) {

        /* ->This 'result' is the result for evaluating the last expression of the block. i.e. The value that 
             the block should return. Hence we have created a variable for it. */
        let result;
    
        const [_tag, ...expressions] = block;
    
        // Here we regularly track the result of each expression of the block.
        expressions.forEach(exp => {
            result = this.eval(exp, env); // result gets updated every time. 
        });
        /* After exiting this above 'expressions.forEach', the result of the last expression in the block
         is stored in the variable 'result' by overwriting the result of second last expression. */
           
        return result;
    }

    isNo(exp) {
        return (typeof exp) === 'number';
    }
    
    isStr(exp) {
        return (typeof exp) === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
    }
    
    isVariableName(exp) {
        return (typeof exp) === 'string' && /^[+\-*/<>=a-zA-Z][+\-*/<>=a-zA-z0-9_]*$/.test(exp);  
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* ->Creates a GlobalEnvironment object of Environment class.
   ->The record of GlobalEnvironment object is initialized with some of the values written below like null, true, etc.
   ->Since the parent environment is not provided, it is automatically initialzed with null as in the constructor of Environement class.
   ->Default Global Environment which is passed to the Eva constructor to set as default global environment. */
const GlobalEnvironment = new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '0.1',

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Math Operators:

    // record name = '+'. Hence '+' is defined in this default global environment. Here '+' is actually a variable name and function name.
    '+'(op1, op2) {
        
        return op1 + op2;
    },

    '-'(op1, op2 = null) {
        if(op2 == null)
        return -op1;

        return op1 - op2;
    },

    '*'(op1, op2) {
        
        return op1 * op2;
    },

    '/'(op1, op2) {
        return op1 / op2;
    },

    '%'(op1, op2) {
        return op1 % op2;
    },

    // Comparison Operators:

    '>'(op1, op2) {
        return op1 > op2;
    },

    '<'(op1, op2) {
        return op1 < op2;
    },

    '>='(op1, op2) {
        return op1 >= op2;
    },

    '<='(op1, op2) {
        return op1 <= op2;
    },

    '=='(op1, op2) {
        return op1 === op2;
    },

    // Console ouptut

    print(...args) {
        console.log(...args);
    },

});

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = Eva;