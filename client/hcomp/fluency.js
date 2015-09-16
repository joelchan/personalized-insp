// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Fluency');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Fluency', 'trace');
// Logger.setLevel('Client:Hcomp:Fluency', 'debug');
// Logger.setLevel('Client:Hcomp:Fluency', 'info');
// Logger.setLevel('Client:Hcomp:Fluency', 'warn');

var timer = new Tock({
    callback: function () {
        $('#clockface').text(timer.msToTime(timer.lap()));
    }
});

var countdown = Tock({
    countdown: true,
    interval: 1000,
    callback: function () {
        // console.log(countdown.lap() / 1000);
        $('#countdown_clock').text(timer.msToTimecode(countdown.lap()));
    },
    complete: function () {
        alert("Time's up! We'll take you to the main task now.")
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
    }
});

var fluencyTaskLength = 1*60000;

Template.ExpBaselineFluencyPage.rendered = function(){
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
  Session.set("nextPage", cond.misc.routeSequence[1]);
  logger.trace("Next page is: " + Session.get("nextPage"));

  if ($('.timer').length == 0 && Session.get("useFluencyTimer")) {
    logger.info("using a timer");
    Session.set("hasTimer",true);
    Blaze.render(Template.TockTimer, $('#nav-right')[0]);  
  }

  var instructions = "Welcome! Let's begin with a short warm-up exercise to get your creative juices flowing. " +
  "Over the next 1 minute, try to think of as many uses as you can for a brick. " +
  "We'll start a timer once you hit \"Begin\", and take you to the main task after 1 minute."
  var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

  var fluencyTour = new Tour({
    template: "<div class='popover tour'>" +
        "<div class='arrow'></div>" +
        "<h3 class='popover-title'></h3>" +
        "<div class='popover-content'></div>" +
        "<div class='popover-navigation'>" +
            // "<button class='btn btn-default' data-role='prev'>« Prev</button>" +
            "<button class='btn btn-default' data-role='end'>Begin!</button>" +
        "</div>" +
      "</div>",
    steps: [
    {
      element: "#lpheader",
      title: "Warm up" + spacer + spacer + spacer + spacer,
      content: instructions,
      backdrop: true,
      placement: "bottom",
    }],
    onEnd: function(tour) {
      EventLogger.logFluencyTaskBegin();
      countdown.start(fluencyTaskLength);
    },
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

Template.FluencyEntry.events({
  'click .submit-idea': function (e, target) {
    //console.log("event submitted");
    logger.debug("submitting a new idea");
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
  }
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