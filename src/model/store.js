//Using store pattern to manage shared states
var $ = require(jquery);
var utils = require('../lib/utils');
var config = require('../lib/config');

var isMouseDown = false;
var booked = {};
module.exports = {
  this.on('mousedown', this.toggleMouseDown);
  this.on('mouseup', this.toggleMouseDown);

  toggleMouseDown: function(e) {
    if (e.type === 'mousedown') {
      isMouseDown = true
      this.resetBooked()
    } else {
      isMouseDown = false
      this.validateBooked()
    }
  },

  getBooked: function() {
    return booked;
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
    if (_.keys(booked).length < durationInHour) {
      this.resetBooked();

      //TODO: trigger event to change text
      // $('.validated').text('Service booked: ');
    } else {
      var sorted = _.keys(booked).sort();

      var from = _.first(sorted);
      var fromSplitted = utils.splitDate(from);

      var to = moment(_.last(sorted)).add(1, 'hour').format(config.formatHour);
      var toSplitted = utils.splitDate(to);

      //TODO: trigger event
      // $('.validated').text('Service booked: ' + fromTime.day + ', ' + fromTime.hour + ' - ' + toTime.hour)
    }
  },
};
