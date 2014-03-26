// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");

Template.Page1.ideas = function () {
    return Ideas.find();
};

Template.Page2.tags = function () {
    return Tags.find();
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
        Session.set("currentState", "Page2");
    }

});


Template.taggedIdea.done_class = function () {
  return this.done ? 'done' : '';
};

var newTag;

Template.Page2.events({
    //put tags
    'keyup input#nextTag': function (evt) {
        newTag = $('#ideastorm input#nextTag').val().trim();
        $(document).ready(function(){
            $('#nextTag').keypress(function(e){
              if(e.keyCode==13)
              $('#submitTag').click();
            });
        });
    },

    'click button.submitTag': function () {
        if (newTag) {
            Tags.find().forEach(function (post) {
                if (newTag == post.tag) {
                    newTag = null;
                }
            });
        }

        if (newTag) {
            var color = getRandomColor();
            Tags.insert({tag: newTag, done: false, color: color});
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    console.log(post);
                    console.log(post._id);
                    Ideas.update(post._id, {$set: {done: false, tag: newTag}});
                    console.log(newTag);
                }
            });
            newTag = null;
            console.log(Tags);
            document.getElementById('nextTag').value = ""
        }
    },

    
    //when click tags, the ideas with this tag would show
    'click button.getTag': function(){
        var getButtonValue = function($button) {
            var label = $button.text(); 
            $button.text('');
            var buttonValue = $button.val();
            $button.text(label);
            return buttonValue;
        }

        Ideas.find().forEach(function (post) {
            if (post.tag == getButtonValue) {
                console.log(post.done);
                Ideas.update(post._id, {$set: {done: false}});
                }
            });
    },

    

    /*'click button.submitTag': function () {
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
    },*/

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
