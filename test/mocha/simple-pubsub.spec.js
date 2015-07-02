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

    describe ('publish()', function () {

      it('throws no errors if publish is attempted before any subscribers are available', function () {
        var publishAttempt = pubsub.publish.bind(null, 'my-topic');

        expect(publishAttempt).to.not.throw();
      });

      it('calls subscriber callback with correct data when topic with single subscriber is published with data', function () {
        var callback = sinon.spy(),
            mySub = new pubsub.Subscription('my-topic', callback),
            testData = {foo: 'bar'};

        pubsub.publish('my-topic', testData);

        expect(callback.calledWith(testData)).to.be.true;
      });

      it('calls subscriber callback with null data if no data is provided passed to publish', function () {
        var callback = sinon.spy(),
            mySub = new pubsub.Subscription('my-topic', callback),
            testData = {foo: 'bar'};

        pubsub.publish('my-topic');

        expect(callback.calledWith(null)).to.be.true;
      });

      it('does not call subscriber callback when only subscription to topic is removed and then topic is published', function () {
        var callback = sinon.spy();
            mySub = new pubsub.Subscription('my-topic', callback),

        mySub.unsubscribe();

        pubsub.publish('my-topic');

        expect(callback.called).to.be.false;
      });

      it('calls only the correct callbacks when a single topic with multiple subscribers is published and there are subscribers to other topics', function () {
        var callback1 = sinon.spy(),
            callback2 = sinon.spy(),
            callback3 = sinon.spy(),
            callback4 = sinon.spy(),
            callback5 = sinon.spy();

        new pubsub.Subscription('my-topic-1', callback1);
        new pubsub.Subscription('my-topic-1', callback2);
        new pubsub.Subscription('my-topic-1', callback3);

        new pubsub.Subscription('my-topic-2', callback4);
        new pubsub.Subscription('my-topic-3', callback5);

        pubsub.publish('my-topic-1');

        expect(callback1.calledOnce).to.be.true;
        expect(callback2.calledOnce).to.be.true;
        expect(callback3.calledOnce).to.be.true;

        expect(callback4.called).to.be.false;
        expect(callback5.called).to.be.false;
      });

    });

    describe ('getSubscriptionCount()', function () {

      it('returns 0 when module is initialised', function () { 
        expect(pubsub.getSubscriptionCount('my-topic')).to.equal(0);
      });

      it('returns 10 when there are 10 subscribers to the specified topic', function () {
        for (i = 0; i < 10; i += 1) {
          new pubsub.Subscription('my-topic', function () {});
        }

        expect(pubsub.getSubscriptionCount('my-topic')).to.equal(10);
      });

      it('returns 5 when 10 subscribers were added to the specified topic, five removed from the specified topic and 20 added to a different topic', function () {
        var mySubs = [];

        for (i = 0; i < 10; i += 1) {
          mySubs.push(new pubsub.Subscription('my-topic', function () {}));
        }

        for (i = 0; i < 5; i += 1) {
          mySubs[i].unsubscribe();
        }

        for (i = 0; i < 20; i += 1) {
          new pubsub.Subscription('my-other-topic', function () {});
        }

        expect(pubsub.getSubscriptionCount('my-topic')).to.equal(5);
      });

      it('returns 0 when 10 subscribers were added to the specified topic and then all unsubscribed', function () {
        var mySubs = [];

        for (i = 0; i < 10; i += 1) {
          mySubs.push(new pubsub.Subscription('my-topic', function () {}));
        }

        for (i = 0; i < 10; i += 1) {
          mySubs[i].unsubscribe();
        }

        expect(pubsub.getSubscriptionCount('my-topic')).to.equal(0);
      });

    });



  });

})();
