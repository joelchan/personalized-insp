// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Fluency');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Fluency', 'trace');
// Logger.setLevel('Client:Hcomp:Fluency', 'debug');
// Logger.setLevel('Client:Hcomp:Fluency', 'info');
// Logger.setLevel('Client:Hcomp:Fluency', 'warn');

Template.ExpBaselineFluencyPage.rendered = function(){
  // EventLogger.logEnterIdeation(); 
  //Hide logout
  $(".btn-login").toggleClass("hidden");
  
  logger.debug("checking to show begin ideation modal");
  if (!Session.get("currentParticipant").hasStarted) {
    logger.debug("showing begin ideation modal");
    $("#exp-begin-modal").modal('show');  
  }
}

Template.ExpBaselineFluencyPage.events({
  'click .grab-fluency-input' : function () {
    var text = $("#baseFluencyInput").val();
    var answers = text.split("\n");
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
  }
})