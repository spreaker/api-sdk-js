var assert = require('chai').assert,
    Util   = require('../../src/Util.js');


describe('Util', function() {

    describe('buildUrl()', function() {

        it('should add query string params', function() {

            assert.equal(Util.buildUrl('http://www.spreaker.com', {}), 'http://www.spreaker.com');
            assert.equal(Util.buildUrl('http://www.spreaker.com', { a: 1 }), 'http://www.spreaker.com?a=1');
            assert.equal(Util.buildUrl('http://www.spreaker.com', { a: 1, b: 2 }), 'http://www.spreaker.com?a=1&b=2');
            assert.equal(Util.buildUrl('http://www.spreaker.com', { a: "1 2" }), 'http://www.spreaker.com?a=1%202');
        });

        it('should append query string params', function() {

            assert.equal(Util.buildUrl('http://www.spreaker.com?a=1', {}), 'http://www.spreaker.com?a=1');
            assert.equal(Util.buildUrl('http://www.spreaker.com?a=1', { b: 2 }), 'http://www.spreaker.com?a=1&b=2');
            assert.equal(Util.buildUrl('http://www.spreaker.com?a=1', { b: 2, c: 3 }), 'http://www.spreaker.com?a=1&b=2&c=3');
        });
    });


    describe('parseUrlParams()', function() {

        it('should parse query string', function() {

            assert.deepEqual(Util.parseUrlParams(''), {});
            assert.deepEqual(Util.parseUrlParams('?'), {});
            assert.deepEqual(Util.parseUrlParams('?a=1'), { a: "1" });
            assert.deepEqual(Util.parseUrlParams('?a=1&b=2'), { a: "1", b: "2" });
            assert.deepEqual(Util.parseUrlParams('?a=1%202&b=ciao+ciao'), { a: "1 2", b: "ciao ciao" });
        });

        it('should parse query string in the hash', function() {

            assert.deepEqual(Util.parseUrlParams(''), {});
            assert.deepEqual(Util.parseUrlParams('#'), {});
            assert.deepEqual(Util.parseUrlParams('#a=1'), { a: "1" });
            assert.deepEqual(Util.parseUrlParams('#a=1&b=2'), { a: "1", b: "2" });
            assert.deepEqual(Util.parseUrlParams('#a=1%202&b=ciao+ciao'), { a: "1 2", b: "ciao ciao" });
        });
    });

});
