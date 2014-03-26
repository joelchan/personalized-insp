Template.TaggingPage.tags = function () {
    return Tags.find();
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

Template.TaggingPage.events({
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
            //edit tags for ideas selected
            console.log("inside newTag");
            var color = getRandomColor();
            console.log("color: " + color);
            s.insert({tag: newTag, done: false, color: color});
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    console.log(post);
                    console.log(post._id);
                    Ideas.update(post._id, {$set: {done: false, tag: newTag}});
                    console.log(newTag);
            	    //add tags in tag
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
