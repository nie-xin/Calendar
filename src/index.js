var _ = require('underscore');
var utils = require('./lib/utils');
var config = require('./lib/config');


var CalendarModel = require('./model/calendar');
var ServiceModel = require('./model/service');
// var TableView = require('./view/table');
// var SwitchView = require('./view/swith');

var calendarModel = new CalendarModel();
var serviceModel = new ServiceModel();

Promise.all([serviceModel.fetch(), calendarModel.fetch()]).then(function() {
  var duration = serviceModel.getDurationInHour();
  var from = calendarModel.get('from_date');
  var to = calendarModel.get('to_date');

  var startOfWeek = utils.getStartOf(from);
  var endOfWeek = utils.getEndOf(to);
  // console.log(startOfWeek + ' - ' + endOfWeek);
  // var weekRange = utils.getRangeOf(startOfWeek, endOfWeek, )

  var groupedTimeSlots = calendarModel.groupTimeSlots();
  var tableList = _.map(groupedTimeSlots, function(availableByWeek, index) {
    // return new TableView({
    //   availableTime: availableByWeek,
    // });
  });

  // var swithView = new SwitchView(tableList);
  // swithView.render();
});
