module.exports = (function () {

  var _ = require('lodash'),
      subscriptions = {};

  function publish (topic, params) {
    // early out if there are no subscribers to the topic
    if (typeof subscriptions[topic] === 'undefined' || subscriptions[topic].length === 0) {
      return;
    }

    params = (typeof params !== 'undefined') ? params : null;

    _.forOwn(subscriptions[topic], function (subscription) {
      subscription.callback(params);
    });
  }

  function addSubscription (subscription) {
    if (typeof subscriptions[subscription.topic] === 'undefined') {
      subscriptions[subscription.topic] = {};
    }

    subscriptions[subscription.topic][subscription.id] = subscription;
  }

  function removeSubscription (subscription) {
    delete subscriptions[subscription.topic][subscription.id];
  }

  function Subscription (topic, callback) {
    this.id = _.uniqueId('sub_');
    this.topic = topic;
    this.callback = callback;

    addSubscription(this);
  }

  Subscription.prototype.unsubscribe = function () {
    removeSubscription(this);
  };

  return {
    publish: publish,
    Subscription: Subscription
  };

})();