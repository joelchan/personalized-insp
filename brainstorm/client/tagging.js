Template.TaggingPage.tags = function () {
    return Tags.find({question_id: Session.get("currentPrompt")['_id']});
};

Template.TaggingPage.prompt = function () {
  return Session.get("currentPrompt")['prompt'];
};

Template.TaggingPage.ideas1 = function () {
    //Only show max of 10 ideas
    var allIdeas = Ideas.find(
        {question_id: Session.get("currentPrompt")['_id']}).fetch();
    return GetRandomSet(allIdeas, 7);
};

Template.TaggingPage.ideas2 = function () {
    //Only show max of 10 ideas
    var allIdeas = Ideas.find(
        {question_id: Session.get("currentPrompt")['_id']}).fetch();
    var selectIdeas = GetRandomSet(allIdeas, 7);
    console.log("got " + selectIdeas.length + " ideas");
    return selectIdeas;
};

Template.taggedIdea.done_class = function () {
  return this.done ? 'done' : '';
};

GetRandomSet = function getRandomSet(items, numItems) {  
  var end;
  if (numItems < items.length) {
    end = items.length;
  } else {
    end = numItems;
  }
  return items.slice(0, end);
};

getRandomColor = function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
};

function toggleIdea(idea) {
  console.log("toggling idea status " + idea.done);
  if (idea.done) {
    Ideas.update(idea._id, {$set: {done: false}});
    $(idea).attr({'background': '#3276b1',
        'color': '#fff'});
  } else {
    Ideas.update(idea._id, {$set: {done: true}});
    $(idea).attr({background: 'yellow', color: '#000'});
  }
};


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
      console.log("pressed submit");
        var newTag = $("#nextTag").val();
        var createTag = true;
        if (newTag != "") {
          console.log("tag is not empty");
            Tags.find().forEach(function (post) {
                if (newTag == post.tag) {
                    createTag = false;
                }
            });
        } else {
          console.log("tag is empty");
          createTag = false; 
        }


        if (newTag) {
            //edit tags for ideas selected
            var color = getRandomColor();
            var question = Session.get("currentPrompt");
            if (createTag) {
              //add tags in type
              Tags.insert({tag: newTag, 
                  done: false, 
                  color: color,
                  user: Session.get("currentUser"),
                  question_id: question['_id'],
                  question: question['prompt']
              });
            }
            Ideas.find().forEach(function (post) {
                if (post.done) {
                    Ideas.update(post._id, {$set: {done: false, 
                        tag: newTag, 
                        color: color}});
                }
            });

            //console.log(newTag);
            //reset entry box
            newTag = null;
            $('#nextTag').val("");
        }
    },

     //when click tags, the ideas with this tag would show
    'click button.tag': function () {
        var tagContent = this.tag;
        //Set the current tagtext to the value of the tag
        newTag = this.tag;
        $("#nextTag").val(newTag);

        
        Ideas.find().forEach(function (post) {
            if (post.tag == tagContent) {
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

    //toggle the select status of the clicked div
    'click div.clickable': function () {
      toggleIdea(this);
    },

    //Go to next state in app
    'click button.nextPage': function () {
        Session.set("currentState", "JoinIdeasPage");
    },

});
