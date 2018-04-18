/* Magic Mirror
 * Module: MMM-GA
 *
 * By Gaurav
 *
 */
'use strict';

var NodeHelper = require("node_helper");
var PubNub = require('pubnub');

module.exports = NodeHelper.create({

  initGoogleAssistant: function(payload) {
    var self = this;
    this.pubnub = new PubNub({
      //publishKey,subscribeKey
      publishKey: payload.publishKey,
      subscribeKey: payload.subscribeKey,
    });

    this.pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          //publishSampleMessage();
        }
      },
      message: function(message) {
        if (message.message === 'ON_CONVERSATION_TURN_STARTED') {
          self.sendSocketNotification('ON_CONVERSATION_TURN_STARTED', null);
        } else if (message.message === 'ON_CONVERSATION_TURN_FINISHED') {
          self.sendSocketNotification('ON_CONVERSATION_TURN_FINISHED', null);
        } else if (message.message.includes('ON_RECOGNIZING_SPEECH_FINISHED')) {
          var query = message.message.split(":");
          self.sendSocketNotification('ON_RECOGNIZING_SPEECH_FINISHED', query[1]);
        }
      },
      presence: function(presenceEvent) {
        // handle presence
      }
    });

    this.pubnub.subscribe({
      channels: ['magicmirror']
    });
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'INIT') {
      console.log("now initializing assistant");
      this.initGoogleAssistant(payload);
    }
  }

});
