//Using store pattern to manage shared states
var $ = require('jquery');
var _ = require('underscore');

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

  setMouseDown: function(force) {
    isMouseDown = force;
  },

  isMouseDown: function() {
    return isMouseDown;
  },

  getBooked: function() {
    return _.clone(booked);
  },

  addBooked: function(node) {
    booked[node.dataset.time] = node;
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
      return false;
    } else {
      return _.keys(booked).sort();
    }
  },
};
