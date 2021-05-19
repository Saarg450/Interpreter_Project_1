// Environment: names storage

class Environment{

// Creates an Environment with the given record

    constructor(record = {}, parent = null){
        this.record = record;
        this.parent = parent;
    }

// Creates a variable with the given name and value

    define(name, value) {
        this.record[name] = value;
        return value;
    }

// updates an existing variable

   assign(name, value) {

        /* ->We will resolve till we find the record of the environment where variable is defined.
             Then we set the variable with the new value. */ 
        this.resolve(name).record[name] = value;
        return value;
    }

// Return the value of a declared variable or throws if a variable is not defined

    lookup(name) {
        return this.resolve(name).record[name];
    } 

/* ->Returns specific Environment in which a variable is defined or throws if a variable is not defined.
   ->Identifer resoltion: Traversing the scope chain to find the specific environement where the
     variable is defined. */

    resolve(name) {
        if(this.record.hasOwnProperty(name)) {

            /* ->Returns the object of the environment where the variable is found. 
               ->So that we can access the record of this object and find the value of the variable
                 in the lookup method. */
            return this;
        }

        if(this.parent == null) {
            throw new ReferenceError(`Variable "${name}" is not defined.`);
        }

        return this.parent.resolve(name);
    }

}

module.exports = Environment;