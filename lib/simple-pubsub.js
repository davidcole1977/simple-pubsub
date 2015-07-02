module.exports = (function () {

  var _ = require('lodash'),
      subscriptions = {};

  function getSubscriptionCount (topic) {
    return (typeof subscriptions[topic] === 'undefined') ? 0 : Object.keys(subscriptions[topic]).length;
  }

  function publish (topic, params) {
    // early out if there are no subscribers to the topic – fail silently
    if (typeof subscriptions[topic] === 'undefined' || subscriptions[topic].length === 0) {
      return;
    }

    params = (typeof params !== 'undefined') ? params : null;

    _.forOwn(subscriptions[topic], function (subscription) {
      subscription.callback(params);
    });
  }

  function createTopicIfDoesNotExist (topic) {
    if (typeof subscriptions[topic] === 'undefined') {
      subscriptions[topic] = {};
    }
  }

  function removeTopicIfNoSubscribers (topic) {
    if (getSubscriptionCount(topic) === 0) {
      delete subscriptions[topic];
    }
  }

  function addSubscription (subscription) {
    createTopicIfDoesNotExist(subscription.topic);
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
    removeTopicIfNoSubscribers(this.topic);
  };

  return {
    publish: publish,
    Subscription: Subscription,
    getSubscriptionCount: getSubscriptionCount
  };

})();