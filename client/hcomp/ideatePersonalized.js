// Configure logger for Tools
var logger = new Logger('Client:IdeatePersonal');
// Comment out to use global logging level
Logger.setLevel('Client:IdeatePersonal', 'trace');
// Logger.setLevel('Client:IdeatePersonal', 'debug');
// Logger.setLevel('Client:IdeatePersonal', 'info');
// Logger.setLevel('Client:IdeatePersonal', 'warn');

var numMatches = 3;
var stuckTimeOut;

Template.IdeaEntry.onRendered(function(){

  spell = BJSpell("dictionary.js/en_US.js");

  Session.set("misspelledThemes", []);
  Session.set("numMisspelledThemes", 0);

  Session.set("misspelledProps", []);
  Session.set("numMisspelledProps", 0);

  var timer = new Tock({
      callback: function () {
          $('#clockface').text(timer.msToTime(timer.lap()));
      }
  });

  var countdown = Tock({
      countdown: true,
      interval: 1000,
      callback: function () {
          // logger.debug(countdown.lap() / 1000);
          // var currentTime = moment(timer.lap());
          // logger.trace(currentTime);
          // console.log(currentTime.getSeconds())
          var remaining = timer.msToTime(countdown.lap())
          remaining = remaining.slice(0,-4)
          $('#countdown_clock').text(remaining);
          // $('#countdown_clock').text(timer.msToTime(countdown.lap()));
      },
      complete: function () {
          // console.log('end');
          alert("Time's up!");
          
          logger.info("Exitting current page");
          
          Router.go("SurveyPage", {
                'partID': Session.get("currentParticipant")._id
              });
      }
  });

  initTimer();

  // disable idea submission during tutorial
  $(".idea-entry input").prop("disabled", true);
  $(".idea-entry textArea").prop("disabled", true);
  $(".submit-idea").prop("disabled", true);

  var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
  // Instance the tour
  var pInspTour = new Tour({
    template: "<div class='popover tour'>" +
        "<div class='arrow'></div>" +
        "<h3 class='popover-title'></h3>" +
        "<div class='popover-content'></div>" +
        "<div class='popover-navigation'>" +
            "<button class='btn btn-default' data-role='prev'>« Prev</button>" +
            "<button class='btn btn-default' data-role='next'>Next »</button>" +
        "</div>" +
      "</div>",
    steps: [
    {
      element: "#p-insp-prompt",
      title: "Instructions tutorial (Step 1 of 7)" + spacer,
      content: "In the next " + Session.get("currentPrompt").length + " minutes, please brainstorm as many creative ideas for a themed wedding as you can.", 
      backdrop: true,
      placement: "bottom",
      onNext: function() {
        EventLogger.logTutorialStarted();
      }
    },
    {
      element: "#p-insp-idea-entry",
      title: "Instructions tutorial (Step 2 of 7)" + spacer,
      content: "Enter your ideas using this template. The system will automatically notify you if you misspell a theme/prop. " +
      "If possible, please correct misspellings before submitting your ideas: this will help the system function smoothly.",
      backdrop: true,
      onNext: function() {
        addTutorialInsp();
      }
    },
    {
      element: "#p-insp-insp-container",
      title: "Instructions tutorial (Step 3 of 7)" + spacer,
      content: "To boost your creativity, the system will automatically show you a carefully selected set of themes and props that others have generated. " +
      "This inspiration feed will refresh every time you submit a new idea. ",  
      backdrop: true,
      placement: "bottom",
      // onNext: function() {
      //   removeTutorialInsp();
      // },
      onPrev: function() {
        removeTutorialInsp();
      },
    },
    {
      element: "#insp-tutorialInsp",
      title: "Instructions tutorial (Step 4 of 7)" + spacer,
      content: "Feel free to use the suggested themes/props as inspiration. It's ok to generate ideas similar to those themes/props. " +
      "If a theme/prop helps you generate a new idea, please let us know by clicking on the star icon next to it! ",
      placement: "bottom",
      backdrop: true,
      onNext: function() {
        removeTutorialInsp();
      }
    },
    {
      element: ".stuck-button",
      title: "Instructions tutorial (Step 5 of 7)" + spacer,
      content: "If you feel like you are stuck or running low on ideas, click on this button to receive another set of inspirations. " +
      "You may do this as often as you feel the need to (i.e., you will not be evaluated on how often you do this).",
      backdrop: true,
      placement: "bottom",
      onPrev: function() {
        addTutorialInsp();
      }
    },
    {
      element: "#nav-right",
      title: "Instructions tutorial (Step 6 of 7)" + spacer,
      content: "The time remaining will be shown in the top right corner of the page. " +
        "When your time is up, you will automatically be taken to a brief survey page, and then your completion code.",
        // backdrop: true,
      placement: "bottom",
    }],
    onEnd: function(tour) {
      $(".idea-entry input").prop("disabled", false);
      $(".idea-entry textArea").prop("disabled", false);
      $(".submit-idea").prop("disabled", false);
      var promptLength = Session.get("currentPrompt").length*60000;
      countdown.start(promptLength);
      EventLogger.logTutorialComplete();
      EventLogger.logBeginIdeation();
    },
  });

  pInspTour.addStep({
    element: "#nav-right",
    title: "Instructions tutorial (Step 7 of 7)" + spacer,
    content: "You may exit the study at any time by clicking on the \"Exit Early\" button. " +
      "Your compensation will be pro-rated based on how long you participated. " +
      "When you are ready, click \"Begin!\", and the timer will start. Good luck!",
      // backdrop: true,
      placement: "bottom",
      template: "<div class='popover tour'>" +
        "<div class='arrow'></div>" +
        "<h3 class='popover-title'></h3>" +
        "<div class='popover-content'></div>" +
        "<div class='popover-navigation'>" +
            "<button class='btn btn-default' data-role='prev'>« Prev</button>" +
            "<button class='btn btn-default' data-role='end'>Begin!</button>" +
        "</div>" +
      "</div>",
  })

  // Initialize the tour
  logger.debug("Initializing tutorial");
  pInspTour.init();

  // Start the tour
  logger.debug("Starting tutorial");
  pInspTour.start();

  if(pInspTour.ended()) {
    pInspTour.restart();
  }

});

