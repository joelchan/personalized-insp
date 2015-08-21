// Configure logger for Tools
var logger = new Logger('Client:IdeatePersonal');
// Comment out to use global logging level
Logger.setLevel('Client:IdeatePersonal', 'trace');
// Logger.setLevel('Client:IdeatePersonal', 'debug');
// Logger.setLevel('Client:IdeatePersonal', 'info');
// Logger.setLevel('Client:IdeatePersonal', 'warn');

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
    WeddingInspManager.retrieveInsp("rollThemes", theme, "weddingTheme");
    // logger.trace("Retrieved roll theme ids: " + rollThemeIDs);
    // updateInspirationFilter("rollThemes", rollThemeIDs);
    WeddingInspManager.retrieveInsp("rollProps", prop, "weddingProp");
    // logger.trace("Retrieved roll prop ids: " + rollPropIDs);
    // updateInspirationFilter("rollProps", rollPropIDs);
    // Meteor.call('topN', "GloVe", theme, "weddingTheme", function(err, res) { 
    //   var matches = JSON.parse(res.content).similar;
    //   var matchingWords = [];
    //   matches.forEach(function(match) {
    //     matchingWords.push(match.text);
    //   });
    //   $("#roll-insps-themes").html("<strong>Related themes: </strong>" + matchingWords.join(", "));
    // });

    // Meteor.call('topN', "GloVe", prop, "weddingProp", function(err, res) { 
    //   var result = JSON.parse(res.content);
    //   logger.trace("Prop matches: " + JSON.stringify(result));
    //   var matches = result.similar;
    //   var matchingWords = [];
    //   matches.forEach(function(match) {
    //     matchingWords.push(match.text);
    //   });
    //   $("#roll-insps-props").html("<strong>Related props: </strong>" + matchingWords.join(", "));
    // });
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
    WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", "different");
    // updateInspirationFilter("rollThemes", stuckThemeIDs);
    WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", "different");
    // updateInspirationFilter("rollProps", stuckPropIDs);
    // Meteor.call('topN', "GloVe", lastIdea.theme, "weddingTheme", function(err, res) { 
    //   var matches = JSON.parse(res.content).different;
    //   var matchingWords = [];
    //   matches.forEach(function(match) {
    //     matchingWords.push(match.text);
    //   });
    //   $("#stuck-insps-themes").html(matchingWords.join(", "));
    // });

    // Meteor.call('topN', "GloVe", lastIdea.prop, "weddingProp", function(err, res) { 
    //   var result = JSON.parse(res.content);
    //   logger.trace("Prop matches: " + JSON.stringify(result));
    //   var matches = result.different;
    //   var matchingWords = [];
    //   matches.forEach(function(match) {
    //     matchingWords.push(match.text);
    //   });
    //   $("#stuck-insps-props").html(matchingWords.join(", "));
    // });
  }
});

var initInspirationFilter = function(filterName) {
  if(Filters.find({name: filterName, user: Session.get("currentUser")._id}).count() == 0) {
    FilterManager.create(filterName, Session.get("currentUser"), 
      "weddingInspirations", "previous_id", "NonsenseID");
  }
}

// var updateInspirationFilter = function(filterName, inspIDs) {
//   inspIDs.forEach(function(inspID) {
//     FilterManager.create(filterName, Session.get("currentUser"), 
//       "weddingInspirations", "previous_id", inspID);
//   });
// }