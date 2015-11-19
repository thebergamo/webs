'use strict';

let nock = require('nock');
let expect = require('chai').expect;

let Webs = require('../index');

describe('Webs module', () => {
  describe('#instance', () => {
    it('should be an object', () => {
      expect(Webs).to.be.an('object');
    });

    it('should initialize formatsAvailable', () => {
      expect(Webs).to.have.property('formatsAvailable');
      expect(Webs.formatsAvailable).not.be.emtpy;
    });

    it('should initialize defaultOptions', () => {
      expect(Webs).to.have.property('defaultOpts');
      expect(Webs.defaultOpts).to.be.an('object');
      expect(Webs.defaultOpts).to.have.property('resolveWithFullResponse', true);
    });
  });

  describe('#request()', () => {
    before(() => {
      return configureRequests();
    });

    describe('when URI return not found', () => {
      let error;

      before(() => {
        return Webs.request({
          uri: 'http://webs.io/noFile',
          keys: ['title'] 
        })
        .catch((err) => {
          error = err;
        });
      });

      it('should throw a Error', () => {
        let fn = () => { throw error; };
        
        expect(fn).to.throw(Error);
        expect(fn).to.throw(/StatusCodeError: 404/); 
      }); 
    });

    describe('when a strange file type is requested', () => {
      let error;

      before(() => {
        return Webs.request({
          uri: 'http://webs.io/coolDson',
          keys: ['title'] 
        })
        .catch((err) => {
          error = err;
        });
      });

      it('should throw a Error', () => {
        let fn = () => { throw error; };
        
        expect(fn).to.throw(TypeError);
        expect(fn).to.throw(/Current Content-Type isn't parseable/); 
      }); 
    });

    describe('when a json is sended', () => {
      describe('when a broken json is required', () => {
        let error;

        before(() => {
          return Webs.request({
            uri: 'http://webs.io/poorJson',
            keys: ['title'] 
          })
          .catch((err) => {
            error = err;
          });
        });

        it('should throw a SyntaxError', () => {
          let fn = () => { throw error; };
          
          expect(fn).to.throw(SyntaxError);
          expect(fn).to.throw(/There are errors in your JSON: Unexpected token/); 
        }); 
      });

      describe('when a healthy json is required', () => {
        let response;

        before(() => {
          return Webs.request({
            uri: 'http://webs.io/healthyJson',
            keys: ['title'] 
          })
          .then((res) => {
            response = res;
          });
        });

        it('should response get an array', () => {
          expect(response).to.be.an('array');
        });

        it('should response have least 4 itens', () => {
          expect(response.length).to.have.least(4);
        });

        it('should response have the correct keys', () => {
          response.forEach((item) => {
            expect(item).to.be.an('object');
            expect(item).to.have.property('title');
          });
        });
      
      });
    });

    describe('when a xml is sended', () => {
      describe('when a broken xml is required', () => {
        let error;

        before(() => {
          return Webs.request({
            uri: 'http://webs.io/poorXML',
            keys: ['title'] 
          })
          .catch((err) => {
            error = err;
          });
        });

        it('should throw a Error', () => {
          let fn = () => { throw error; };
          
          expect(fn).to.throw(Error);
          expect(fn).to.throw(/There are errors in your xml file: mismatched tag/); 
        }); 
      });

      describe('when a healthy xml is required', () => {
        let response;

        before(() => {
          return Webs.request({
            uri: 'http://webs.io/healthyXML',
            keys: ['title'] 
          })
          .then((res) => {
            response = res;
          });
        });

        it('should response get an array', () => {
          expect(response).to.be.an('array');
        });

        it('should response have least 26 itens', () => {
          expect(response.length).to.have.least(26);
        });

        it('should response have the correct keys', () => {
          response.forEach((item) => {
            expect(item).to.be.an('object');
            expect(item).to.have.property('TITLE');
          });
        });
      
      });
    });
  });
});

function configureRequests () {
  nock('http://webs.io')
  .get('/noFile')
    .reply(404)
  .get('/coolDson')
    .reply(200, {}, { 'Content-Type': 'application/dson' } )
  .get('/poorJson')
    .replyWithFile(200, __dirname + '/mocks/poor.json', { 'Content-Type': 'application/json' })
  .get('/healthyJson')
    .replyWithFile(200, __dirname + '/mocks/healthy.json', { 'Content-Type': 'application/json' })
  .get('/poorXML')
    .replyWithFile(200, __dirname + '/mocks/poor.xml', { 'Content-Type': 'application/xml' })
  .get('/healthyXML')
    .replyWithFile(200, __dirname + '/mocks/healthy.xml', { 'Content-Type': 'application/xml' });
}
