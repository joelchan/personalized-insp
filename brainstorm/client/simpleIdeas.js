
Template.IdeationPage.ideas = function () {
    return Ideas.find();
};

Template.IdeationPage.prompt = function () {
  return Session.get("currentPrompt");
};

// Keeps text input field until submit is pressed
var newIdea;

Template.IdeationPage.events({
    'keyup input#nextIdea': function (evt) {
        newIdea = $('#ideastorm input#nextIdea').val().trim();
        $(document).ready(function(){
            $('#nextIdea').keypress(function(e){
              if(e.keyCode==13)
              $('#submitIdea').click();
            });
        });
    },

    'click button.submitIdea': function () {
        if (newIdea) {
            Ideas.find().forEach(function (post) {
                if (newIdea == post.idea) {
                    newIdea = null;
                }
            });
        }
        if (newIdea) {
          var question = Session.get("currentPrompt");
          Ideas.insert({idea: newIdea, 
              done: false, 
              tag: "", 
              color: "",
              user: Session.get("currentUser"),
              question_id: question['_id'],
              question: question['prompt']});
            newIdea = null;
            document.getElementById('nextIdea').value = ""
        }
    },

    //Transition to next page in state machine
    'click button.nextPage': function () {
      Session.set("currentState", "TaggingPage");
    }
});


