const   mocha           = require('mocha'),
        chai            = require('chai'),
        chaiAsPromised  = require('chai-as-promised'),
        should          = chai.should();

chai.use(chaiAsPromised);

describe("How to use promises", () => {
    const simplePromise = function(x){
        return new Promise((resolve, reject) => {
            if ( x > 0 ){
                resolve(x);
            }
            else{
                reject("Must be a positive number.");
            }
        });
    };

    it("Promise new returns a promise", () => {
        const promise = new Promise((resolve, reject) => resolve(2));
        return promise.should.eventually.be.equal(2);
    });

    it("If the promise is resolved, reject should have never been called", () => {
        const promise = simplePromise(3);
        return promise.should.be.fulfilled;
    });

    it("If the promise is rejected, resolve should have never been called", () => {
        const promise = simplePromise(-3);
        return promise.should.be.rejected;
    });

    it("Then accepts a fullfilment handler", () => {
        const promise = simplePromise(3);
        return promise.then((value) => {
            return value.should.be.equal(3);
        })
    });

    it("Then accepts a rejection handler", () => {
        const promise = simplePromise(-3);
        return promise.then((value) => {}, (error) => {
            error.should.be.equal("Must be a positive number.");
        });
    });

    it("Catch is the rejection handler", () => {
        const promise = simplePromise(-3);
        return promise.catch((error) => {
            error.should.be.equal("Must be a positive number.");
        });
    });

    it("A promise is externally immutable once resolved", () => {
        const promise = simplePromise(3);
        const promiseA = promise.then((value) => value);
        const promiseB = promise.then((value) => value);
        return Promise.all([promiseA, promiseB]).then(values => {
            values[0].should.be.equal(3);
            values[1].should.be.equal(3);
        });
    });

    it("Calling resolve converts a function to a promise", () => {
        function foo(x) {
            if ( x > 0) return x;
            return -x;
        }

        const promise = Promise.resolve(foo(-3));
        return promise.should.eventually.be.equal(3);
    });

    it("Only first resolve is used", () => {
        const promise = new Promise((resolve, reject) => {
            resolve(2);
            resolve(3);
            resolve(4);
        });

        return promise.should.eventually.be.equal(2);
    });

    it("Only first reject is used", () => {
        const promise = new Promise((resolve, reject) => {
            reject("First reason");
            reject("Second reason");
            reject("Third reason");
        });

        return promise.should.eventually.be.rejectedWith("First reason");
    });

    it("Only first parameter in resolved is used", () => {
        const promise = new Promise((resolve, reject) => {
            resolve(2,3);
        });

        return promise.should.eventually.be.equal(2);
    });

    it("Only first parameter in reject is used", () => {
        const promise = new Promise((resolve, reject) => {
            reject("Reason","Another thing");
        });

        return promise.should.eventually.be.rejectedWith("Reason");
    });

    it("Turns JS exceptions into asynchronous behavior", () => {
        const promise = new Promise((resolve, reject) => {
            nonExistingFunction(2);
            resolve(2);
        });

        return promise.should.eventually.be.rejected;
    });

    it("Exceptions in the fulfillment or rejection events get caught in the outher rejection event", () => {
        const promise = new Promise((resolve, reject) => {
            resolve(2);
        });

        const outerPromise = promise.then((value) => {
            nonExistingFunction(2);
        }, (error) => {
            should.fail("Should never get here.");
        });

        return outerPromise.should.eventually.be.rejected;
    });

    it("If you pass an immediate value to resolve you get a promise that's fulfilled with that value", () => {
        const promise = Promise.resolve(2);

        return promise.should.eventually.be.equal(2);
    });

    it("If you pass a promise to resolve you get the same promise back", () => {
        const promise1 = Promise.resolve(2);
        const promise2 = Promise.resolve(promise1);

        promise2.should.be.equal(promise1);
    });

    it("If you pass an immediate value to reject you get a promise that's rejected with that reason", () => {
        const promise = Promise.reject("Some reason");

        return promise.should.eventually.be.rejectedWith("Some reason");
    });

    it("If you pass a promise to reject you dont' get the same promise back. The promise will be the rejection reason.", () => {
        const promise1 = Promise.reject("Some reason");
        const promise2 = Promise.reject(promise1);

        promise2.should.not.be.equal(promise1);
    });

    it("Calling then creates a new promise", () => {
        const promise = Promise.resolve(2);
        const promise2 = promise.then((value) => {
            value.should.be.equal(2);
            return 5;
        });
        
        promise2.should.eventually.be.equal(5);
    });

    it("Promises can be chained", () => {
        const promise = 
            Promise.resolve(2)
            .then((value) => {
                value.should.be.equal(2);
                return 5;
            });
        
        promise.should.eventually.be.equal(5);
    });

    it("Reject returns a fulfilled promise", () => {
        const promise = simplePromise(-3).then((value) => {
            should.fail("Should not get here");
        }, (reason) => {
            reason.should.be.equal("Must be a positive number.");
            return 42;
        });

        return promise.should.eventually.be.equal(42);
    });

    it("The default rejection handler rethrows the error", () => {
        const promise = 
            simplePromise(-3)
            .then((value) => 1)
            .then((value) => 2)
            .then((value) => 3)
            .then((value) => 4);
            
        return promise.should.eventually.be.rejectedWith("Must be a positive number.");
    });

    it("The default fulfillment handler passes whatever it receives to the next step", () => {
        const promise = 
            simplePromise(3)
            .then(null, (reason) => {should.fail("Should not get here.")});

        return promise.should.eventually.be.equal(3);
    });

    it("An invalid promise creation throws an exception, doesn't return a rejected promise", () => {
        (() => new Promise(null)).should.throw;
    });

    it("Promise all wait for more than one promise", () => {
        const promise1 = simplePromise(2);
        const promise2 = simplePromise(5);
        const all = Promise.all([promise1, promise2]);

        return all.should.eventually.be.deep.equal([2, 5]);
    });

    it("Promise all gets rejected if any of the promises is rejected", () => {
        const promise1 = simplePromise(2);
        const promise2 = simplePromise(-2);
        const all = Promise.all([promise1, promise2]);

        return all.should.eventually.be.rejectedWith("Must be a positive number.");
    });

    it("Promise race returns the promise that returns first", () => {
        const promiseDelay = new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve(42);
            }, 200);
        });
        const promise = simplePromise(3);
        const race = Promise.race([promiseDelay, promise]);

        return race.should.eventually.be.equal(3);
    });

    it("Promise race gets rejected if any of the promises is rejected before another resolves.", () => {
        const promiseDelay = new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve(42);
            }, 200);
        });
        const promise = simplePromise(-2);
        const race = Promise.race([promiseDelay, promise]);

        return race.should.eventually.be.rejectedWith("Must be a positive number.");
    });

    it("If an error is catched, generic handler error will not catch it", () => {
        const promise = 
            Promise.resolve(2)
            .then((value) => value)
            .then((value) => Promise.reject("An error"))
            .catch((error) => 42)
            .then((value) => value)
            .catch((error) => should.fail("Should not get here"));

        return promise.should.eventually.be.equal(42);
    });
});