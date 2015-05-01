'use strict';
process.env.NODE_ENV = 'testing';

var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    suite = lab.suite,
    test = lab.test,
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    async = require('async');

var Glue = require('glue');
var manifest = require('../../../manifest');
var options = {
    relativeTo: process.cwd()
};

lab.experiment('Base', function () {

    var server;
    
    lab.before(function (endBefore) {
        async.auto({
            compose: function (endCompose) {
                Glue.compose(manifest, options, function (err, _server) {
                    server = _server;
                    endCompose();
                });
            }
        }, function (err, results) {
            endBefore();
        });
    });
    
    lab.test('Check the output format', function (endTest) {

        var request = {
            method: 'GET',
            url: '/'
        };
     
        server.inject(request, function(response) {
            var result = response.result;
     
            expect(response.statusCode).to.equal(200);
            expect(result).to.be.instanceof(Object);
            expect(result).to.have.length(2);
            expect(result.motd).to.be.a.string();
            expect(result.apiVersion).to.be.a.string();
            expect(result.apiVersion).to.be.equal(require('../../../package.json').version);
            endTest();
        });

    });
    /*
    lab.test('Failed when sending params', function (endTest) {

        var options = {
            method: 'GET',
            url: '/',
            params: {
                aze: 'rty'
            }
        };
     
        server.inject(options, function(response) {
            var result = response.result;
            expect(response.statusCode).to.equal(400);
            endTest();
        });

    });
    
    lab.test('Failed when sending payload', function (endTest) {

        var options = {
            method: 'GET',
            url: '/',
            payload: {
                aze: 'rty'
            }
        };
     
        server.inject(options, function(response) {
            var result = response.result;
            expect(response.statusCode).to.equal(400);
            endTest();
        });

    });
    
    lab.test('Failed when sending query', function (endTest) {

        var options = {
            method: 'GET',
            url: '/',
            query: {
                aze: 'rty'
            }
        };
     
        server.inject(options, function(response) {
            var result = response.result;
            expect(response.statusCode).to.equal(400);
            endTest();
        });

    });
    */
    after(function (endAfter) {
        server.plugins.mongoose.db.disconnect(function () {
            server.stop({ timeout: 0 }, function () {
                endAfter();
            });
        });
    });
});