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
// Holds baseline fluency data for participants
FluencyMeasures = new Meteor.Collection("fluencyMeasures");
// Defines synthesis subsets (partitions of the data to synthesize)
SynthSubsets = new Meteor.Collection("synthSubsets");

Experiment = function (promptID, desc) {
   /****************************************************************
    * Experiment object definition
    * @Params
    *   promptID (string) - id of prompt for the experimental condition
    *   desc (string, optional) - label for experiment
    ****************************************************************/
  //The time the experiment is created 
  this.creationTime = new Date().getTime();
  
  //Description of the experiment
  if (desc) {
    this.description = desc;
  } else {
    this.description = "unnamed experiment";
  }

  this.promptID = promptID;
  
  //Url to pass to participants
  this.url = null;
  
  //List of all experimental conditions
  //Each element is a copy of the condition object when first created
  this.conditions = [];

  this.participantIDs = [];
  
  //Tracks group references: key: condition.id, value: array of groupIDs
  this.groupID = null;

  //Optional set of users not allowed to participate
  this.excludeUsers = [];

};

ExpCondition = function(expID, promptID, desc, partNum) {
  /****************************************************************
    * Experimental condition object definition
    * @Params
    *   expID (string) - id of experiment the participant is a part of
    *   promptID (string) - id of prompt for the experimental condition
    *   desc (string) - natural language label for the expeirmental condition
    *   partNum (int, optional) - desired number of participants in the condition
    ****************************************************************/
// ExpCondition = function(expID, promptID, desc, groupNum) {
  //Unique ID (with respect to the experiment)
  // this.id = null;
  this.expID = expID;
  
  //Question(s) to answer in the brainstorm
  this.promptID = promptID
  // this.prompt = new Prompt(prompt);
  // this.prompt._id = Prompts.insert(this.prompt);
  
  //Description of the experiment
  this.description = desc;
  
  //Desired number of participants in the experiment condition
  if (partNum) {
      this.partNum = partNum;
  } else {
      //If no number is given, then -1 marks recruitment based size
      this.partNum = -1;
  }
  
  //List of participantIDs assigned to this condition
  this.assignedParts = [];

  //List of participantIDs for who has completed the experiment in this condition
  this.completedParts = [];

  this.readyParts = [];
  //Miscellaneous data associated with assignmnt
  this.misc;
};

ExpSynthSubset = function(ideaIDs, cond, exp) {
  this.users = [];
  this.ideaIDs = ideaIDs;
  this.condID = cond._id;
  this.condName = cond.description;
  this.expID = exp._id;

  // we can add a field called "data" when we create a subset, and put in
  // - size
  // - simMean
  // - simVar
  // - seed
}

Participant = function(expID, userID, condID, groupID) {
    /****************************************************************
    * Participant object definition
    * @Params
    *   expID (string) - id of experiment the participant is a part of
    *   userID (string) - id of user the participant is associated with
    *   condID (string) - id of condition the participant is assigned to
    *   condID (string) - id of condition the participant is assigned to
    ****************************************************************/
    this.experimentID = expID;
    this.userID = userID;
    this.userName = MyUsers.findOne({_id: userID}).name;
    // Assign Participant to condition
    this.conditionID = condID;
    this.groupID = groupID;
    // this.verifyCode = this.userID.hashCode();
    // don't need verify code anymore because we are using legiontools
    
    this.tutorialStarted = false;

    this.fluencyStarted = false;

    this.fluencyFinished = false;

    //Participants are not ready to begin by default
    this.isReady = false;

    this.hasStarted = false;

    this.exitedEarly = false;

    this.surveyStarted = false;

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

FluencyMeasure = function(answers, participant) {
  this.answers = answers;
  this.participant = participant;
}

QuestionResponse = function(question, answer) {
  this.question = question;
  this.answer = answer;
};
