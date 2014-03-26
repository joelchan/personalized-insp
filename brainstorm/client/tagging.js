Template.TaggingPage.types = function () {
    return Types.find();
};

Template.TaggingPage.ideas = function () {
    return Ideas.find();
};

Template.taggedIdea.done_class = function () {
  return this.done ? 'done' : '';
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    console.log("color is: " + color);
    return color;
}

var newTag;
var newType;

Template.TaggingPage.events({
    'keyup input#nextTag': function (evt) {
        newTag = $('#ideastorm input#nextTag').val().trim();
    },

    'click button.submitTag': function () {
        if (newTag) {
            //edit tags for ideas selected
            console.log("inside newTag");
            var color = getRandomColor();
            console.log("color: " + color);
            Types.insert({type: newTag, done: false, color: color});
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    console.log(post);
                    console.log(post._id);
                    Ideas.update(post._id, {$set: {done: false, tag: newTag}});
                    console.log(newTag);
            	    //add tags in type
                }
            });


            //reset entry box
            newTag = null;
            document.getElementById('nextTag').value = "";
        }
    },

    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "JoinIdeasPage");
    },

    'click button.tag-ideas': function() {
        Ideas.update(this._id, {$set: {done: !this.done}});
        //Session.set("currentState", "Page3");
    }
});