Template.IdeaEntry.helpers({
  isStuck: function() {
    return Session.equals("cogState", "stuck");
  },
  anyMisSpellings: function() {
    if (Session.equals("numMisspelledThemes", 0) && Session.equals("numMisspelledProps", 0)) {
      return false;
    } else {
      return true;
    }
  },
  anyMisSpelledTheme: function() {
    if (Session.equals("numMisspelledThemes", 0)) {
      return false;
    } else {
      return true;
    }
  },
  anyMisSpelledProp: function() {
    if (Session.equals("numMisspelledProps", 0)) {
      return false;
    } else {
      return true;
    }
  },
  misspelledThemes: function() {
    var misSpellings = Session.get("misspelledThemes");
    var msg = "";
    if (misSpellings) {
      if (misSpellings.length > 1) {
        msg = " any of these: ";
        msg += misSpellings.join(", ");
      } else {
        msg = misSpellings[0];
      }
    }
    return msg;
  },
  misspelledProps: function() {
    var misSpellings = Session.get("misspelledProps");
    var msg = "";
    if (misSpellings) {
      if (misSpellings.length > 1) {
        msg = " any of these: ";
        msg += misSpellings.join(", ");
      } else {
        msg = misSpellings[0];
      }
    }
    return msg;
  },
});

