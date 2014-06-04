/********************************************************************
 * Return the list of all prompts
 * *****************************************************************/
Template.ExpAdminPage.experiments = function() {
  return Experiments.find();
};

Template.ExpAdminPage.events({
  /********************************************************************
  * Template function returning a boolean if there is a logged in user
  * *****************************************************************/
    'click button.nextPage': function () {
        //Go to next page
    },

    'click button.new-exp': function () {
        //Create Modal for creating a new experiment
        //Toggling handled by bootstrap.js
        //$('#newPromptModal').modal('toggle');
        
    },

    'click button.createExperiment': function () {
      //Add a prompt to the database 
      var newQuestion = $("input#exp-prompt-text").val();
      var user;
      if (Session.get("currentUser")) {
        user = [Session.get("currentUser")['name'],];
      } else {
        user = [];
      }
      var newExp = new Experiment(newQuestion);
      //newPrompt.addParticipant('test');
      console.log(newExp);
      //Prompts.insert({'prompt': newPrompt});

      //var currentPrompt = Prompts.find({'prompt': newPrompt}).fetch();

      //Session.set("currentPrompt", currentPrompt[0]);
      //Router.go('IdeationPage', {'_id': currentPrompt[0]._id});
      $('#newExpModal').modal('hide');
    },

    'click div.clickable': function () {
      // Set the current prompt
      var experiment = Experiments.find({'_id': this._id}).fetch();
      if (prompt.length > 0) {
        //Session.set("currentPrompt", prompt[0]);
        //prompt[0].prompt.addParticipant("test");
        //Router.go('IdeationPage', {'_id': experiment[0]._id});

        //console.log();
      }
    },

});




