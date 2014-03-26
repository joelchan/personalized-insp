
Template.Page1.ideas = function () {
    return Ideas.find();
};


// Defines a state machine using "currentState"
// Controls the site page flow
Session.set("currentState", "Page1");
Template.brainstorm1.currentPage = function () {
    var currentState =  Session.get('currentState');
    switch(currentState) {
        case "Page1":
            return Template.Page1();
        case "TaggingPage":
            return Template.TaggingPage();
        case "JoinIdeasPage":
            return Template.JoinIdeasPage();
        default:
            return Template.Page1();
    }
};

// Keeps text input field until submit is pressed
var newIdea;

Template.Page1.events({
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
            Ideas.insert({idea: newIdea, done: false, tag: ""});
            newIdea = null;
            document.getElementById('nextIdea').value = ""
        }
    },

    'click button.nextPage': function () {
        //Not working state machine yet

        Session.set("currentState", "TaggingPage");

    }
});


