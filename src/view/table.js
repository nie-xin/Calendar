var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');
var $ = require('jquery');
var utils = require('../lib/utils');
var config = require('../lib/config');
var template = require('../template/table.hbs');
var store = require('../model/store');

module.exports = Backbone.View.extend({
  el: '.table',
  template: template,

  events: {
    'mousedown': 'toggleMouseDown',
    'mouseup': 'toggleMouseDown',
  },

  initialize: function(options) {
    this.weekIndex = options.weekIndex;
    this.availableTime = options.availableTime;
    this.period = this.getTimeByIndex(this.weekIndex);
    var timeTable = this.getWeeklyTimeTable(this.period.start, this.period.end, this.availableTime);
    this.model = timeTable;
  },

  toggleMouseDown: function(e) {
    if (e.type === 'mousedown') {
      store.setMouseDown(true);
      store.resetBooked();
    } else {
      store.setMouseDown(false);
      var validation = store.validateBooked();
      this.updateMessage(validation);
    }
  },

  updateMessage: function(validation) {
    if (!validation) {
      $('.validated').text('Service booked: ');
      return false;
    }

    var from = utils.splitDate(_.first(validation));
    var to = moment(_.last(validation)).add(1, 'hour').format(config.formatHour);
    to = utils.splitDate(to);

    var msg = from.pre + ', ' + from.suf + ' - ' + to.suf;
    $('.validated').text('Service booked: ' + msg);
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
      slot.addEventListener('mouseover', this.bookTimeSlots.bind(this));
    }, this);
  },

  markBooked: function(node) {
    store.addBooked(node);
    $(node).addClass('booked');
  },

  bookTimeSlots: function(e) {
    var node = e.currentTarget;

    if (!store.isMouseDown() || $(node).hasClass('booked')) {
      return false;
    }

    this.validateSelection(node);
  },

  /**
   * Validation rules:
   * - selections are in same day
   * - selctions are consecutive hours
   * - no duplicates
   * - duration equals to service duration (4h in this case)
   */
  validateSelection: function(node) {
    var booked = store.getBooked();

    if (_.isEmpty(booked)) {
      this.markBooked(node);
    } else {
      var bookedTime = _.keys(booked);
      var bookedDay = utils.splitDate(bookedTime[0]).pre;
      var selectedTime = utils.splitDate(node.dataset.time);
      var selectedDay = selectedTime.pre;

      if (selectedDay === bookedDay &&
          !_.contains(bookedTime, node.dataset.time) &&
          bookedTime.length < store.duration &&
          this.isConsecutiveHour(node, booked)) {
        this.markBooked(node);
      }
    }
  },

  isConsecutiveHour: function(selected, booked) {
    var bookedTime = _.keys(booked);
    var bookedHours = bookedTime.map(function(time) {
      return Number(utils.splitDate(time).suf.split(':')[0]);
    });
    var minHour = _.min(bookedHours);
    var maxHour = _.max(bookedHours);

    var selectedTime = utils.splitDate(selected.dataset.time);
    var selectedHour = Number(selectedTime.suf.split(':')[0]);

    if (selectedHour === minHour -1 || selectedHour === maxHour + 1) {
      return true;
    } else {
      return false;
    }
  },
});
