// Configure logger for Tools
var logger = new Logger('Client:IdeatePersonal');
// Comment out to use global logging level
Logger.setLevel('Client:IdeatePersonal', 'trace');
// Logger.setLevel('Client:IdeatePersonal', 'debug');
// Logger.setLevel('Client:IdeatePersonal', 'info');
// Logger.setLevel('Client:IdeatePersonal', 'warn');

var numMatches = 3;

Template.IdeaEntry.events({
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
    Session.set("lastIdea", idea);
    //if (idea) {
      //EventLogger.logIdeaSubmission(idea); 
    //}
    // Clear the text field
    $("#idea-theme").val("");
    $("#idea-prop").val("");
    $("#idea-description").val("");

    logger.trace("Theme: " + theme + ", Prop: " + prop);
    WeddingInspManager.retrieveInsp("rollThemes", theme, "weddingTheme", numMatches);
    WeddingInspManager.retrieveInsp("rollProps", prop, "weddingProp", numMatches);
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
});

Template.Inspiration.helpers({
  inspRollThemes: function() {
    return FilterManager.performQuery("rollThemes", Session.get("currentUser"), "weddingInspirations");
  },
  inspRollProps: function() {
    return FilterManager.performQuery("rollProps", Session.get("currentUser"), "weddingInspirations");
  },
  inspStuckThemes: function() {
    return FilterManager.performQuery("stuckThemes", Session.get("currentUser"), "weddingInspirations");
  },
  inspStuckProps: function() {
    return FilterManager.performQuery("stuckProps", Session.get("currentUser"), "weddingInspirations");
  },
});

Template.Inspiration.events({
  'click .stuck-button': function() {
    var lastIdea = Session.get("lastIdea");
    logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
    WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
    WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
    $("#stuck-insps-container").removeClass('stuck-insps-inactive');
    Meteor.setTimeout(function() {
      $("#stuck-insps-container").addClass('stuck-insps-inactive')}, 60000);
  }
});

var initInspirationFilter = function(filterName) {
  if(Filters.find({name: filterName, user: Session.get("currentUser")._id}).count() == 0) {
    FilterManager.create(filterName, Session.get("currentUser"), 
      "weddingInspirations", "previous_id", "NonsenseID");
  }
}