Template.IdeaEntry.events({
  'change input[id="idea-theme"]': function() {
    logger.debug("Changed input in idea theme box");
    var misSpelled = [];
    if ($("#idea-theme").val() != "") {
      var words = $("#idea-theme").val().split(" ");
      words.forEach(function(w) {
        if (!spell.check(w)) {
          misSpelled.push(w)
        }
      });
    }
    Session.set("misspelledThemes", misSpelled);
    Session.set("numMisspelledThemes", misSpelled.length);
    if (misSpelled.length < 1) {
      logger.debug("No misspelled themes!");
      // Session.set("misspelledThemes", []);
    } else {
      logger.trace("Possibly misspelled themes: " + JSON.stringify(misSpelled));
    }
  },

  'change input[id="idea-prop"]': function() {
    logger.debug("Changed input in idea prop box");
    var misSpelled = [];
    if ($("#idea-theme").val() != "") {
      var words = $("#idea-prop").val().split(" ");
      words.forEach(function(w) {
        if (!spell.check(w)) {
          misSpelled.push(w)
        }
      });
    } 
    Session.set("misspelledProps", misSpelled);
    Session.set("numMisspelledProps", misSpelled.length);
    if (misSpelled.length < 1) {
      logger.debug("No misspelled props!");
    } else {
      logger.trace("Possibly misspelled props: " + JSON.stringify(misSpelled));
    }
  },

  'click .submit-idea': function (e, target) {
    //console.log("event submitted");
    logger.debug("submitting a new idea");
    var theme = $("#idea-theme").val();
    var prop = $("#idea-prop").val();
    var description = $("#idea-description").val();
    //Add idea to database
    var idea = IdeaFactory.createWedding(theme, prop, description, 
        Session.get("currentUser"),
        Session.get("currentPrompt")
    );
    if (idea) {
      Session.set("lastIdea", idea); 
      var user = Session.get("currentUser");

    // Clear the text field
      $("#idea-theme").val("");
      $("#idea-prop").val("");
      $("#idea-description").val("");

      Session.set("misspelledThemes", []);
      Session.set("numMisspelledThemes", 0);

      Session.set("misspelledProps", []);
      Session.set("numMisspelledProps", 0);

      logger.trace("Theme: " + theme + ", Prop: " + prop);
      var lastInsps;
      if (Session.equals("cogState", "stuck")) {
        lastInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
      } else {
        lastInsps = {"themes": FilterManager.performQuery("rollThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("rollProps", user, "weddingInspirations").fetch()}
      }
      EventLogger.logWeddingSubmission(idea, lastInsps);
      WeddingInspManager.retrieveInsp("rollThemes", theme, "weddingTheme", numMatches);
      WeddingInspManager.retrieveInsp("rollProps", prop, "weddingProp", numMatches);
      // updateInspFilter("rollThemes");
      // updateInspFilter("rollProps");

      if (Session.equals("cogState", "stuck")) {
        // Meteor.clearTimeout(stuckTimeOut);
        Session.set("cogState", "onRoll");
        EventLogger.logChangeCogState("stuck", "onRoll");
        // $('input[type=checkbox]').val("1");
        // $("#roll-insps-container").css('-webkit-animation-name', 'rollGlow'); /* Chrome, Safari, Opera */
        // $("#roll-insps-container").css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
      }
      var newInsps = {"themes": FilterManager.performQuery("rollThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("rollProps", user, "weddingInspirations").fetch()}
      EventLogger.logInspirationRefresh(lastInsps, newInsps, "New idea submission");
    } else {
      alert("Make sure all fields are filled out before submitting!");
    }
  },
});

Template.IdeaList.helpers({
  weddingIdeas: function() {
    return Ideas.find({promptID: Session.get("currentPrompt")._id, 
                       userID: Session.get("currentUser")._id, 
                       isWedding: true}, {sort: {time: -1}})
  },
  numIdeas: function() {
    return Ideas.find({promptID: Session.get("currentPrompt")._id, 
                       userID: Session.get("currentUser")._id, 
                       isWedding: true}).count();
  }
});

Template.Inspiration.onRendered(function () {
  initInspirationFilter("rollThemes");
  initInspirationFilter("rollProps");
  initInspirationFilter("stuckThemes");
  initInspirationFilter("stuckProps");
  Session.set("cogState", "onRoll");

});

Template.Inspiration.helpers({
  inspRollThemes: function() {
    // var rollThemes = Session.get("rollThemes");
    // updateInspFilter(rollThemes, "rollThemes");
    return FilterManager.performQuery("rollThemes", Session.get("currentUser"), "weddingInspirations");
  },
  inspRollProps: function() {
    // var rollProps = Session.get("rollProps");
    // updateInspFilter(rollProps, "rollProps");
    return FilterManager.performQuery("rollProps", Session.get("currentUser"), "weddingInspirations");
  },
  inspStuckThemes: function() {
    // var stuckThemes = Session.get("stuckThemes");
    // updateInspFilter(stuckThemes, "stuckThemes");
    return FilterManager.performQuery("stuckThemes", Session.get("currentUser"), "weddingInspirations");
  },
  inspStuckProps: function() {
    // var stuckProps = Session.get("stuckProps");
    // updateInspFilter(stuckProps, "stuckProps");
    return FilterManager.performQuery("stuckProps", Session.get("currentUser"), "weddingInspirations");
  },
  isStuck: function() {
    return Session.equals("cogState", "stuck");
  }
});

Template.Inspiration.events({
  'click .roll-button': function() {
    logger.debug("Clicked on a roll");
    Session.set("cogState", "onRoll");
  },
  'click .stuck-button': function(e, target) {
    logger.debug("Clicked stuck button");
    var user = Session.get("currentUser");
    if (Session.equals("cogState", "onRoll")) {
      logger.debug("Switching from onRoll to stuck");
      var lastIdea = Session.get("lastIdea");
      var lastInsps = {"themes": FilterManager.performQuery("rollThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("rollProps", user, "weddingInspirations").fetch()}
      logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
      WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
      WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
      Session.set("cogState", "stuck");  
      EventLogger.logChangeCogState("onRoll", "stuck");
      var newInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
      EventLogger.logInspirationRefresh(lastInsps, newInsps, "Switch from onRoll to stuck");
    } else {
      logger.debug("Already stuck, refreshing stuck inspirations");
      var lastInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
      updateInspFilter("stuckThemes");
      updateInspFilter("stuckProps");
      var newInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                        "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
      EventLogger.logInspirationRefresh(lastInsps, newInsps, "Click stuck button again");
    }
  },
  'click #insp-star-insp-tutorialInsp': function() {
    var selector = "#insp-star-insp-tutorialInsp";
    logger.trace("User starred inspiration with id: " + this.previous_id);
    if ($(selector).hasClass("insp-star-empty")) {
      $(selector).removeClass("insp-star-empty");
      $(selector).removeClass("glyphicon-star-empty");
      $(selector).addClass("insp-star");
      $(selector).addClass("glyphicon-star");
    } else {
      $(selector).removeClass("insp-star");
      $(selector).removeClass("glyphicon-star");
      $(selector).addClass("insp-star-empty");
      $(selector).addClass("glyphicon-star-empty");
    }
  },
});

Template.WeddingInspiration.events({
  'click .insp-star-empty': function() {
    var selector = "#insp-star-" + this.previous_id;
    logger.trace("User starred inspiration with id: " + this.previous_id);
    $(selector).removeClass("insp-star-empty");
    $(selector).removeClass("glyphicon-star-empty");
    $(selector).addClass("insp-star");
    $(selector).addClass("glyphicon-star");
    EventLogger.logStarInspiration(this);
  },
  'click .insp-star': function() {
    var selector = "#insp-star-" + this.previous_id;
    logger.trace("User unstarred inspiration with id: " + this.previous_id);
    $(selector).removeClass("insp-star");
    $(selector).removeClass("glyphicon-star");
    $(selector).addClass("insp-star-empty");
    $(selector).addClass("glyphicon-star-empty");
    EventLogger.logUnStarInspiration(this);
  },
});

var initInspirationFilter = function(filterName) {
  if(Filters.find({name: filterName, user: Session.get("currentUser")._id}).count() == 0) {
    FilterManager.create(filterName, Session.get("currentUser"), 
      "weddingInspirations", "previous_id", "NonsenseID");
  }
}

var updateInspFilter = function(filterName) {
  var insps = Session.get(filterName);
  // logger.trace("Inspirations: " + JSON.stringify(insps));
  var samples = []
  while (samples.length < numMatches) {
    var sample = getRandomElement(insps);
    if (!isInList(sample, samples)) {
      samples.push(sample);  
    }
  }
  // for (i=0; i<numMatches; i++) {
  //   var sample = getRandomElement(insps);
  //   samples.push(sample);
  // }
  // var slicedData = insps.slice(0,numMatches);
  // var matches = [];
  FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
  samples.forEach(function(sample) {
      // matches.push(WeddingInspirations.findOne({previous_id: sample}));
      FilterManager.create(filterName, Session.get("currentUser"), 
        "weddingInspirations", "previous_id", sample.id);
  });
  logger.trace(samples.length + " matches with average similarity: " + WeddingInspManager.averageSim(samples));
  logger.trace("New matches are: " + JSON.stringify(samples));
}

var initTimer = function() {
  var prompt = Session.get("currentPrompt");
  if ($('.timer').length == 0 && prompt.length > 0) {
    logger.info("using a timer");
    // Session.set("hasTimer",true);
    Blaze.render(Template.TockTimer, $('#nav-right')[0]);
    if (prompt.length > 9) {
      $("#countdown_clock").html(prompt.length + ":00");
    } else {
      $("#countdown_clock").html("0" + prompt.length + ":00");
    }
    // var promptLength = prompt.length*60000;
    // countdown.start(promptLength);
  } else if (prompt.length > 0) {
    // var promptLength = prompt.length*60000;
    // countdown.start(promptLength);
  }
}

var addTutorialInsp = function() {
  var template = "<li id=\"insp-tutorialInsp\" class=\"wedding-insp-item\">" +
  "Example inspiration &nbsp;&nbsp;&nbsp;" +
  "<span id=\"insp-star-insp-tutorialInsp\" class=\"insp-star-empty glyphicon glyphicon-star-empty\"></span></li>"
  $("#roll-insps-themes").append(template);
}

var removeTutorialInsp = function() {
  $("#insp-tutorialInsp").remove();
}