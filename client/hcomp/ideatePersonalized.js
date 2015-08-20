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
    //if (idea) {
      //EventLogger.logIdeaSubmission(idea); 
    //}
    // Clear the text field
    $("#idea-theme").val("");
    $("#idea-prop").val("");
    $("#idea-description").val("");

    logger.trace("Theme: " + theme + ", Prop: " + prop);
    Meteor.call('topN', "GloVe", theme, "weddingTheme", function(err, res) { 
      var matches = JSON.parse(res.content).similar;
      var matchingWords = [];
      matches.forEach(function(match) {
        matchingWords.push(match.text);
      });
      $("#roll-insps-themes").html("<strong>Related themes: </strong>" + matchingWords.join(", "));
    });

    Meteor.call('topN', "spaCy", prop, "weddingProp", function(err, res) { 
      var result = JSON.parse(res.content);
      logger.trace("Prop matches: " + JSON.stringify(result));
      var matches = result.similar;
      var matchingWords = [];
      matches.forEach(function(match) {
        matchingWords.push(match.text);
      });
      $("#roll-insps-props").html("<strong>Related props: </strong>" + matchingWords.join(", "));
    });

    // Meteor.call('topN', "GloVe", theme, "weddingTheme", function(err, resp) {
    //   var matches = resp.content.similar
    //   $("#roll-insps-themes").html(JSON.stringify(matches));
    // });
    // Meteor.call('topN', "GloVe", prop, "weddingProp", function(err, res) { 
    //   var matches = res.content.similar
    //   $("#roll-insps-props").html(JSON.stringify(matches));
    // });
  },
});

Template.IdeaList.helpers({
  weddingIdeas: function() {
    return Ideas.find({promptID: Session.get("currentPrompt")._id, 
                       userID: Session.get("currentUser")._id, 
                       isWedding: true}, {sort: {time: -1}})
  }
});