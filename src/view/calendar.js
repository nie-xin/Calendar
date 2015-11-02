var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');
var template = require('../template/calendar.hbs');

module.exports = Backbone.View.extend({
  el: '.calendar',
  template: template,

  initialize: function(options) {
    this.from = options.from;
    this.to = options.to;
    this.timeSlots = options.timeSlots;
  },

  render: function() {
    return this;
  },
});
