var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');
var config = require('../lib/config');

module.exports = Backbone.Model.extend({
  url: 'src/assets/service_offer.json',

  getDurationInHour: function() {
    return (this.get('service_duration')) / 3600;
  },
});
