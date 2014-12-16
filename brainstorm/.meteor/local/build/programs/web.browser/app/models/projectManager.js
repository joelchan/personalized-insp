(function(){// Configure logger for Tools
var logger = new Logger('Models:ProjectManager');
// Comment out to use global logging level
//Logger.setLevel('Models:ProjectManager', 'trace');
//Logger.setLevel('Models:ProjectManager', 'debug');
Logger.setLevel('Models:ProjectManager', 'info');
//Logger.setLevel('Models:ProjectManager', 'warn');


PromptManager  = (function() {
  return {
    create: function(question, template, title) {
      var newPrompt = new Prompt(question);
      //For now, just associate default group template with all prompts
      if (template) {
        newPrompt.template = template;
      } else {
        newPrompt.template = GroupManager.defaultTemplate;
      }
      //Store a shortened title
      if (title) {
        newPrompt.title = title;
      } else {
        newPrompt.title = question;
      }
      newPrompt._id = Prompts.insert(newPrompt);
      return newPrompt;
    },
    addGroups: function(prompt, groups) {
      /**************************************************************
       * Add a group to the given prompt
       * @Params:
       *    prompt: the prompt document to be updated
       *    groups: an array of groups to be added to the prompt
       *************************************************************/
      groups.forEach(function(group) {
        prompt.groupIDs.push(group._id);
        Prompts.update({_id: prompt._id}, 
          {$push: {groupIDs: group._id}});
        //Maybe eventually update group with prompt
        Groups.update({_id: group._id}, 
          {$addToSet: {promptIDs: prompt._id}});
      });
    },
    setTitle: function(prompt, title) {
      prompt.title = title;
      Prompts.update({_id: prompt._id}, {$set: {title: title}});
      return prompt;
    },
    addToGroup: function(prompt, user) {

    },
    setLength: function(prompt, time) {
      prompt.length = time;
      Prompts.update({_id: prompt._id}, 
        {$set: {length: time}});
    },
    hasLengthSet: function(prompt) {
      return (prompt.length > 0) ? true : false;
    },
    remove: function(prompts) {
      if (hasForEach(prompts)) {
        ids = getIDs(prompts);
        if (Meteor.isServer) {
          Prompts.remove({"_id": {$in: ids}}); 
        } else {
          ids.forEach(function(id) {
            Prompts.remove({"_id": id}); 
          });
        }
      } else {
        //prompts is just a single prompt object if not an array
        Prompts.remove({_id: prompts._id});  
      }
    }, 
  };
}());

})();