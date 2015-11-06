var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');
var config = require('../lib/config');
var template = require('../template/switch.hbs');
var TableView = require('../view/table');

module.exports = Backbone.View.extend({
  el: '#content',
  template: template,

  events: {
    'click button': 'switchTable',
  },

  initialize: function(options) {
    if (!options || !options.timeSlots) {
      throw new Error('Switch view expects time slots as options');
    }

    this.timeSlots = options.timeSlots;
    this.currOrder = 0;
    this.currTab = null;

    this.render();
    this.renderTable(this.currOrder);
  },


  switchTable: function(e) {
    var direction = e.target.className;
    if (direction === 'last' && this.currOrder > 0) {
      this.renderTable(this.currOrder - 1);
    } else if (direction === 'next' && this.currOrder < this.tableViewList.length - 1) {
      this.renderTable(this.currOrder + 1);
    }
  },

  // TODO: DRY
  render: function() {
    this.$el.html(template());

    this.tableViewList = _.chain(this.timeSlots)
      .map(function(availableByWeek, weekIndex) {
        return new TableView({
          weekIndex: weekIndex,
          availableTime: availableByWeek,
        });
      })
      .sortBy(function(view) {
        return view.weekIndex;
      })
      .value();

    return this;
  },

  renderTable: function(order) {
    this.currTab = this.tableViewList[order];
    this.currOrder = order;
    this.currTab.render();

    var start = this.currTab.period.start;
    var end = this.currTab.period.end;
    var headerMsg = moment(start).format(config.formatHeader) + ' - ' +
      moment(end).format(config.formatHeader);
    this.$('.nav-period').text(headerMsg);

    var lastBtn = this.$('.last');
    var nextBtn = this.$('.next');
    if (this.currOrder === 0) {
      lastBtn.prop('disabled', true);
    } else {
      lastBtn.prop('disabled', false);
    }

    if (this.currOrder === this.tableViewList.length -1) {
      nextBtn.prop('disabled', true);
    } else {
      nextBtn.prop('disabled', false);
    }
  },

});