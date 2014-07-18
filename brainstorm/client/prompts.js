/********************************************************************
 * Return the list of all prompts
 * *****************************************************************/
Template.PromptPage.prompts = function() {
  return Prompts.find();
};

Template.PromptPage.rendered = function() {
  window.scrollTo(0,0);
}

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
      //Create a new Experiment with 1 condition and a default group template
      var newQuestion = $("input#prompt-text").val();
      var newPrompt = new Prompt(newQuestion);
      newPrompt._id = Prompts.insert(newPrompt);
      Session.set("currentPrompt", newPrompt);
///////////////////////////////////////////////////////////////////////
      var exp = new Experiment();
      exp.description = "Regular brainstorming activity"
      exp._id = Experiments.insert(exp);
      var cond1 = new ExpCondition(1,
          exp._id,
          newQuestion,
          "Brainstorming activity",
          100 
          );
      var template = GroupTemplates.findOne({isDefault: true});
      cond1.groupTemplate = template;
      cond1._id = Conditions.insert(cond1);
      exp.conditions = [cond1];
      Experiments.update({_id: exp._id},
          {$set: {conditions: exp.conditions}}
           );
      ExperimentManager.initGroupRefs(exp);
      Prompts.update({_id: newPrompt._id},
          {$set: {expID: exp._id, condID: cond1._id}}
          );

///////////////////////////////////////////////////////////////////////
      //Router.go('IdeationPage', {'_id': currentPrompt[0]._id});
      $('.modal').addClass('testclass');
    },

    'click div.clickable': function () {
      // Set the current prompt
      var prompt = Prompts.findOne({'_id': this._id});
      if (prompt) {
        Session.set("currentPrompt", prompt);
        //prompt[0].prompt.addParticipant("test");
        Router.go('IdeationPage');

        //console.log();
      }
    },

});
