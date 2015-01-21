(function(){Template.TaggingPage.tags = function () {
    return Ideas.find({type: 'parent',
      question_id: Session.get("currentPrompt")['_id']});
};

Template.TaggingPage.prompt = function () {
  if (Session.get("currentPrompt") === undefined) {
    Router.go('PromptPage')
  } else {
    var currentPrompt = Session.get("currentPrompt").prompt;
    return currentPrompt.question;
  }
};

Template.TaggingPage.ideas1 = function () {
    //Only show max of 10 ideas
    var allIdeas = Ideas.find(
        {type: 'child',
          question_id: Session.get("currentPrompt")['_id']}).fetch();
    return allIdeas;
};

Template.TaggingPage.ideas2 = function () {
    //Only show max of 10 ideas
    var allIdeas = Ideas.find(
        {question_id: Session.get("currentPrompt")['_id']}).fetch();
    var selectIdeas = GetRandomSet(allIdeas, 7);
    console.log("got " + selectIdeas.length + " ideas");
    return allIdeas;
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
  //console.log("toggling idea status " + idea.done);
  if (idea.done) {
    Ideas.update(idea._id, {$set: {done: false}});
    $(idea).attr({'background': '#3276b1',
        'color': '#fff'});
  } else {
    Ideas.update(idea._id, {$set: {done: true}});
    $(idea).attr({background: 'yellow', color: '#000'});
  }
};

function hasTag(child, parnt) {
  var tags = child.tags;
  console.log(parnt._id);
  for (var i=0; i<tags.length; i++) {
    if (tags[i]._id === parnt._id) {
      console.log("id matched: " + tags[i]._id);
      return true;
    }
  }
  return false;
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
      var newTag = $("#nextTag").val();
      var createTag = true;
      var ideaTag;
      if (newTag != "") {
        //Check for duplicate tags
        Ideas.find({type: 'parent'}).forEach(function (post) {
            if (newTag == post.text) {
                createTag = false;
                ideaTag = post;
                console.log(ideaTag.text);
            }
        });
      } else {
        return;
      }


      //edit tags for ideas selected
      var color = getRandomColor();
      var question = Session.get("currentPrompt");
      //Add tag to ideas if not already there
      if (createTag) {
        ideaTag = {text: newTag,
            type: "parent",
            done: false, 
            color: color,
            user: Session.get("currentUser"),
            question_id: question['_id'],
            question: question['prompt']
        };
        ideaTag = Ideas.find({'_id': Ideas.insert(ideaTag)}).fetch()[0];
        console.log(ideaTag.text);
      }
      //Add tag to all selected ideas
      Ideas.find({type: 'child'}).forEach(function (post) {
          if (post.done) {
              if (!hasTag(post, ideaTag)) {
                //console.log("idea doesn't already have tag: " + ideaTag.text);
                Ideas.update(post._id, {$set: {done: false, 
                  tags: post.tags.concat(ideaTag)}});
              } else {
                Ideas.update(post._id, {$set: {done: false}});
              }
          }
      });
      //console.log(newTag);
      //reset entry box
      newTag = null;
        $('#nextTag').val("");
    },


    // when double click a tag, then delete the tag
    'dblclick button.tag': function() {
        var answer = confirm ("Do you want to delete the tag?");
        if (answer) {
          var tagCon = this.text;
          Ideas.find().forEach(function (post) {
              if (post.text == tagCon) {
                var tags = post.tags;
                for (var i=0; i<tags.length; i++) {
                  if (tags[i] === tagCon) {
                    tags.splice(i,1);
                  }
                }
                Ideas.update(post._id, {$set: {done: false, tags: tags, color: ""}});
              }
          });
          Ideas.remove(this._id);
        }
    },

     //when click tags, the ideas with this tag would show
    'click button.tag': function () {
        var tag = this;
        //Set the current tagtext to the value of the tag
        newTag = this.text;
        $("#nextTag").val(tag.text);
        Ideas.find({type: 'child'}).forEach(function (post) {
        console.log("checking tag: " + tag._id);
            if (!hasTag(post, tag)) {
              Ideas.update(post._id, {$set: {done: false}});
            } else {
              Ideas.update(post._id, {$set: {done: true}});
            }
        });
    },

    //toggle the select status of the clicked div
    'click div.clickable': function () {
      toggleIdea(this);
    },

    //Go to next state in app
    'click button.nextPage': function () {
      var currentPrompt = Session.get("currentPrompt");
      Router.go('JoinIdeasPage', {'_id': currentPrompt._id});
    },

});

})();
