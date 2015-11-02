var CalendarModel = require('./model/calendar');
var CalendarView = require('./view/calendar');

var calendarModel = new CalendarModel();
calendarModel.fetch().then(function() {
  var from = calendarModel.get('from_date');
  var to = calendarModel.get('to_date');
  var groupedTimeSlots = calendarModel.groupTimeSlots();

  var calendarView = new CalendarView({
    from: from,
    to: to,
    timeSlots: groupedTimeSlots,
  });
  calendarView.render();
});
