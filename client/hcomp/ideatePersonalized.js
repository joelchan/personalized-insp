// Configure logger for Tools
var logger = new Logger('Client:IdeatePersonal');
// Comment out to use global logging level
Logger.setLevel('Client:IdeatePersonal', 'trace');
// Logger.setLevel('Client:IdeatePersonal', 'debug');
// Logger.setLevel('Client:IdeatePersonal', 'info');
// Logger.setLevel('Client:IdeatePersonal', 'warn');

var numMatches = 3;
var stuckTimeOut;
var timerTheme;
var timerProp;
var timerDescription;

var eraNames = { '20s': 'twenties',
                 '30s': 'thirties',
                 '40s': 'forties',
                 '50s': 'fifties',
                 '60s': 'sixties',
                 '70s': 'seventies',
                 '80s': 'eighties',
                 '90s': 'nineties',
                 "20's": 'twenties',
                 "30's": 'thirties',
                 "40's": 'forties',
                 "50's": 'fifties',
                 "60's": 'sixties',
                 "70's": 'seventies',
                 "80's": 'eighties',
                 "90's": 'nineties',
                 '1920s': 'twenties',
                 '1930s': 'thirties',
                 '1940s': 'forties',
                 '1950s': 'fifties',
                 '1960s': 'sixties',
                 '1970s': 'seventies',
                 '1980s': 'eighties',
                 '1990s': 'nineties',
                 "1920's": 'twenties',
                 "1930's": 'thirties',
                 "1940's": 'forties',
                 "1950's": 'fifties',
                 "1960's": 'sixties',
                 "1970's": 'seventies',
                 "1980's": 'eighties',
                 "1990's": 'nineties',
                 }

Template.MTurkIdeationPersonalized.helpers({
  useInspirations: function() {
    return Session.equals("useInspirations", true);
  }
});

