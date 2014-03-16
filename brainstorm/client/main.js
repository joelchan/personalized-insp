// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");

Template.Page1.ideas = function () {
    return Ideas.find();
};

Template.Page2.ideas = function () {
    return Ideas.find();
};


// Defines a state machine using "currentState"
Session.set("currentState", "Page1");
Template.brainstorm1.currentPage = function () {
    var currentState =  Session.get('currentState');
    switch(currentState) {
        case "Page1":
            return Template.Page1();
        case "Page2":
            return Template.Page2();
        case "Page3":
            return Template.Page3();
        default:
            return Template.Page1();
    }
};
// Keeps text input field until submit is pressed
var newIdea;
Template.Page1.events({
    'keyup input#nextIdea': function (evt) {
        newIdea = $('#ideastorm input#nextIdea').val().trim();
    },
    'click button.submitIdea': function () {
        if (newIdea) {
            Ideas.insert({idea: newIdea, done: false, tag: ""});
            newIdea = null;
            document.getElementById('nextIdea').value = ""
        }
    },
    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "Page2");
    }
});


Template.taggedIdea.done_class = function () {
  return this.done ? 'done' : '';
};

var newTag;
Template.Page2.events({
    'keyup input#nextTag': function (evt) {
        newTag = $('#ideastorm input#nextTag').val().trim();
    },

    'click button.submitTag': function () {
        if (newTag) {
            //edit tags for ideas selected
            console.log("inside newTag");
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    console.log(post);
                    console.log(post._id);
                    Ideas.update(post._id, {$set: {done: false, tag: newTag}});
                    console.log(newTag);
                }
            });
            newTag = null;
            document.getElementById('nextTag').value = "";
        }
    },

    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "Page3");
    },

    'click button.tag-ideas': function() {
        Ideas.update(this._id, {$set: {done: !this.done}});
        //Session.set("currentState", "Page3");
    }
});

Template.Page3.events({
    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "Page1");
    }
});
