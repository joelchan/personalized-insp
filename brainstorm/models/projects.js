// Configure logger for Tools
var logger = new Logger('Models:Project');
// Comment out to use global logging level
//Logger.setLevel('Models:Project', 'trace');
//Logger.setLevel('Models:Project', 'debug');
//Logger.setLevel('Models:Project', 'info');
//Logger.setLevel('Models:Project', 'warn');

Prompts = new Meteor.Collection("prompts");

Prompt = function(question, template, exp, cond) {
  /********************************************************************
   * Constructor that defines a brainstorming prompt/question
   * @Params
   *    question - A string containing the brainstorming prompt/subject
   *    template - (Optional) Group Template associated with groups
   *        responding to this prompt
   *    exp      - (Optional) The experiment associated with this prompt
   *    cond     - (Optional) The experiment condition associated with 
   *        this prompt
   *
   * @return {object} Prompt object 
  ********************************************************************/
  this.question = question;
  // Temporary modifications to prompt to quickly associate with an experiment
  if (template) {
    this.template = template;
  }
  if (exp) {
    this.expID = exp._id;
  }
  if (cond) {
    this.condID = cond._id;
  }
};

