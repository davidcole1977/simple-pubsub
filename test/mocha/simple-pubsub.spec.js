(function () {

  var expect = require('chai').expect,
      _ = require('lodash'),
      sinon = require('sinon'),
      libDir = process.env.LIB_DIR || 'lib/',
      modulePath = libDir + 'simple-pubsub';

  describe('simple-pubsub', function () {

    var pubsub;

    beforeEach(function () {
      // clear the require cache and reload the module to 'hard reset' the module state before each test
      delete require.cache[require.resolve(modulePath)];
      pubsub = require(modulePath);
    });

    it('subscriber callback is called with expected data when topic with single subscriber is published', function () {
      var callback = sinon.spy(),
          mySub = new pubsub.Subscription('my-topic', callback),
          testData = {foo: 'bar'};

      pubsub.publish('my-topic', testData);

      expect(callback.calledWith(testData)).to.be.true;
    });

    it('subscriber callback is not called when only subscription to topic is removed and then topic is published', function () {
      var callback = sinon.spy();
          mySub = new pubsub.Subscription('my-other-topic', callback),

      mySub.unsubscribe();
      pubsub.publish('my-other-topic');

      expect(callback.called).to.be.false;
    });

  });

})();
