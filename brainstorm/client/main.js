$(document).ready(function(){

    var color = getRandomColor();

    $('.tag').css({"background":"blue"});

    console.log("muahahhaa i see you");
});


// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");
Types = new Meteor.Collection("types");

Template.Page1.ideas = function () {
    return Ideas.find();
};

Template.Page2.types = function () {
    return Types.find();
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
var newType;

Template.Page2.events({
    // //put tags
    // 'keyup input#nextType': function (evt) {
    //     newType = $('#ideastorm input#nextType').val().trim();
    // },
    // 'click button.submitType': function () {
    //     if (newType) {
    //         Types.insert({type: newType, done: false, tag: "", color: ""});
    //         newType = null;
    //         console.log(Types);
    //         document.getElementById('nextType').value = ""
    //     }
    // },

    'keyup input#nextTag': function (evt) {
        newTag = $('#ideastorm input#nextTag').val().trim();
    },

    'click button.submitTag': function () {
        if (newTag) {
            //edit tags for ideas selected
            console.log("inside newTag");
            // var color = getRandomColor();
            // console.log("color: " + color);
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    var color = getRandomColor();                    
                    console.log(post);
                    console.log(post._id);
                    Ideas.update(post._id, {$set: {done: false, tag: newTag}});
                    console.log(newTag);
                }
            });

            //add tags in type
            Types.insert({type: newTag, done: false, tag: ""});

            //reset entry box
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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    console.log("color is: " + color);
    return color;
}
