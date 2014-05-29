Template.JoinIdeasPage.ideas = function () {
    return Ideas.find({question_id: Session.get("currentPrompt")['_id']});
    //var tags = Tags.find({question_id: Session.get("currentPrompt")['_id']});
        
    //var allitems = [];
    //ideas.forEach(function (idea) {
      //allitems = allitems.concat(idea.idea);
      //console.log(allitems.length);
    //});
    //tags.forEach(function (tag) {
      //allitems = allitems.concat(tag.tag);
      //console.log(tag.tag);
    //});

    //return ideas; 
};

Template.JoinIdeasPage.prompt = function () {
  if (Session.get("currentPrompt") === undefined) {
    console.log(Session.get("currentPrompt"));
    Router.go('PromptPage');
  } else {
    var currentPrompt = Session.get("currentPrompt").prompt;
    return currentPrompt.question;
  }
};

Template.JoinIdeasPage.rendered = function() {
    $(".draggable").draggable();
    $(".droppable").droppable();
};

Template.JoinIdeasPage.events({
    'click button.nextPage': function () {
       //Session.set("currentState", "LoginPage");
       Router.go('PromptPage')
    },
});
