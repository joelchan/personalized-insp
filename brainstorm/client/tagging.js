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


Template.TaggingPage.rendered = function() {
};

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
            //add tags in type
            Tags.insert({tag: newTag, done: false, color: color});
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    console.log(post);
                    console.log(post._id);
                    Ideas.update(post._id, {$set: {done: false, tag: newTag, color: color}});
                    console.log(newTag);
                }
            });

            //console.log(newTag);
            //reset entry box
            newTag = null;
            document.getElementById('nextTag').value = "";
        }
    },

     //when click tags, the ideas with this tag would show
    'click button.tag': function () {
        console.log(this._id);
        console.log(this.tag);
        var tagContent = this.tag;

        Ideas.find().forEach(function (post) {
            //console.log(post._id);
            console.log(tagContent);
            if (post.tag == tagContent) {
                console.log(post.done);
                if (post.done){  
                    Ideas.update(post._id, {$set: {done: false}});
                } else {
                    Ideas.update(post._id, {$set: {done: true}});
                }
            } else {
                if (post.done){
                    Ideas.update(post._id, {$set: {done: false}});
                }
            }
        });
    },

    'click button.nextPage': function () {
        Session.set("currentState", "JoinIdeasPage");
    },

    'click button.tag-ideas': function() {
        Ideas.update(this._id, {$set: {done: !this.done}});
    }
});
