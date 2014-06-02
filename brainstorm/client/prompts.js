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
      //var newPrompt = new Prompt(newQuestion, 'Active', user)
      newPrompt.addParticipant('test');
      console.log(newPrompt);
      Prompts.insert({'prompt': newPrompt});

      var currentPrompt = Prompts.find({'prompt': newPrompt}).fetch();

      Session.set("currentPrompt", currentPrompt[0]);
      Router.go('IdeationPage', {'_id': currentPrompt[0]._id});
      $('#newPromptModal').modal('hide');
    },

    'click div.clickable': function () {
      // Set the current prompt
      var prompt = Prompts.find({'_id': this._id}).fetch();
      if (prompt.length > 0) {
        Session.set("currentPrompt", prompt[0]);
        //prompt[0].prompt.addParticipant("test");
        Router.go('IdeationPage', {'_id': prompt[0]._id});

        //console.log();
      }
    },

});
