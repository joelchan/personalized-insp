// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Fluency');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Fluency', 'trace');
// Logger.setLevel('Client:Hcomp:Fluency', 'debug');
// Logger.setLevel('Client:Hcomp:Fluency', 'info');
// Logger.setLevel('Client:Hcomp:Fluency', 'warn');

var fluencyTaskLength = 5*60000;

var timer = new Tock({
    callback: function () {
        $('#clockface').text(timer.msToTime(timer.lap()));
    }
});

var countdown = Tock({
    countdown: true,
    interval: 1000,
    callback: function () {
        $('#countdown_clock').text(timer.msToTimecode(countdown.lap()));
        if (timer.msToTimecode(countdown.lap()) == "00:00:45") {
          var answers = DummyIdeas.find(
                        {userID: Session.get("currentUser")._id,
                        'prompt._id': Session.get("currentPrompt")._id}).fetch();
          if (answers.length < 1) {
            alert("We noticed you haven't entered any ideas yet: please complete this warm up task to proceed with the HIT!");
          }
        }
    },
    complete: function () {
        if (Session.equals("fluencyPromptSeq", 2)) {
          alert("Your time is up! When you hit OK, we will automatically take you to the next page, which includes the main task.")
          logger.debug("Grabbing fluency data");
          var answers = DummyIdeas.find(
                          {userID: Session.get("currentUser")._id,
                          'prompt._id': Session.get("currentPrompt")._id}).fetch();
          logger.trace("Answers: " + JSON.stringify(answers));
          var measure = new FluencyMeasure(answers, Session.get("currentParticipant"));
          var measureID = FluencyMeasures.insert(measure);
          if (measureID) {
            logger.trace("Fluency measure for " +
              Session.get("currentParticipant")._id +
              ": " + JSON.stringify(measure));
          } else {
            logger.debug("Failed to grab the data")
          }
          var part = Session.get("currentParticipant");
          var cond = Conditions.findOne({_id: part.conditionID});
          // var condName = Conditions.findOne({_id: part.conditionID}).description;
          EventLogger.logFluencyTaskComplete();
          Router.go(Session.get("nextPage"), {promptID: cond.promptID, partID: part._id});
        } else {
          var ready = confirm("Time's up! Now for round 2: take the next 5 minutes to brainstorm alternative ways to use a newspaper.");
          if (ready == true) {
            logger.debug("Grabbing fluency data");
            var answers = DummyIdeas.find(
                            {userID: Session.get("currentUser")._id,
                            'prompt._id': Session.get("currentPrompt")._id}).fetch();
            logger.trace("Answers: " + JSON.stringify(answers));
            var measure = new FluencyMeasure(answers, Session.get("currentParticipant"));
            var measureID = FluencyMeasures.insert(measure);
            if (measureID) {
              logger.trace("Fluency measure for " +
                Session.get("currentParticipant")._id +
                ": " + JSON.stringify(measure));
            } else {
              logger.debug("Failed to grab the data")
            }
            // Go to the next alt uses prompt
            Session.set("currentFluencyObject", "NEWSPAPER");
            Session.set("fluencyPromptSeq", 2);
            countdown.start(fluencyTaskLength);
          }
        }
    }
});

