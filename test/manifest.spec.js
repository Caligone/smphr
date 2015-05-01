var Lab = require('lab');
var Code = require('code');
var Manifest = require('../manifest');

var lab = exports.lab = Lab.script();

lab.experiment('Manifest', function () {

    lab.test('Test simple du format', function (done) {
        Code.expect(Manifest).to.be.an.object();
        Code.expect(Manifest.server).to.be.an.object();
        Code.expect(Manifest.connections).to.be.an.array();
        Code.expect(Manifest.plugins).to.be.an.object();
        done();
    });

});