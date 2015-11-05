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

    range.push(lastDate.format(format));
    return range;
  },
};
