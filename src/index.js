var _ = require('underscore');
var utils = require('./lib/utils');
var config = require('./lib/config');
var store = require('./model/store');

var CalendarModel = require('./model/calendar');
var ServiceModel = require('./model/service');
var TableView = require('./view/table');
var SwitchView = require('./view/switch');


document.addEventListener('DOMContentLoaded', init);

function init() {
  var calendarModel = new CalendarModel();
  var serviceModel = new ServiceModel();

  Promise.all([serviceModel.fetch(), calendarModel.fetch()]).then(function() {
    var duration = serviceModel.getDurationInHour();
    var groupedTimeSlots = calendarModel.groupTimeSlots();

    store.init({duration: duration});

    //SwitchView is auto-render
    var switchView = new SwitchView({timeSlots: groupedTimeSlots});
  });
}
