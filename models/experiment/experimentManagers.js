// Configure logger for ExperimentManager
var logger = new Logger('Managers:Experiment');
// Comment out to use global logging level
Logger.setLevel('Managers:Experiment', 'trace');
//Logger.setLevel('Managers:Experiment', 'debug');
// Logger.setLevel('Managers:Experiment', 'info');
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
       logger.trace("Creating new experiment object");
       if (promptID) {
         var exp = new Experiment(promptID);
         expID = Experiments.insert(exp);
         url = Meteor.absoluteUrl() + 'crowd/Ideate/Login/' + expID;
         if (expID) {
           logger.trace("Successfully created new experiment with id " + expID);
           Experiments.update({_id: expID},
            {$set: {url: url}});
           // exp.setURL(expID);
           logger.trace("Crowd can login at " + url);

           // hard-code parameters for the experiment
           // i want to create n "slots" into which we can assign participants
           // when they are created and randomly assigned
           var control = new ExpCondition(expID, promptID, "Control", 25)
           controlID = Conditions.insert(control);
           control.id = controlID
           Conditions.update({_id: controlID},
            {$set: {id: controlID}});
           var treatment = new ExpCondition(expID, promptID, "Treatment", 25)
           treatmentID = Conditions.insert(treatment);
           treatment.id = treatmentID
           Conditions.update({_id: treatmentID},
            {$set: {id: treatmentID}});
           Experiments.update({_id: expID},
            {$set: {conditions: [control,treatment]}});
           this.initGroupRefs(Experiments.findOne({_id: expID}));
           // exp.conditions = ["Control","Treatment"]
           // exp.groupN = 25;
           // exp.partN = 25;

         return true;
        } else {
         return false
        } 
       } else {
        logger.debug("No promptID provided, can't create experiment");
       }
    },

    initGroupRefs: function(exp) {
      /***********************************************************
      * Initialize object fields for each condition with empty 
      * arrays to contain the groupIDs assigned to that condition
      ***********************************************************/
      logger.trace("Initializing group references");
      for (var i=0; i<exp.conditions.length; i++) {
        logger.trace("For " + exp.conditions[i].description + " condition");
        exp.groups[exp.conditions[i].id] = [];
      }
      logger.trace(exp.groups);
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
        logger.trace("Randomly assigned to " + exp.conditions[condIndex].description + " condition");
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
          var newGroup = GroupManager.create(condition.groupTemplate);
          //Register groupID with experiment condition
          exp.groups[condition.id].push(newGroup._id);
          Experiments.update({_id: exp._id},
              {$set: {groups: exp.groups}});
          logger.trace("created new group");
          logger.trace(newGroup);
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