'use strict';

var _ = require('lodash');
var request = require('request-promise');

var Promise = require('bluebird');
var Parsick = require('parsick');

var parsick = new Parsick();

function Webs () {
  this.formatsAvailable = ['json', 'xml'];
  this.defaultOpts = {
    resolveWithFullResponse: true
  };
};

module.exports = new Webs();

Webs.prototype.request = function (opt) {
  return Promise
  .bind(this)
  .return(_.extend(this.defaultOpts, opt))
  .then(function (opt) {
    return request(opt);    
  })
  .then(function (res) {
    var type = getType.call(this, res.headers['content-type']);
    
    if (!type) {
      throw new TypeError('Current Content-Type isn\'t parseable');
    }

    return [type, res.body];
  })
  .spread(function (type, body) {
    return parsick.parse(type, body, opt.keys);
  });
};

function getType (str) {
 var type;

 this.formatsAvailable.forEach(matchType);
 return type;

 function matchType (item) {
   var regex = new RegExp('(?:\/)('+item+')');
   if(str.match(regex)) {
     type = item;
   }
 }
}
