/********************************************************************
Group Brainstorming experiment related data models
********************************************************************/
//Holds list of experiments with metadata
Experiments = new Meteor.Collection("experiments");
// Logs user experiment consent
Consents = new Meteor.Collection("consents");
// Logs all participants in experiments
Participants = new Meteor.Collection("participants");
// Holds response to a experiment surveys
SurveyResponses = new Meteor.Collection("surveyResponses");

Experiment = function () {
   /********************************************************************
   * Defines an brainstorming experiment
   *
   * @return {object} GroupTemplate object 
    ********************************************************************/
  
  this.creationTime = new Date().getTime();
  //Description of the experiment
  this.description = null;
  //Url to pass to participants 
  // **** Need to update *****
  this.url = Meteor.absoluteUrl() + 'LoginPage/';
  //List of all experimental conditions
  this.conditions = [];
  //Tracks group references: key: condition, value: array of groups
  this.groups = {};
  //Tracks all participants in the experiment
  this.participants = [];
  //Optional set of users not allowed to participate
  this.excludeUsers = [];

};

Experiment.prototype.getUrl = function() {
  //this.url = Meteor.absoluteUrl() + 'Ideation/' + this._id;
  //console.log(this.url);
  //console.log('getting url');
  return Meteor.absoluteUrl() + 'LoginPage/' + this._id;
};

Experiment.prototype.setNumGroups = function(num) {
  /******************************************************************
  * sets all experimental conditions to have the same number of groups
  ******************************************************************/
  for (var i=0; i<this.conditions.length; i++) {
    this.conditions[i].groupNum = num;
    //console.log("adding group for condition:");
    //console.log(this.conditions[i]);
    //INitialize empty groups for each condition
    var groups = [];
    for (var j=0; j<num; j++) {
        var newGroup = new Group(this.conditions[i].groupTemplate);
        Groups.insert(newGroup);
      groups.push(newGroup);
    }
    this.groups[this.conditions[i].id] = groups
  }
};

getRandomCondition = function(exp) {
    /****************************************************************
    * Create an array with length queal to number of slots reamining
    * in the experiment and the value of the slot equal to the 
    * index of its associated condition
    ****************************************************************/
    //Create an array with length = number of slot
    var slots = [];
    for (var i=0; i<exp.conditions.length; i++) {
      //For now I'm assuming a groupsize of 1
      //Determin number of participants expected - number already assigned
      var numPart = exp.conditions[i].groupNum -
          Participants.find({experimentID: exp._id, 
              condition: exp.conditions[i]}).count();
      for (var j=0; j<numPart; j++) {
          slots.push(i);
      }
    }
    //Randomly assign to any condition if experiment is full
    if (slots.length == 0) {
        return getRandomElement(exp.conditions);
    }
    var condIndex = getRandomElement(slots);
    return exp.conditions[condIndex];
};

getExpGroup = function(exp, condition) {
    var openGroups = [];
    var numSlots = 0;
    //Find all groups with open slots
    for (var i=0; i<exp.groups[condition.id].length; i++) {
        var group = $.extend(new Group(), 
            exp.groups[condition.id][i]
            );
        var groupOpenSlots = group.numSlots();
        if (groupOpenSlots > 0) {
            openGroups.push(exp.groups[condition.id][i]);
            numSlots += groupOpenSlots;
        }
    }
    //Ignore open slots for now
    var result = getRandomElement(openGroups);

    return $.extend(true, new Group(), result);
};

addExperimentParticipant = function (exp, user) {
  //Check for duplicate users in list of current participants
  for (var i=0; i<exp.participants.length; i++) {
      if (exp.participants[i].userID == user._id) {
          console.log("repeat participant");
          return exp.participants[i]
      }
  }
  //Create new participant if no duplicates found
  var cond = getRandomCondition(exp);
  var group = getExpGroup(exp, cond);
  var role = group.addUser(user);
  var part = new Participant(exp, user, cond, group, role);
  part._id = Participants.insert(part);
  exp.participants.push(part);
  Experiments.update({_id: exp._id}, {$push: {participants: part}});
  console.log("# participants: " + exp.participants.length)
  return part;
}

canParticipate = function (exp, userName) {
  if (exp.excludeUsers === undefined) {
    return true;
  }
  //checks if user is on list of prohibitied users
  for (var i=0; i<exp.excludeUsers.length; i++) {
    if (exp.excludeUsers[i] == userName) {
        return false
    }
  }
  //checks if user is on list of current participants marked as finished
  for (var i=0; i<exp.participants.length; i++) {
      if (exp.participants[i].userName == userName) {
          if (exp.participants[i].isFinished) {
            console.log("repeat participant has finished already");
            return false;
          }
      }
  }
  return true;
}


ExpCondition = function(id, prompt, desc, groupNum) {
  //Unique ID (with respect to the experiment)
  this.id = id;
  //Question(s) to answer in the brainstorm
  this.prompt = new Prompt(prompt);
  this.prompt._id = Prompts.insert(this.prompt);
  //Description of the experiment
  this.description = desc;
  //Number of groups in the experiment
  if (groupNum) {
      this.groupNum = groupNum;
  } else {
      this.groupNum = 1;
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
    this.condition = cond;
    this.group = group._id;
    this.role = Roles.findOne(role.role);
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
