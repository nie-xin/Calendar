var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
  url: 'src/assets/calendar.json',

  groupTimeSlots: function() {
    return _.chain(this.get('slots'))
    .groupBy(function(slot) {
      return moment(slot.starts_on).format('YYYY-w');
    })
    .reduce(function(memo, group, key) {
      var groupByDay = _.chain(group)
      .groupBy(function(slot) {
        return moment(slot.starts_on).format('YYYY-MM-DD');
      })
      .reduce(function(memo, group, key) {
        memo[key] = _.sortBy(group, 'starts_on');
        return memo;
      }, {})
      .value();
      memo[key] = groupByDay;
      return memo;
    }, {})
    .value();
  },
});
