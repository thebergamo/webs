'use strict';

const _ = require('lodash');
const request = require('request-promise');

const Promise = require('bluebird');
const Parsick = require('parsick');

const parsick = new Parsick();

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
  .then((opt) => {
    return request(opt);    
  })
  .then((res) => {
    let type = getType.call(this, res.headers['content-type']);
    
    if (!type) {
      throw new TypeError('Current Content-Type isn\'t parseable');
    }

    return [type, res.body];
  })
  .spread((type, body) => {
    return parsick.parse(type, body, opt.keys);
  });
};

function getType (str) {
 let type;

 this.formatsAvailable.forEach(matchType);
 return type;

 function matchType (item) {
   const regex = new RegExp('(?:\/)('+item+')');
   if(str.match(regex)) {
     type = item;
   }
 }
}
