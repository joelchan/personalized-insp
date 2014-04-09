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
	console.log("testing rendered");
	$(".draggable").draggable();
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
                    Ideas.update(post._id, {$set: {done: false, tag: newTag}});
                    console.log(newTag);
                }
            });


            //reset entry box
            newTag = null;
            document.getElementById('nextTag').value = "";
        }
    },

     //when click tags, the ideas with this tag would show
    //'click button.tag': function () {
        //console.log("test");
        // function toggleText(button_id) 
        // {
        //    var el = document.getElementById(button_id);
        //    if (el.firstChild.data == "float") 
        //    {
        //        el.firstChild.data = "Unlock";
        //    }
        //    else 
        //    {
        //      el.firstChild.data = "float";
        //    }
        // }

        /*Ideas.find().forEach(function (post) {
            //console.log(post.done);
            if (post.tag == getButtonValue) {
                //console.log(post.done);
                Ideas.update(post._id, {$set: {done: true}});
                }
            });*/
    //},

    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "JoinIdeasPage");
    },

    'click button.tag-ideas': function() {
        Ideas.update(this._id, {$set: {done: !this.done}});
        //Session.set("currentState", "Page3");
    }
});
