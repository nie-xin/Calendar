var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');
var config = require('../lib/config');

module.exports = Backbone.Model.extend({
  url: 'src/assets/calendar.json',

  groupTimeSlots: function() {
    return _.chain(this.get('slots'))
    .groupBy(function(slot) {
      return moment(slot.starts_on).format(config.formatWeek);
    })
    .mapObject(function(group, key) {
      return _.chain(group)
      .groupBy(function(slot) {
        return moment(slot.starts_on).format(config.formatDay);
      })
      .mapObject(function(day) {
        return _.indexBy(day, function(hour) {
          return moment(hour.starts_on).format(config.formatHour);
        });
      })
      .value();
    })
    .value();
  },
});
