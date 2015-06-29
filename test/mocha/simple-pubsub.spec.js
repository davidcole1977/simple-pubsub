(function () {

  var expect = require('chai').expect,
      _ = require('lodash'),
      libDir = process.env.LIB_DIR || 'lib/',
      module = require(libDir + 'simple-pubsub');

  describe('simple-pubsub', function () {

    describe('public API', function () {
      
      describe('Subscription()', function () {
        var Subscription = module.Subscription;

        it('exists', function () {
          expect(Subscription).to.exist;
        });

        describe('unsubscribe', function () {

          it('exists', function () {
            var myPubSub = new Subscription();

            expect(myPubSub.unsubscribe).to.exist;
          });

        });


      });

    }); // describe('public API', function () {

    describe('private functions', function () {

      

    }); // describe('private functions', function () {

  });

})();
