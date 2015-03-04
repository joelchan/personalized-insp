// Configure logger for Tools
var logger = new Logger('Models:Project');
// Comment out to use global logging level
//Logger.setLevel('Models:Project', 'trace');
//Logger.setLevel('Models:Project', 'debug');
//Logger.setLevel('Models:Project', 'info');
//Logger.setLevel('Models:Project', 'warn');

Prompts = new Meteor.Collection("prompts");

Prompt = function(question, user, template, title, exp, cond) {
  /********************************************************************
   * Constructor that defines a brainstorming prompt/question
   * @Params
   *    question - A string containing the brainstorming prompt/subject
   *    user     - The user who creates the prompt
   *    template - (Optional) Group Template associated with groups
   *        responding to this prompt
   *    exp      - (Optional) The experiment associated with this prompt
   *    cond     - (Optional) The experiment condition associated with 
   *        this prompt
   *
   * @return {object} Prompt object 
  ********************************************************************/
  this.question = question;
  //The time the prompt is created
  this.time = new Date().getTime();
  //Users working on the prompt
  if (user) {
  this.userIDs = [user._id];
  } else {
    this.userIDs = Session.get("currentUser");
    if (user) {
      this.userIDs = [user._id];
    } else {
      this.userIDs = null;
    }
  }
  //Groups working on the prompt
  this.groupIDs = [];
  this.template = template;
  this.title = title;
  this.promptIDs = [];
  // Temporary modifications to prompt to quickly associate with an experiment
  if (exp) {
    this.expID = exp._id;
  }
  if (cond) {
    this.condID = cond._id;
  }
  this.length = -1;
  //Stores optional time of brainstorm
};

