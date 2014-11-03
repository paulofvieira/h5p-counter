var H5P = H5P || {};

/**
 * Countdown module
 * @external {jQuery} $ H5P.jQuery
 */
H5P.Counter = (function ($) {

  /**
   * Initialize module.
   * @param {Object} params Behavior settings
   * @param {Number} id Content identification
   * @returns {Object} C Countdown instance
   */
  function C(params, id) {
    this.$ = $(this);
    this.id = id;

    // Set default behavior.
    this.params = $.extend({}, {
      title: "Christmas countdown",
      textField: "There is only @time left until christmas!",
      countUp: false,
      minute: 0,
      hour: 0,
      day: 24,
      month: 12,
      year: 2014,
      backgroundImage: null,
      enableYears: true,
      enableMonths: true,
      enableWeeks: false,
      enableDays: true,
      enableHours: true,
      enableMinutes: true,
      enableSeconds: true,
      enableMilliseconds: false,
      enableShortFormat: false,
      finishedText: ''
    }, params);
  }

  C.prototype.attach = function ($container) {
    console.log(this);
    var self = this;
    self.$inner = $container.html('<div><div>' + self.params.title + '</div></div>').children();
    self.$countdown = $('<div></div>').appendTo(this.$inner);

    // set the date we're counting down to, or up from.
    var targetDate = new Date(this.params.year, parseInt(this.params.month)-1, this.params.day,
    this.params.hour, this.params.minute, 0, 0);

    // variables for time units
    var months, weeks, days, hours, minutes, seconds;

    if (self.params.backgroundImage && self.params.backgroundImage.path) {
      this.$image = $('<img/>', {
        'class': 'h5p-image-background',
        src: H5P.getPath(self.params.backgroundImage, self.id)
      }).css({width: self.initialWidth, height: height}).appendTo(this.$inner);
    }

    //replace variable chosenDate
    self.params.textField = self.params.textField.replace(/@chosenDate/g, targetDate.toDateString());


    // update the countdown timer every second.
    var myCounter = setInterval(updateClock, 1000);

    function updateClock() {
      // find the amount of "seconds" between now and target
      var currentDate = new Date().getTime();
      //Counting up or down.
      var secondsLeft = self.params.countUp ? (currentDate - currentDate) / 1000 :(currentDate - currentDate) / 1000;
      if (secondsLeft <= 0) {
        if (!self.params.countUp) {
          secondsLeft = 0;
        }
        clearInterval(myCounter);
        setFinishedText();
        return;
      }
      var shortFormat = '';
      var longFormat = '';

      // do some time calculations
      if (self.params.enableMonths) {
        months = parseInt(secondsLeft / 2592000);
        secondsLeft = secondsLeft % 2592000;
        longFormat += months+' Months, ';
        shortFormat += months+'m, ';
      }

      if (self.params.enableWeeks) {
        weeks = parseInt(secondsLeft / 604800);
        secondsLeft = secondsLeft % 604800;
        longFormat += weeks+' Weeks, ';
        shortFormat += weeks+'w, ';
      }

      if (self.params.enableDays) {
        days = parseInt(secondsLeft / 86400);
        secondsLeft = secondsLeft % 86400;
        longFormat += days+' Days, ';
        shortFormat += days+'d, ';
      }

      if (self.params.enableHours) {
        hours = parseInt(secondsLeft / 3600);
        secondsLeft = secondsLeft % 3600;
        longFormat += hours+' Hours, ';
        shortFormat += hours+'h, ';
      }

      if (self.params.enableMinutes) {
        minutes = parseInt(secondsLeft / 60);
        secondsLeft = secondsLeft % 60;
        longFormat += minutes+' Minutes';
        shortFormat += minutes+'m';
        if (self.params.enableSeconds) {
          longFormat += ' and ';
          shortFormat += ', ';
        }
      }

      if (self.params.enableSeconds) {
        seconds = parseInt(secondsLeft);
        longFormat += seconds+' Seconds ';
        shortFormat += seconds+'s '
      }
      var chosenFormat = self.params.enableShortFormat ? shortFormat : longFormat;
      //Replace variables in string.
      var htmlCounter = self.params.textField.replace(/@counter/g, chosenFormat)
          .replace(/@months/g, months)
          .replace(/@weeks/g, weeks)
          .replace(/@days/g, days)
          .replace(/@hours/g, hours)
          .replace(/@minutes/g, minutes)
          .replace(/@seconds/g, seconds);

      // format countdown string + set tag value
      self.$countdown.html(htmlCounter);
    }

    function calculateTimeUnit(timeUnit, secondsMultiple, shortForm, longForm) {

    }

    function setFinishedText() {
      //When countdown is done, display finished text, if it has been specified.
      if (self.params.finishedText !== '') {
        self.$countdown.html(self.params.finishedText);
      }
    }

  };

    return C;
})(H5P.jQuery);