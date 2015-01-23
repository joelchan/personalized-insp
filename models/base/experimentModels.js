/********************************************************************
Group Brainstorming experiment related data models
********************************************************************/
//Holds list of experiments with metadata
Experiments = new Meteor.Collection("experiments");
//Holds references to all conditions of all experiments
Conditions = new Meteor.Collection("exp-conditions");
// Logs user experiment consent
Consents = new Meteor.Collection("consents");
// Logs all participants in experiments
Participants = new Meteor.Collection("participants");
// Holds response to a experiment surveys
SurveyResponses = new Meteor.Collection("surveyResponses");

Experiment = function (promptID) {
   /********************************************************************
   * Defines a brainstorming experiment
   *
   * @return {object} GroupTemplate object 
    ********************************************************************/
  
  this.creationTime = new Date();
  //Description of the experiment
  this.description = null;
  this.promptID = promptID;
  //Url to pass to participants 
  // **** Need to update *****
  this.url = Meteor.absoluteUrl() + 'crowd/Ideate/Login/' + promptID;
  //List of all experimental conditions
  this.conditions = [];
  //How many groups per condition
  this.groupN = 1;
  //How many participants per condition
  this.partN = 1;
  //Tracks group references: key: condition.id, value: array of groupIDs
  this.groups = {};
  //Tracks all participant IDs assigned to the experiment
  this.participantIDs = [];
  //Optional set of users not allowed to participate
  this.excludeUsers = [];

};

ExpCondition = function(id, expID, prompt, desc, groupNum) {
  //Unique ID (with respect to the experiment)
  this.id = id;
  this.expID = expID;
  //Question(s) to answer in the brainstorm
  this.prompt = new Prompt(prompt);
  this.prompt._id = Prompts.insert(this.prompt);
  //Description of the experiment
  this.description = desc;
  //Number of groups in the experiment condition
  if (groupNum) {
      this.groupNum = groupNum;
  } else {
      //If no number is given, then -1 marks recruitment based size
      this.groupNum = -1;
  }
  //Define the make-up of each group
  this.groupTemplate = new GroupTemplate();
  //Miscellaneous data associated with assignmnt
  this.misc;
};

Participant = function(exp, user, cond, group, role) {
    /****************************************************************
    * Initialize participant and perform complete random assignment
    ****************************************************************/
    this.experimentID = exp._id;
    this.userID = user._id;
    this.userName = user.name;
    // Assign Participant to condition
    this.conditionID = cond._id;
    this.groupID = group._id;
    this.role = Roles.findOne(role.roleID);
    this.verifyCode = this.userID.hashCode();
    //console.log("Participant verify code is: " + this.verifyCode);
    //Participants have not finished by default
    this.hasFinished = false;
};

Consent = function (participant) {
  /********************************************************************
  * Personal information captured by consent form
  *
  * @return {object} Consent object 
  ********************************************************************/
  this.participantID = participant._id;
  this.experimentID = participant.experimentID;
  this.datetime = new Date();
};

SurveyResponse = function(responses, participant) {
  this.responses = responses;
  this.participant = participant;
};

QuestionResponse = function(question, answer) {
  this.question = question;
  this.answer = answer;
};