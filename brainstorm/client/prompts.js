/********************************************************************
 * Return the list of all prompts
 * *****************************************************************/
Template.PromptPage.prompts = function() {
  return Prompts.find();
};

/********************************************************************
 * Template function returning a boolean if there is a logged in user
 * *****************************************************************/
Template.PromptPage.events({
    'click button.nextPage': function () {
        //Go to next page
    },

    'click button.new-bs': function () {
        //Create Modal for creating a new prompt 
        //$('#newPromptModal').modal('toggle');
        
    },

    'click button.createPrompt': function () {
      //Add a prompt to the database 
      var newQuestion = $("input#prompt-text").val();
      var user;
      if (Session.get("currentUser")) {
        user = [Session.get("currentUser")['name'],];
      } else {
        user = [];
      }
      var newPrompt = Prompts.insert({'prompt': newQuestion,
          'status': 'Active',
          'members': user});
      Session.set("currentState", 'IdeationPage');
      Session.set("currentPrompt", Prompts.find({'_id': newPrompt})[0]);
      $('#newPromptModal').modal('hide');
    },

    'click div.clickable': function () {
      // Set the current prompt
      var question = Prompts.find({'_id': this._id}).fetch();
      if (question.length > 0) {
        //question = question[0]['prompt'];
        Session.set("currentPrompt", question[0]);
        Prompts.update(this._id, {$set: {members: this.members.concat(Session.get("currentUser")['name'])}});
        Session.set("currentState", 'IdeationPage');
      }
    },

});
