var schema = require('async-validator');
var promises = require('bluebird');
var _ = require("lodash");



module.exports = function(descriptor, data, callback) {
    var validator = promises.promisifyAll(new schema(descriptor));
    validator.validateAsync(data)
    .then(function(){ callback(null,true);})
    .catch(function(err) {

        console.log(new Error);
    });

}
