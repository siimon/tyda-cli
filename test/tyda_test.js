var assert = require('assert');
var tyda = require('../tyda.js');
var sinon = require('sinon');
var http = require('http');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');

var test_data = '';

describe('tyda.js', function(){
  beforeEach(function(){
    test_data = fs.readFileSync(path.join(__dirname,'test_files/test2.html'));

    sinon.stub(http,'get', function(url, cb){
      var ev = new EventEmitter();
      cb(ev);
      ev.emit('data', test_data);
      ev.emit('end');

      return ev;
    });

  });

  afterEach(function(){
    http.get.restore();
  });

  it('should make a request to tyda.se with provided url', function(){
    tyda.translate('hej', 'en', 'sv', function(err, res){
      assert.ok(http.get.calledWith('http://tyda.se/search/hej?lang%5B0%5D=en&lang%5B1%5D=sv'));
    });
  });

  it('should output languages once per language', function(){
    tyda.translate('hej', 'en', 'sv', function(err, res){
      assert.ok(res.Svenska !== null);

      assert.ok(res.Engelska !== null);
    });
  });

  it('should output language and all translations in a separate row', function(){
    tyda.translate('', 'en', 'sv', function(err, res){
      assert.equal(8, res.Engelska.length);
      assert.equal(16, res.Svenska.length);
    });
  });
});
