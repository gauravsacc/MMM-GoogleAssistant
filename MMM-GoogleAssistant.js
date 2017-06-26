/* Magic Mirror
 * Module: MMM-GoogleAssistant
 *
 * By Gaurav
 *
 */

Module.register("MMM-GoogleAssistant", {
  // Module config defaults.
  defaults: {

    header: "Google Asistant",
    maxWidth: "100%",
    publishKey: 'PUBLISH_KEY',
    subscribeKey: 'SUBSCRIBE_KEY',
  },

  // Define start sequence.
  start: function() {
    Log.info('Starting module: Google Assistant Now');
    this.assistantActive = false;
    this.processing = false;
    this.userQuery = null;
    this.sendSocketNotification('INIT', 'handshake');
  },

  getDom: function() {
    Log.log('Updating DOM for GA');
    var wrapper = document.createElement("div");

    if (this.assistantActive == true) {
      if (this.processing == true) {
        wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_active.png'></img><br/>" + this.userQuery;
      } else {
        wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_active.png'></img>";
      }

    } else {
      wrapper.innerHTML = "<img src='MMM-GoogleAssistant/assistant_inactive.png'></img>";
    }
    return wrapper;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == 'ON_CONVERSATION_TURN_STARTED') {
      this.assistantActive = true;
    } else if (notification == 'ON_CONVERSATION_TURN_FINISHED') {
      this.assistantActive = false;
      this.processing = false;
    } else if (notification == 'ON_RECOGNIZING_SPEECH_FINISHED') {
      this.userQuery = payload;
      this.processing = true;
    }
    this.updateDom(500);
  },
});
