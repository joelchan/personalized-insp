Template.IdeationPage.ideas = function () {
  return Ideas.find({experiment: this._id});
  //if (Session.get("currentPrompt") !== undefined) {
      //return Ideas.find({user: Session.get('currentUser'),
          //question_id: Session.get("currentPrompt")['_id']});
  //} else {
    //return Ideas.find();
  //}
};

Template.IdeationPage.prompt = function () {
    return Session.get("currentExp").prompt;
  }
};

// Keeps text input field until submit is pressed
var newIdea;

Template.IdeationPage.rendered = function() {
  console.log("rendered");
  console.log(Session.get('currentExp'));
};

Template.IdeationPage.events({
    'keyup input#nextIdea': function (evt) {
        //Unecessary to capture keypresses this way
        //newIdea = $('#ideastorm input#nextIdea').val().trim();
        //$(document).ready(function(){
            //$('#nextIdea').keypress(function(e){
              //if(e.keyCode===13)
              //$('#submitIdea').click();
            //});
        //});
    },

    'click button.submitIdea': function () {
        var newIdea = $('#nextIdea').val();
        //Check if idea already has been proposed
        Ideas.find().forEach(function (idea) {
            if (newIdea == idea.content) {
                newIdea = "";
            }
        });
        //Add idea to database
        if (newIdea !== "") {
          var question = Session.get("currentExperiment");
          Ideas.insert({text: newIdea, 
              done: false, 
              type: "child",
              tags: [], 
              user: Session.get("currentUser"),
              question_id: question['_id'],
              question: question['prompt']});
          $('#nextIdea').val("");
        }
    },

    //Transition to next page in state machine
    'click button.nextPage': function () {
      var currentPrompt = Session.get("currentPrompt");
      Router.go('TaggingPage', {'_id': currentPrompt._id});
      //Session.set("currentState", "TaggingPage");
    }
});

getUser = function() {
  /******************************************************************
  * Grab the userid form MTurk
  ******************************************************************/

};
