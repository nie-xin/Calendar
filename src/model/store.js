//Using store pattern to manage shared states
var $ = require('jquery');
var _ = require('underscore');
var utils = require('../lib/utils');
var config = require('../lib/config');

var isMouseDown;
var booked;
module.exports = {
  init: function(options) {
    if (!options || !options.duration) {
      throw new Error('Store expects service duration as options');
    }

    this.duration = options.duration;
    isMouseDown = false;
    booked = {};
  },

  toggleMouseDown: function(force) {
    if (force) {
      isMouseDown = force;
    } else {
      isMouseDown = !isMouseDown;
    }
  },

  isMouseDown: function() {
    return isMouseDown;
  },

  getBooked: function() {
    return _.clone(booked);
  },

  resetBooked: function() {
    if (!_.isEmpty(booked)) {
      _.each(booked, function(node) {
        $(node).removeClass('booked');
      });

      booked = {};
    }
  },

  validateBooked: function() {
    if (_.keys(booked).length < this.duration) {
      this.resetBooked();

      //TODO: trigger event to change text
      // $('.validated').text('Service booked: ');
      this.trigger('booked:resetted');
    } else {
      var sorted = _.keys(booked).sort();

      var from = _.first(sorted);
      var fromSplitted = utils.splitDate(from);

      var to = moment(_.last(sorted)).add(1, 'hour').format(config.formatHour);
      var toSplitted = utils.splitDate(to);

      var msg = fromTime.day + ', ' + fromTime.hour + ' - ' + toTime.hour;
      this.trigger('booked:validated', msg);

      //TODO: trigger event
      // $('.validated').text('Service booked: ' + fromTime.day + ', ' + fromTime.hour + ' - ' + toTime.hour)
    }
  },
};
