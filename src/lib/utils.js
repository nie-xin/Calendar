var moment = require('moment');

module.exports = {
  getStartOf: function(date, unit, format) {
    unit = unit || 'w';
    return moment(date).startOf(unit).format(format);
  },

  getEndOf: function(date, unit, format) {
    unit = unit || 'w';
    return moment(date).endOf(unit).format(format);
  },

  getRangeOf: function(start, end, unit, format) {
    unit = unit || 'days';
    var range = [];

    var currDate = moment(start).clone();
    var lastDate = moment(end).clone();

    while (currDate.diff(lastDate, unit) < 0) {
      range.push(currDate.clone().format(format));
      currDate.add(1, unit);
    }

    if (unit === 'hours') {
      lastDate.subtract(59, 's');
      lastDate.subtract(59, 'm');
    }

    if (unit === 'weeks') {
      range.push(currDate.format(format));
    } else {
      range.push(lastDate.format(format));
    }

    return range;
  },

  splitDate: function(date, separator) {
    separator = separator || ' ';
    var splitted = date.split(separator);
    return {
      pre: splitted[0],
      suf: splitted[1],
    };
  },
};
