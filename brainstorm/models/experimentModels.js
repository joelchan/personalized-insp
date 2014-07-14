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

Experiment = function () {
   /********************************************************************
   * Defines an brainstorming experiment
   *
   * @return {object} GroupTemplate object 
    ********************************************************************/
  
  this.creationTime = new Date();
  //Description of the experiment
  this.description = null;
  //Url to pass to participants 
  // **** Need to update *****
  this.url = Meteor.absoluteUrl() + 'LoginPage/';
  //List of all experimental conditions
  this.conditions = [];
  //Tracks group references: key: condition.id, value: array of groupIDs
  this.groups = {};
  //Tracks all participant IDs assigned to the experiment
  this.participantIDs = [];
  //Optional set of users not allowed to participate
  this.excludeUsers = [];

};

Experiment.prototype.getUrl = function() {
  //this.url = Meteor.absoluteUrl() + 'Ideation/' + this._id;
  //console.log(this.url);
  //console.log('getting url');
  return Meteor.absoluteUrl() + 'LoginPage/' + this._id;
};

//Experiment.prototype.setNumGroups = function(num) {
  /******************************************************************
  * sets all experimental conditions to have the same number of groups
  ******************************************************************/
  //for (var i=0; i<this.conditions.length; i++) {
    //this.conditions[i].groupNum = num;
    //console.log("adding group for condition:");
    //console.log(this.conditions[i]);
    //INitialize empty groups for each condition
    //var groups = [];
    //for (var i=0; i<; j++) {
        //var newGroup = new Group(this.conditions[i].groupTemplate);
        //Groups.insert(newGroup);
      //groups.push(newGroup);
    //}
    //this.groups[this.conditions[i].id] = groups
  //}
//};

ExperimentManager = (function () {
  /****************************************************************
  * Object that allows for most experiment manipulations including 
  *   assignment, creation, and modification
  ****************************************************************/
  return {

    initGroupRefs: function(exp) {
      /***********************************************************
      * Initialize object fields for each condition with empty 
      * arrays to contain the groupIDs assigned to that condition
      ***********************************************************/
      for (var i=0; i<exp.conditions.length; i++) {
        exp.groups[exp.conditions[i].id] = [];
      }
      //Update initialized groups to db
      Experiments.update({_id: exp._id},
          {$set: {groups: exp.groups}});
    },

    setNumGroups: function(exp, num) {
      /******************************************************************
      * sets all experimental conditions to have the same number of groups
      ******************************************************************/
      for (var i=0; i<exp.conditions.length; i++) {
        exp.conditions[i].groupNum = num;
        //console.log("adding group for condition:");
        //console.log(this.conditions[i]);
        //INitialize empty groups for each condition
        //var groups = [];
        //for (var i=0; i<; j++) {
            //var newGroup = new Group(this.conditions[i].groupTemplate);
            //Groups.insert(newGroup);
          //groups.push(newGroup);
        //}
        //this.groups[this.conditions[i].id] = groups
      }
    },

    getRandomCondition: function(exp) {
        /****************************************************************
        * Create an array with length queal to number of slots reamining
        * in the experiment and the value of the slot equal to the 
        * index of its associated condition
        ****************************************************************/
        //Create an array with length = number of slot
        var slots = [];
        for (var i=0; i<exp.conditions.length; i++) {
          //Determin number of participants expected - number already 
          //  assigned and completed
          var numPart = exp.conditions[i].groupNum -
              Participants.find({experimentID: exp._id, 
                  conditionID: exp.conditions[i]._id,
                  hasFinished: true}).count();
          //numPart may be negative if overrecruiting for experiment
          console.log("number of particiapants finished in cond: " + numPart);
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
    },

    getExpGroup: function(exp, condition) {
        var openGroups = [];
        var numSlots = 0;
        //Find all groups with open slots
        for (var i=0; i<exp.groups[condition.id].length; i++) {
            var groupID = exp.groups[condition.id][i];
            var group = Groups.findOne({_id: groupID});
            if (group.isOpen) {
              openGroups.push(group);
              numSlots += GroupManager.numOpenSlots(group);
            }
            //console.log(openGroups);
        }
        if (openGroups.length == 0) {
          //If no open groups, then create a group
          var newGroup = GroupManager.createGroup(condition.groupTemplate);
          //Register groupID with experiment condition
          exp.groups[condition.id].push(newGroup._id);
          Experiments.update({_id: exp._id},
              {$set: {groups: exp.groups}});
          console.log("created new group");
          return newGroup;
        } else {
          //Otherwise select a random group
          //Ignore open slots for now
          console.log("retrieved existing group");
          return getRandomElement(openGroups);
        }
    },

    addExperimentParticipant: function (exp, user) {
      //Look for duplicate participant with same userID and expID
      var part = Participants.findOne({userID: user._id, experimentID: exp._id});
      if (part) {
        console.log("repeat participant");
        return part;
      } else {
        //Create new participant if no duplicates found
        var cond = this.getRandomCondition(exp);
        var group = this.getExpGroup(exp, cond);
        var role = GroupManager.addUser(group, user);
        var part = new Participant(exp, user, cond, group, role);
        part._id = Participants.insert(part);
        exp.participantIDs.push(part._id);
        Experiments.update({_id: exp._id}, {$push: {participantIDs: part._id}});
        console.log("Added new participant, total: " + exp.participantIDs.length)
        return part;
      }
    },
   
    canParticipate: function (exp, userName) {
      if (exp.excludeUsers === undefined) {
        return true;
      }
      //checks if user is on list of prohibitied users
      for (var i=0; i<exp.excludeUsers.length; i++) {
        if (exp.excludeUsers[i] == userName) {
            return false;
        }
      }
      //checks if user is on list of current participants marked as finished
      var part = Participants.findOne({userName: userName, experimentID: exp._id});
      if (part) {
        if (part.hasFinished) {
          return false;
        } else {
          return true;
        }
      } 
      //for (var i=0; i<exp.participantIDs.length; i++) {
          //if (exp.participantIDs[i].userName == userName) {
              //if (exp.participantIDs[i].isFinished) {
                //console.log("repeat participant has finished already");
                //return false;
              //}
          //}
      //}
      return true;
    }

  };
}());

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
  for (var i=0; i<exp.participantIDs.length; i++) {
      if (exp.participants[i].userName == userName) {
          if (exp.participants[i].isFinished) {
            console.log("repeat participant has finished already");
            return false;
          }
      }
  }
  return true;
}


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
