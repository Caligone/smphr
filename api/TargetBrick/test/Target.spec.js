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

var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var db = new Db('smphr-testing', new Server('localhost', 27017));

lab.experiment('User', function () {

    var server, tmpIdEmail, tmpIdDevice, tmpUDID;
    
    before(function (endBefore) {
        async.auto({
            compose: function (endCompose) {
                Glue.compose(manifest, options, function (err, _server) {
                    server = _server;
                    endCompose();
                });
            },
            openDB: function (endOpenDB) {
                db.open(endOpenDB);
            },
            dropDB: ['openDB', function (endDropDB, results) {
                db.dropDatabase(endDropDB);
            }]
        }, function (err, results) {
            endBefore();
        });
    });
    /*
    test('Insertion simple', function (endTest) {
        var request = {
            method: 'POST',
            url: '/emails',
            payload: {
                email: 'email@domain.com',
                udid: 'testudid',
                name: 'testname',
                model: 'testmodel',
                push_token: 'testpush_token'
            }
        };
     
        server.inject(request, function (response) {
            var result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result).to.be.instanceof(Object);
            expect(result.email).to.be.equal(request.payload.email);
            expect(result.devices).to.be.instanceof(Array);
            expect(result.devices).to.have.length(1);
            expect(result.devices[0].udid).to.be.equal(request.payload.udid);
            expect(result.devices[0].name).to.be.equal(request.payload.name);
            expect(result.devices[0].model).to.be.equal(request.payload.model);
            expect(result.devices[0].push_token).to.be.equal(request.payload.push_token);
            tmpIdEmail = result._id;
            tmpIdDevice = result.devices[0].id;
            tmpUDID = result.devices[0].udid;
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