Template.ExpBaselineFluencyPage.rendered = function(){

  Session.set("currentFluencyObject", "BRICK");
  Session.set("fluencyPromptSeq", 1);
  Session.set("cogState", "onRoll");
  // EventLogger.logEnterIdeation();
  //Hide logout
  // $(".btn-login").toggleClass("hidden");

  // logger.debug("checking to show begin ideation modal");
  // if (!Session.get("currentParticipant").hasStarted) {
  //   logger.debug("showing begin ideation modal");
  //   $("#exp-begin-modal").modal('show');
  // }
  var part = Session.get("currentParticipant");
  var cond = Conditions.findOne({_id: part.conditionID});
  var nextPageIndex = cond.misc.routeSequence.indexOf("ExpFluency")+1
  // Session.set("nextPage", cond.misc.routeSequence[2]);
  Session.set("nextPage", cond.misc.routeSequence[nextPageIndex]);
  logger.trace("Next page is: " + Session.get("nextPage"));

  if ($('.timer').length == 0 && Session.get("useFluencyTimer")) {
    logger.info("using a timer");
    Session.set("hasTimer",true);
    Blaze.render(Template.TockTimer, $('#nav-right')[0]);
  }

  var instructions = "Welcome! Let's begin with an alternative uses task. " +
  "We'd like you to brainstorm alternative ways you can use common objects. We'll ask you do this for 5 mins each for 2 objects."
  var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

  var fluencyTour = new Tour({
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
        title: "Warm up" + spacer + spacer + spacer + spacer + "&nbsp;&nbsp;&nbsp;&nbsp;",
        content: instructions,
        backdrop: true,
        placement: "bottom",
      },
      {
        element: ".stuck-button",
        title: "Tell us if you run low on ideas" + spacer,
        content: "If you feel like you are running low on ideas, please click on this button to let us know! It's important to us that you click on this button as often as you run low on ideas.",
        backdrop: true,
        placement: "bottom",
        onPrev: function() {
          // removeTutorialInsp();
        },
        onNext: function() {
          // addTutorialInsp();
          // $('.insp-container-toggle').click();
        }
      },
    ],
    onEnd: function(tour) {
      EventLogger.logFluencyTaskBegin();
      countdown.start(fluencyTaskLength);
      $('.submit-idea').prop("disabled", false);
      $('.stuck-button').prop("disabled", false);
    },
  });
  fluencyTour.addStep({
        element: "#lpheader",
        title: "Warm up" + spacer + spacer + spacer + spacer + "&nbsp;&nbsp;&nbsp;&nbsp;",
        content: "That's it! We'll start a timer once you hit \"Begin\". Good luck!",
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
      });

  fluencyTour.restart();

  // alert(instructions);
  // countdown.start(fluencyTaskLength);


  // alert(instructions);
  // countdown.start(fluencyTaskLength);
}

Template.ExpBaselineFluencyPage.events({
  'click .grab-fluency-input' : function () {
    var text = $("#baseFluencyInput").val();
    var answers = text.split("\n");
    // logger.trace("Answers: " + JSON.stringify(answers));
    var measure = new FluencyMeasure(answers, Session.get("currentParticipant"));
    var measureID = FluencyMeasures.insert(measure);
    if (measureID) {
      logger.trace("Fluency measure for " +
        Session.get("currentParticipant")._id +
        ": " + JSON.stringify(measure));
    } else {
      logger.debug("Failed to grab the data")
    }
  },

})

Template.ExpBaselineFluencyPage.helpers({
  fluencyObject: function() {
    return Session.get("currentFluencyObject");
  },
})

Template.FluencyEntry.events({
  'click .submit-idea': function (e, target) {
    //console.log("event submitted");
    logger.debug("submitting a new idea");
    if (Session.equals("cogState", "stuck")) {
      logger.debug("Marking cogState transition from stuck to onRoll");
      EventLogger.logChangeCogState("stuck", "onRoll");
      Session.set("cogState", "onRoll");
    }
    var content = $("#idea-description").val();
    //Add idea to database
    var idea = IdeaFactory.create(content,
        Session.get("currentUser"),
        Session.get("currentPrompt"),
        true
    );
    if (idea) {
      EventLogger.logIdeaSubmission(idea, null, true);

    // Clear the text field
      $("#idea-description").val("");
    }
  },
  'keyup textarea' : function(e, target){
    if(e.keyCode===13) {
      logger.debug("enter pressed");
      var btn = $('.submit-idea');
      btn.click();
    }
  },
  'click .stuck-button': function(e, target) {
    logger.debug("Clicked stuck button");
    var user = Session.get("currentUser");
    if (Session.equals("cogState", "onRoll")) {
      EventLogger.logChangeCogState("onRoll", "stuck");
      Session.set("cogState", "stuck");
      logger.debug("Marking cogState transition from onRoll to stuck");
    } else {
      EventLogger.logChangeCogState("stuck", "stuck");
      logger.debug("Marking cogState transition from stuck to stuck");
    }
  },
});

Template.FluencyIdeas.helpers({
  numIdeas: function() {
    return DummyIdeas.find({userName: Session.get("currentUser").name,
                            promptID: Session.get("currentPrompt")._id}).count();
  },
  fluencyIdeas: function() {
    return DummyIdeas.find({userName: Session.get("currentUser").name,
                            promptID: Session.get("currentPrompt")._id}, {sort: {time: -1}});
  }
});
