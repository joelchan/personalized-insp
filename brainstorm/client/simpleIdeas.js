Template.IdeationPage.ideas = function () {
  if (Session.get("currentPrompt") !== undefined) {
      return Ideas.find({user: Session.get('currentUser'),
          question_id: Session.get("currentPrompt")['_id']});
  } else {
    return Ideas.find();
  }
};

Template.IdeationPage.prompt = function () {
  if (Session.get("currentPrompt") === undefined) {
    //Session.set("currentState", 'PromptPage');
    Router.go('PromptPage')
  } else {
    return Session.get("currentPrompt")['prompt'];
  }
};

// Keeps text input field until submit is pressed
var newIdea;

Template.IdeationPage.events({
    'keyup input#nextIdea': function (evt) {
        newIdea = $('#ideastorm input#nextIdea').val().trim();
        $(document).ready(function(){
            $('#nextIdea').keypress(function(e){
              if(e.keyCode===13)
              $('#submitIdea').click();
            });
        });
    },

    'click button.submitIdea': function () {
        var newIdea = $('#nextIdea').val();
        //Check if idea already has been proposed
        Ideas.find().forEach(function (post) {
            if (newIdea == post.text) {
                newIdea = "";
            }
        });
        //Add idea to database
        if (newIdea !== "") {
          var question = Session.get("currentPrompt");
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
      Router.go('TaggingPage')
      //Session.set("currentState", "TaggingPage");
    }
});


