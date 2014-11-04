var H5P = H5P || {};

/**
 * Countdown module
 * @external {jQuery} $ H5P.jQuery
 */
H5P.Counter = (function ($) {
  // CSS Classes:
  var MAIN_CONTAINER = 'h5p-counter';
  var IMAGE_CONTAINER = 'h5p-counter-image-container';
  var COUNTDOWN_CONTAINER = 'h5p-counter-countdown-container';

  // CSS subclasses
  var IMAGE_BACKGROUND = 'h5p-counter-image-background';
  var OVER_IMAGE = 'h5p-counter-on-image';

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
      date: null,
      imageGroup: null,
      enableMonths: false,
      enableWeeks: false,
      enableDays: true,
      enableHours: true,
      enableMinutes: true,
      enableSeconds: true,
      enableShortFormat: false,
      finishedText: ''
    }, params);
  }

  C.prototype.attach = function ($container) {
    var self = this;
    self.$inner = $container.addClass(MAIN_CONTAINER)
        .html('<div><div>' + self.params.title + '</div></div>')
        .children();

    // set the date we're counting down to, or up from.
    var targetDate = new Date(self.params.date.year, parseInt(self.params.date.month)-1, self.params.date.day,
    self.params.date.hour, self.params.date.minute, 0, 0);

    // variables for time units
    var months, weeks, days, hours, minutes, seconds = 0;
    self.$imageContainer = $('<div/>', {
      'class': IMAGE_CONTAINER
    }).appendTo(self.$inner);

    self.$countdown = $('<div/>', {
      'class': COUNTDOWN_CONTAINER
    }).appendTo(self.$imageContainer);


    if (self.params.imageGroup.backgroundImage && self.params.imageGroup.backgroundImage.path) {
      attachImage();
      self.$countdown.addClass(OVER_IMAGE)
          .css({top: self.params.imageGroup.yPos + '%',
            left: self.params.imageGroup.xPos + '%'});
    }

    //replace variable chosenDate
    self.params.textField = self.params.textField.replace(/@chosenDate/g, targetDate.toDateString());

    targetDate = targetDate.getTime();
    // update the countdown timer every second.
    var myCounter = setInterval(updateClock, 1000);

    function updateClock() {
      // find the amount of "seconds" between now and target
      var currentDate = new Date().getTime();
      //Counting up or down.
      var secondsLeft = self.params.countUp ? (currentDate - targetDate) / 1000 :(targetDate - currentDate) / 1000;
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

    function setFinishedText() {
      //When countdown is done, display finished text, if it has been specified.
      if (self.params.finishedText !== '') {
        self.$countdown.html(self.params.finishedText);
      }
    }

    function attachImage() {
      self.initialWidth = $container.width();
      var height = (self.initialWidth/self.params.imageGroup.backgroundImage.width)*self.params.imageGroup.backgroundImage.height;
      this.$image = $('<img/>', {
        'class': IMAGE_BACKGROUND,
        src: H5P.getPath(self.params.imageGroup.backgroundImage.path, self.id)
      }).css({width: self.initialWidth, height: height}).appendTo(self.$imageContainer);
    }
  };

    return C;
})(H5P.jQuery);