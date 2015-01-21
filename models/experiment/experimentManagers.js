// Configure logger for ExperimentManager
var logger = new Logger('Managers:Experiment');
// Comment out to use global logging level
//Logger.setLevel('Managers:Experiment', 'trace');
//Logger.setLevel('Managers:Experiment', 'debug');
Logger.setLevel('Managers:Experiment', 'info');
//Logger.setLevel('Managers:Experiment', 'warn');

ExperimentManager = (function () {
  /****************************************************************
  * Object that allows for most experiment manipulations including 
  *   assignment, creation, and modification
  ****************************************************************/
  return {

    create: function(promptID) {
      /**************************************************************
       * Create a new experiment
       * @Params
       *    promptID - id of the prompt for the experiment
       * @Return
       *    boolean - true if successful creation of experiment
       * ***********************************************************/
       logger.trace("Beginning ExperimentManager.create");
       /*****************   Stub code *******************************/
       logger.trace("Creating new experiment object");
       var exp = new Experiment(promptID);
       expID = Experiments.insert(exp);
       logger.trace("Successfully created new experiment with id " + expID);
       logger.trace("Crowd can login at " + exp.url);
      /*****************   End Stub code ***************************/
    }

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