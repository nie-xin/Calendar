var _ = require('underscore');
var utils = require('./lib/utils');
var config = require('./lib/config');

var CalendarModel = require('./model/calendar');
var ServiceModel = require('./model/service');

var TableView = require('./view/table');

// var SwitchView = require('./view/swith');


document.addEventListener('DOMContentLoaded', init);

function init() {
  var calendarModel = new CalendarModel();
  var serviceModel = new ServiceModel();

  Promise.all([serviceModel.fetch(), calendarModel.fetch()]).then(function() {
    var duration = serviceModel.getDurationInHour();
    var groupedTimeSlots = calendarModel.groupTimeSlots();

    var tableViewList = _.chain(groupedTimeSlots)
      .map(function(availableByWeek, weekIndex) {
        return new TableView({
          weekIndex: weekIndex,
          availableTime: availableByWeek,
          duration: duration,
        });
      })
      .sortBy(function(view) {
        return view.weekIndex;
      })
      .value();

    // test table rendering of first week
    console.log(tableViewList[0]);
    tableViewList[0].render();

    // var swithView = new SwitchView(tableViewList);
    // swithView.render();
  });
}
