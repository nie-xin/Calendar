var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');
var $ = require('jquery');
var utils = require('../lib/utils');
var config = require('../lib/config');
var template = require('../template/table.hbs');

module.exports = Backbone.View.extend({
  el: '.table',
  template: template,

  initialize: function(options) {
    this.weekIndex = options.weekIndex;
    this.availableTime = options.availableTime;
    this.period = this.getTimeByIndex(this.weekIndex);
    var timeTable = this.getWeeklyTimeTable(this.period.start, this.period.end, this.availableTime);
    this.model = timeTable;
  },

  getTimeByIndex: function(index) {
    var split = utils.splitDate(index, '-');
    var timeFormat = split.pre + '-W' + split.suf;
    var start = moment(timeFormat).startOf('week').format();
    var end = moment(timeFormat).endOf('week').format();

    return {
      start: start,
      end: end,
    };
  },

  getWeeklyTimeTable: function(start, end, availables) {
    var tableIndex = null;
    var weekDays = utils.getRangeOf(start, end, 'days');

    var slots = weekDays.map(function(weekDay) {
      var start = utils.getStartOf(weekDay, 'd');
      var end = utils.getEndOf(weekDay, 'd');
      var hourRange = utils.getRangeOf(start, end, 'hours', config.formatHour);
      var availability = availables[moment(weekDay).format(config.formatDay)];

      var slot = hourRange.map(function(time) {
        var available = false;
        if (availability && availability[time]) {
          available = true;
        }

        return {
          time: time,
          available: available,
          showText: false,
        };
      });

      if (!tableIndex) {
        tableIndex = slot.map(function(time) {
          var clone = _.clone(time);
          clone.time = clone.time.split(' ')[1];
          clone.showText = true;
          return clone;
        });

        tableIndex.unshift({
          time: 'index',
          showText: false,
          available: false,
        });
      }

      var header = _.clone(slot[0]);
      header.showText = true;
      header.time = moment(slot[0].time).format(config.formatHeader);
      slot.unshift(header);

      return slot;
    });

    slots.unshift(tableIndex);
    return slots;
  },

  // TODO: DRY
  getTemplateData: function(data) {
    data.cid = this.weekIndex;
    return template(data);
  },

  // TODO: DRY
  render: function() {
    var model = this.model || {};
    var templateData = this.getTemplateData(model);
    this.$el.html(templateData);
    this.initEvents();

    return this;
  },

  initEvents: function() {
    // Avoid mass of jquery each context binding
    _.each(this.el.querySelectorAll('.available'), function(slot) {
      slot.addEventListener('mouseover', this.bookTimeSlots);
    }, this);
  },

  bookTimeSlots: function(e) {
    var node = e.currentTarget;
    console.log(node);
    //TODO: use pubsub to communicate with SwitchView
    // if (!isMouseDown || $(node).hasClass('booked')) {
    //   return false;
    // }
    //
    // if (_.isEmpty(booked)) {
    //   markBooked(node)
    // } else {
    //   var keys = _.keys(booked)
    //   var bookedDay = getDayAndHour(keys[0]).day
    //   var selectedDay = getDayAndHour(node.dataset.time).day
    //   if (selectedDay === bookedDay && !_.contains(keys, node.dataset.time) && keys.length < durationInHour) {
    //     markBooked(node)
    //   }
    // }
  },

  dispose: function(){
    this.remove();
    this.unbind();
    //TODO: unbind all events
    // this.model.unbind("change", this.modelChanged);
  },
});
