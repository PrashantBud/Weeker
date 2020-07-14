/**
 * Weeker.js
 * A week scheduling library customized for a event management program
 * per staff basis.
 * ----------------------------------
 * Author - Prashant N, Vikesh Bhade
 * License - MIT
 */

var Utils = function () {
  var isEmpty = function (arg) {
    return arg == null || arg == "" || typeof arg == "undefined" ? true : false;
  };
  return {
    isEmpty,
  };
};

var DOMBuider = function () {
  var _toHeadings = function (headingText, level) {
    level = level > 6 ? 6 : level;
    return "<h" + level + ">" + headingText + "</h" + level + ">";
  };

  return {
    toHeadings: _toHeadings,
  };
};

var WeekerFrame = function (args = {}) {
  var shortDate = args.shortDate;
  var shortDay = args.shortDay;
  var data = args.data;
  var utils = Utils();

  console.log("[:WeekerFrame args]", args);
  var frame = "";
  var recordSet = [];

  frame += "<tr class='date_plugin_holders'><th>Staff</th>";

  for (var i = 0; i < shortDate.length; i++) {
    frame += "<th>";
    frame += "<span class='day_plaque'>" + shortDay[i] + "</span>";
    frame += "<span class='day_actual'>" + shortDate[i] + "</span>";
    frame += "</th>";
  }

  frame += "</tr>";

  console.log("[:WeekerFrame data]", data);
  console.log("[:WeekerFrame data-keys]", Object.keys(data));

  for (var record in data) {
    var recordSetItem = "<tr>";
    var staffName = data[record].name;
    recordSetItem +=
      "<td><span class='entity_staff_name'>" + staffName + "</span></td>";

    /** Date containers
     * Iterate over shortDates to form bounds.
     */
    for (var j = 0; j < shortDate.length; j++) {
      var events = !utils.isEmpty(data[record].events)
        ? data[record].events
        : false;
      var hasEvents = events;
      var eventKeys = events ? Object.keys(events) : false;

      if (!hasEvents) {
        recordSetItem += "<td></td>";
      } else {
        // console.log("[:Weeker hasEvents]");
        console.log("[:shortDate check]", shortDate[j]);
        console.log("[: eventKeys]", eventKeys);
        var isEventBound = eventKeys.indexOf(shortDate[j]) > -1 ? true : false;
        if (isEventBound) {
          // recordSetItem += "<td>Some event</td>";
          if (data[record].events[shortDate[j]].length > 0) {
            recordSetItem += "<td>";
            console.log("[:EventRow] greater than zero");
            for (var k = 0; k < data[record].events[shortDate[j]].length; k++) {
              var eventName = !utils.isEmpty(
                data[record].events[shortDate[j]][k].event_name
              )
                ? data[record].events[shortDate[j]][k].event_name
                : "Blank event";
              var eventStart = data[record].events[shortDate[j]][k].time_start;
              var eventEnd = data[record].events[shortDate[j]][k].time_end;

              recordSetItem += "<div class='date_plan_event_marker'>";
              recordSetItem += "<span class='title'>" + eventName + "</span>";
              recordSetItem +=
                "<span class='timespan'>" +
                eventStart +
                " to " +
                eventEnd +
                "</span>";
              recordSetItem += "</div>";
            }
            recordSetItem += "</td>";
          } else {
            recordSetItem += "<td></td>";
          }
        } else {
          recordSetItem += "<td></td>";
        }
      }
    }

    recordSetItem += "</tr>";
    recordSet.push(recordSetItem);
  }

  return {
    frame,
    recordSet,
  };
};

var WeekerEpochManager = function (args = {}) {
  console.log("[:WeekerEpochManager] initialized.");
  console.log("[:WeekerEpochManager-arguments]", args);
  var utils = Utils;
  var state = {};
  var data = args.data;
  var domBuilder = DOMBuider();
  var wf = WeekerFrame({
    shortDate: args.shortDate,
    shortDay: args.shortDay,
    data: data,
  });
  // var dom = domBuilder.toHeadings(data, 1);
  var wFrame = wf.frame;
  var wRecordSets = wf.recordSet.join("");

  return {
    wFrame,
    wRecordSets,
  };
};

var Weeker = function (args = {}) {
  var utils = Utils();
  var state = {};
  var WEM = null;

  if (!utils.isEmpty(args["mountOn"])) {
    state.mountOn = args.mountOn;
    // WEM = WeekerEpochManager()
  }

  var getState = function () {
    return state;
  };

  var render = function () {
    var domData = "";

    domData = "<table class='weeker' cellspacing=0>";
    domData += WEM.wFrame;
    domData += WEM.wRecordSets;
    domData += "</table>";

    $(state.mountOn).html(domData);
  };

  var initDate = function () {
    var startOfWeek = moment().startOf("isoWeek");
    var endOfWeek = moment().endOf("isoWeek");

    var days = [];
    var shortDates = [];
    var shortDays = [];
    var day = startOfWeek;

    while (day <= endOfWeek) {
      shortDates.push(moment(day).format("YYYY-MM-DD"));
      shortDays.push(moment(day).format("dddd"));
      days.push(day.toDate());
      day = day.clone().add(1, "d");
    }
    state.weekerDays = days;
    state.shortDates = shortDates;
    state.shortDays = shortDays;

    return Promise.resolve(state);
  };

  if (!utils.isEmpty(args["data"])) {
    initDate();
    console.log("[ShortDate]", state.shortDates);
    console.log("[ShortDay]", state.shortDays);
    var data = args.data;
    WEM = WeekerEpochManager({
      data,
      shortDate: state.shortDates,
      shortDay: state.shortDays,
    });
  }

  var init = function () {
    console.log("[Weeker initialized]");
    // initDate();
    // render();
  };

  // init();

  return {
    getState,
    render,
  };
};