Template.IdeaEntry.onRendered(function(){

  var part = Session.get("currentParticipant");
  var cond = Conditions.findOne({_id: part.conditionID});
  if (cond.description == "Far-Near") {
    Session.set("rollDistance", "different");
    Session.set("stuckDistance", "similar");
    Session.set("useInspirations", true);
  } else if (cond.description == "Far-Far") {
    Session.set("rollDistance", "different");
    Session.set("stuckDistance", "different");
    Session.set("useInspirations", true);
  } else if (cond.description == "Near-Near") {
    Session.set("rollDistance", "similar");
    Session.set("stuckDistance", "similar");
    Session.set("useInspirations", true);
  } else if (cond.description == "Near-Far") {
    Session.set("rollDistance", "similar");
    Session.set("stuckDistance", "different");
    Session.set("useInspirations", true);
  } else {
    Session.set("useInspirations", false);
  }

  var lastIdeas = Ideas.find({promptID: Session.get("currentPrompt")._id, 
                       userID: Session.get("currentUser")._id, 
                       isWedding: true}, {sort: {time: -1}}).fetch();
  if (lastIdeas.length > 0) {
    Session.set("lastIdea", lastIdeas[0]);
  }

  spell = BJSpell("dictionary.js/en_US.js");

  Session.set("misspelledThemes", []);
  Session.set("numMisspelledThemes", 0);

  Session.set("misspelledProps", []);
  Session.set("numMisspelledProps", 0);

  Session.set("isTypingTheme", false);
  Session.set("isTypingProp", false);
  Session.set("isTypingDescr", false);

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
          alert("Your time is up! When you hit OK, we will automatically take you to the final page, which includes a post-task survey.");
          
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
  var pInspTour;
  if (Session.equals("useInspirations", true)) {
    initInspirationFilter("rollThemes");
    initInspirationFilter("rollProps");
    initInspirationFilter("stuckThemes");
    initInspirationFilter("stuckProps");
    pInspTour = new Tour({
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
        element: "#lpheader",
        title: "Instructions tutorial (Step 1 of 8)" + spacer,
        content: "Welcome! Before you begin, please follow this brief 8-step tutorial to familiarize you with the interface.",
        backdrop: true,
        placement: "bottom",
        // orphan: true,
        onNext: function() {
          EventLogger.logTutorialStarted();
        }
      },
      {
        element: "#p-insp-prompt",
        title: "Instructions tutorial (Step 2 of 8)" + spacer,
        content: "In the next " + Session.get("currentPrompt").length + " minutes, please brainstorm as many creative ideas for a themed wedding as you can.", 
        backdrop: true,
        placement: "bottom",
      },
      {
        element: "#p-insp-idea-entry",
        title: "Instructions tutorial (Step 3 of 8)" + spacer,
        content: "Enter your ideas using this template. The system will automatically notify you if you misspell a theme/prop. " +
        "If possible, please correct misspellings before submitting your ideas: this will help the system function smoothly.",
        backdrop: true,
        onNext: function() {
          addTutorialInsp();
        }
      },
      {
        element: "#p-insp-insp-container",
        title: "Instructions tutorial (Step 4 of 8)" + spacer,
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
        title: "Instructions tutorial (Step 5 of 8)" + spacer,
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
        title: "Instructions tutorial (Step 6 of 8)" + spacer,
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
        title: "Instructions tutorial (Step 7 of 8)" + spacer,
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
      title: "Instructions tutorial (Step 8 of 8)" + spacer,
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
  } else {
    pInspTour = new Tour({
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
        element: "#lpheader",
        title: "Instructions tutorial (Step 1 of 5)" + spacer,
        content: "Welcome! Before you begin, please follow this brief 5-step tutorial to familiarize you with the interface.",
        backdrop: true,
        placement: "bottom",
        // orphan: true,
        onNext: function() {
          EventLogger.logTutorialStarted();
        }
      },
      {
        element: "#p-insp-prompt",
        title: "Instructions tutorial (Step 2 of 5)" + spacer,
        content: "In the next " + Session.get("currentPrompt").length + " minutes, please brainstorm as many creative ideas for a themed wedding as you can.", 
        backdrop: true,
        placement: "bottom",
      },
      {
        element: "#p-insp-idea-entry",
        title: "Instructions tutorial (Step 3 of 5)" + spacer,
        content: "Enter your ideas using this template. The system will automatically notify you if you misspell a theme/prop. " +
        "If possible, please correct misspellings before submitting your ideas: this will help the system function smoothly.",
        backdrop: true,
        onNext: function() {
          // addTutorialInsp();
        }
      },
      {
        element: "#nav-right",
        title: "Instructions tutorial (Step 4 of 5)" + spacer,
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
      title: "Instructions tutorial (Step 5 of 5)" + spacer,
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
  }
  

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
        if (!spell.check(w) && !eraNames.hasOwnProperty(w)) {
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
      EventLogger.logMisspelling(misSpelled, "themes");
      logger.trace("Possibly misspelled themes: " + JSON.stringify(misSpelled));
    }
  },

  'change input[id="idea-prop"]': function() {
    logger.debug("Changed input in idea prop box");
    var misSpelled = [];
    if ($("#idea-theme").val() != "") {
      var words = $("#idea-prop").val().split(" ");
      words.forEach(function(w) {
        if (!spell.check(w) && !eraNames.hasOwnProperty(w)) {
          misSpelled.push(w)
        }
      });
    } 
    Session.set("misspelledProps", misSpelled);
    Session.set("numMisspelledProps", misSpelled.length);
    if (misSpelled.length < 1) {
      logger.debug("No misspelled props!");
    } else {
      EventLogger.logMisspelling(misSpelled, "props");
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
      if (Session.equals("useInspirations", true)) {
        EventLogger.logWeddingSubmission(idea, lastInsps);
        // replace eranames
        theme = replaceEraNames(theme);
        prop = replaceEraNames(prop);
        WeddingInspManager.getSimSet("rollThemes", theme, "weddingTheme", numMatches, 
                                              "New idea submission", Session.get("rollDistance"), prop);
        WeddingInspManager.getSimSet("rollProps", prop, "weddingProp", numMatches, 
                                      "New idea submission", Session.get("rollDistance"), theme);
        // if (anyCorrect(theme)) {
        //   WeddingInspManager.retrieveInsp("rollThemes", theme, "weddingTheme", numMatches, 
        //                                         "New idea submission", Session.get("rollDistance"));
        // } else {
        //   logger.trace("No valid words in theme; retrieiving prop inspirations based on prop");
        //   WeddingInspManager.retrieveInsp("rollThemes", prop, "weddingTheme", numMatches, 
        //                                         "New idea submission", Session.get("rollDistance"));
        // }
        // if (anyCorrect(prop)) {
        //   WeddingInspManager.retrieveInsp("rollProps", prop, "weddingProp", numMatches, 
        //                                 "New idea submission", Session.get("rollDistance"));  
        // } else {
        //   logger.trace("No valid words in prop; retrieiving prop inspirations based on theme");
        //   WeddingInspManager.retrieveInsp("rollProps", theme, "weddingProp", numMatches, 
        //                                           "New idea submission", Session.get("rollDistance"));  
        // }
        
        
      } else {
        EventLogger.logWeddingSubmission(idea);
      }
      // updateInspFilter("rollThemes");
      // updateInspFilter("rollProps");

      if (Session.equals("cogState", "stuck")) {
        // Meteor.clearTimeout(stuckTimeOut);
        Session.set("cogState", "onRoll");
        $('#stuck-insps-container').hide();
        $('#roll-insps-container').show();
        EventLogger.logChangeCogState("stuck", "onRoll");
        // $('input[type=checkbox]').val("1");
        // $("#roll-insps-container").css('-webkit-animation-name', 'rollGlow'); /* Chrome, Safari, Opera */
        // $("#roll-insps-container").css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
      }
      // var newInsps = {"themes": FilterManager.performQuery("rollThemes", user, "weddingInspirations").fetch(),
                        // "props": FilterManager.performQuery("rollProps", user, "weddingInspirations").fetch()}
      // EventLogger.logInspirationRefresh(lastInsps, newInsps, "New idea submission");
    } else {
      alert("Make sure all fields are filled out before submitting!");
    }
  },
  'keyup input[id="idea-theme"]': function(e, target) {
    Meteor.clearTimeout(timerTheme);
    if (Session.equals("isTypingTheme", false)) {
      EventLogger.logStartTyping(e.currentTarget.id);
      Session.set("isTypingTheme", true);  
    }
    timerTheme = Meteor.setTimeout(function(){
        EventLogger.logStopTyping(e.currentTarget.id);
        Session.set("isTypingTheme", false);
    }, 5000);
    // console.log("input keyup at " + target.firstNode.id);
  },
  'keyup input[id="idea-prop"]': function(e, target) {
    Meteor.clearTimeout(timerProp);
    if (Session.equals("isTypingProp", false)) {
      EventLogger.logStartTyping(e.currentTarget.id);
      Session.set("isTypingProp", true);  
    }
    timerProp = Meteor.setTimeout(function(){
        EventLogger.logStopTyping(e.currentTarget.id);
        Session.set("isTypingProp", false);
    }, 5000);
    // console.log("input keyup at " + target.firstNode.id);
  },
  'keyup textarea': function(e, target) {
    Meteor.clearTimeout(timerDescription);
    if (Session.equals("isTypingDescr", false)) {
      EventLogger.logStartTyping(e.currentTarget.id);
      Session.set("isTypingDescr", true);  
    }
    EventLogger.logStartTyping(e.currentTarget.id);
    timerDescription = Meteor.setTimeout(function(){
        EventLogger.logStopTyping(e.currentTarget.id);
        Session.set("isTypingDescr", false);
    }, 5000);
    // console.log("textarea keyup");
    // console.log(target);
    // console.log(e.currentTarget.id);
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
  // initInspirationFilter("rollThemes");
  // initInspirationFilter("rollProps");
  // initInspirationFilter("stuckThemes");
  // initInspirationFilter("stuckProps");
  Session.set("cogState", "onRoll");
  $('#stuck-insps-container').hide();
  $('#roll-insps-container').show();

  var msg = "<p>Sorry, we couldn't find suggestions for your last idea! " +
            "Submit another idea to get suggested inspirations. It might help to check your spelling before submitting.</p>"
  $('#stuckThemes-question').tooltipster({
      content: $(msg),
      position: 'right',
      offset: 40,
      speed: 200,
      maxWidth: 200
  });
  $('#rollThemes-question').tooltipster({
      content: $(msg),
      position: 'right',
      offset: 40,
      speed: 200,
      maxWidth: 200
  });
  $('#stuckThemes-question').hide();
  $('#rollThemes-question').hide();

  // var msg = "<p>No suggested props because we couldn't understand your last prop. " +
  //           "To avoid this situation, please make sure your props are spelled correctly " +
  //           "before submitting.</p>"
  $('#stuckProps-question').tooltipster({
      content: $(msg),
      position: 'right',
      offset: 40,
      speed: 200,
      maxWidth: 200
  });
  $('#rollProps-question').tooltipster({
      content: $(msg),
      position: 'right',
      offset: 40,
      speed: 200,
      maxWidth: 200
  });
  $('#stuckProps-question').hide();
  $('#rollProps-question').hide();

});

Template.Inspiration.helpers({
  inspRollThemes: function() {
    var newInsps = FilterManager.performQuery("rollThemes", Session.get("currentUser"), "weddingInspirations").fetch();
    return newInsps;
  },
  inspRollProps: function() {
    var newInsps = FilterManager.performQuery("rollProps", Session.get("currentUser"), "weddingInspirations").fetch();
    return newInsps;
  },
  inspStuckThemes: function() {
    var newInsps = FilterManager.performQuery("stuckThemes", Session.get("currentUser"), "weddingInspirations").fetch();
    return newInsps;
  },
  inspStuckProps: function() {
    var newInsps = FilterManager.performQuery("stuckProps", Session.get("currentUser"), "weddingInspirations").fetch();
    return newInsps;
  },
  isStuck: function() {
    return Session.equals("cogState", "stuck");
  },
});

Template.Inspiration.events({
  'click .roll-button': function() {
    logger.debug("Clicked on a roll");
    Session.set("cogState", "onRoll");
  },
  'click .stuck-button': function(e, target) {
    logger.debug("Clicked stuck button");
    var user = Session.get("currentUser");
    if (Session.get("lastIdea")) {
      if (Session.equals("cogState", "onRoll")) {
        EventLogger.logChangeCogState("onRoll", "stuck");
        logger.debug("Switching from onRoll to stuck");
        var lastIdea = Session.get("lastIdea");
        // var lastInsps = {"themes": FilterManager.performQuery("rollThemes", user, "weddingInspirations").fetch(),
                          // "props": FilterManager.performQuery("rollProps", user, "weddingInspirations").fetch()}
        logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
        var theme = replaceEraNames(lastIdea.theme);
        var prop = replaceEraNames(lastIdea.prop);
        WeddingInspManager.getSimSet("stuckThemes", theme, "weddingTheme", numMatches, 
                                      "Switch from onRoll to stuck", Session.get("stuckDistance"), prop);
        WeddingInspManager.getSimSet("stuckProps", prop, "weddingProp", numMatches, 
                                        "Switch from onRoll to stuck", Session.get("stuckDistance"), theme);
        // if (anyCorrect(theme)) {
        //   WeddingInspManager.retrieveInsp("stuckThemes", theme, "weddingTheme", numMatches, 
        //                                 "Switch from onRoll to stuck", Session.get("stuckDistance"));
        // } else {
        //   logger.trace("No valid words in theme; retrieiving prop inspirations based on prop");
        //   WeddingInspManager.retrieveInsp("stuckThemes", prop, "weddingTheme", numMatches, 
        //                                 "Switch from onRoll to stuck", Session.get("stuckDistance"));
        // }
        // if (anyCorrect(prop)) {
        //   WeddingInspManager.retrieveInsp("stuckProps", prop, "weddingProp", numMatches, 
        //                                   "Switch from onRoll to stuck", Session.get("stuckDistance"));  
        // } else {
        //   logger.trace("No valid words in prop; retrieiving prop inspirations based on theme");
        //   WeddingInspManager.retrieveInsp("stuckProps", theme, "weddingProp", numMatches, 
        //                                   "Switch from onRoll to stuck", Session.get("stuckDistance"));
        // }
        Session.set("cogState", "stuck");
        $('#stuck-insps-container').show();
        $('#roll-insps-container').hide();
        // var newInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                          // "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
        // EventLogger.logInspirationRefresh(lastInsps, newInsps, "Switch from onRoll to stuck");
      } else {
        logger.debug("Already stuck, refreshing stuck inspirations");
        // var lastInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                          // "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
        updateInspFilter("stuckThemes");
        updateInspFilter("stuckProps");
        // var newInsps = {"themes": FilterManager.performQuery("stuckThemes", user, "weddingInspirations").fetch(),
                          // "props": FilterManager.performQuery("stuckProps", user, "weddingInspirations").fetch()}
        // EventLogger.logInspirationRefresh(lastInsps, newInsps, "Click stuck button again");
      }
    } else {
      alert("You must submit at least one idea before using this feature!");
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

Template.PInspInstructions.helpers({
  promptLength: function() {
    return Session.get("currentPrompt").length;
  },
  useInspirations: function() {
    return Session.equals("useInspirations", true);
  }
});

var initInspirationFilter = function(filterName) {
  if(Filters.find({name: filterName, user: Session.get("currentUser")._id}).count() == 0) {
    FilterManager.create(filterName, Session.get("currentUser"), 
      "weddingInspirations", "previous_id", "NonsenseID");
  }
}

var updateInspFilter = function(filterName) {
  // var lastInsps = FilterManager.performQuery(filterName, Session.get("currentUser"), "weddingInspirations");
  var inspPool = Session.get(filterName);
  var newSample = getRandomElement(inspPool);
  logger.trace("Drew new set of inspirations: " + JSON.stringify(newSample));
  logger.trace("New seed is " + newSample[0].text + " with similarity " + newSample[0].similarity + " to query");
  // logger.trace("New inspirations have average similarity: " + WeddingInspManager.averageSim(newSample));
  // logger.trace("Inspirations: " + JSON.stringify(insps));
  // var samples = []
  // while (samples.length < numMatches) {
  //   var sample = getRandomElement(insps);
  //   if (!isInList(sample, samples)) {
  //     samples.push(sample);  
  //   }
  // }
  FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
  newSample.forEach(function(insp) {
      // matches.push(WeddingInspirations.findOne({previous_id: sample}));
      FilterManager.create(filterName, Session.get("currentUser"), 
        "weddingInspirations", "previous_id", insp.id);
  });
  if (filterName.indexOf("Theme") > -1) {
    EventLogger.logInspirationRefresh(newSample, Session.get("lastIdea").theme, filterName, "Click stuck button again");
  } else {
    EventLogger.logInspirationRefresh(newSample, Session.get("lastIdea").prop, filterName, "Click stuck button again");  
  }
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
  "<span id=\"insp-star-insp-tutorialInsp\" class=\"insp-star-empty glyphicon glyphicon-star-empty\"></span>" +
  "Example inspiration</li>";
  $("#roll-insps-themes").append(template);
}

var removeTutorialInsp = function() {
  $("#insp-tutorialInsp").remove();
}

var replaceEraNames = function(phrase) {
  /*
  * Replace era names (e.g., "70's") that would be treated as misspellings
  * in GloVe, to improve usability
  */
  var words = phrase.split(" ");
  var newWords = [];
  words.forEach(function(word) {
    if (spell.check(word)) {
      newWords.push(word);
    } else {
      if (isInList(word, Object.keys(eraNames))) {
        newWords.push(eraNames[word]);
      } else {
        newWords.push(word)
      }
    }
  });
  return newWords.join(" ");
} 

var anyCorrect = function(phrase) {
  /*
  * Check if the whole theme/prop is misspelled (could potentially be multi-word)
  */
  var words = phrase.split(" ");
  var numMisspellings = 0;
  words.forEach(function(word) {
    if (!spell.check(word)) {
      numMisspellings += 1;
    }
  });
  return (numMisspellings < words.length);
}