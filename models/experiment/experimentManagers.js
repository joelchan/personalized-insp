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

    createExp: function(promptID) {
      /**************************************************************
       * Create a new experiment
       * @Params
       *    promptID - id of the prompt for the experiment
       * @Return
       *    boolean - true if successful creation of experiment
       * ***********************************************************/
       logger.trace("Beginning ExperimentManager.createExp");
       if (promptID) {
         logger.trace("Creating new experiment object for prompt: " + promptID);
         var exp = new Experiment(promptID);
         expID = Experiments.insert(exp);
         if (expID) {
           logger.trace("Successfully created new experiment with id " + expID);
           
           // create URL for participants to login
           url = this.setExpURL(expID);
           logger.trace("Crowd can login at " + url);
           
           // create experimental conditions
           // parameters are currently hard-coded
           var control = this.createExpCond(expID, promptID, "Control", 25);
           var treatment = this.createExpCond(expID, promptID, "Treatment", 25);
           Experiments.update({_id: expID},
            {$set: {conditions: [control,treatment]}});
           
           // initialize group references
           this.initGroupRefs(Experiments.findOne({_id: expID}));

         return true;
        } else {
         return false
        } 
       } else {
        logger.debug("No promptID provided, can't create experiment");
       }
    },

    setExpURL: function(expID) {
        /**************************************************************
       * Generate and set a URL for participants to login to the experiment
       * ***********************************************************/
       url = Meteor.absoluteUrl() + 'crowd/Ideate/Login/' + expID;
       Experiments.update({_id: expID},
            {$set: {url: url}});
       return url
    },

    createExpCond: function(expID, promptID, desc, partNum) {
        /**************************************************************
       * Create a new experimental condition
       * @Params
       *    expID (string) - id of the experiment
       *    promptID (string) - id of the prompt for the experiment
       *    desc (string) - name of hte condition
       *    partNum (int) - number of participant slots in the condition
       * @Return
       *    boolean - true if successful creation of experiment
       * ***********************************************************/
        var newCond = new ExpCondition(expID, promptID, desc, partNum);
        newCond.assignedParts = [];
        newCond.completedParts = [];
        // logger.trace("Created group template: " + JSON.stringify(groupTemplate));
        // newCond.groupTemplate = groupTemplate;
        var newCondID = Conditions.insert(newCond);
        newCond._id = newCondID;
        return newCond;
    },

    getUsersInCond: function(exp, condName) {
       /**************************************************************
       * Convenience function to get all userIDs assigned to a
       * given condition
       * @Params
       *    expID (object) - experiment object
       *    condName (string) - natural-language label of the exp condition
       * @Return
       *    userIDs - list of userIDs assigned to the condition
       * ***********************************************************/
       var cond = Conditions.findOne({expID: exp._id, description: condName});
       logger.trace("Found cond: " + JSON.stringify(cond));
       // exp.conditions.forEach(function(c) {
       //  if (c.description == "Treatment") {
       //    condID = c._id;
       //    break;
       //  }
       // });
       // var cond = Conditions.findOne({_id: condID});
       var partIDs = cond.assignedParts;
       var participants = Participants.find({_id: {$in: partIDs}}).fetch();
       var userIDs = []
       participants.forEach(function(p) {
        logger.trace("Participant " + JSON.stringify(p));
        logger.trace("PartID " + p._id + ": UserID " + p.userID);
        userIDs.push(p.userID);
       });
       return userIDs;
    },

    initGroupRefs: function(exp) {
      /***********************************************************
      * Initialize object fields for each condition with empty 
      * arrays to contain the groupIDs assigned to that condition
      ***********************************************************/
      for (var i=0; i<exp.conditions.length; i++) {
        logger.trace("Initializing group refs for " + exp.conditions[i].description + " condition");
        exp.groups[exp.conditions[i].description] = []; //we will trace assignment by the condition's name
      }
      logger.trace("Experiment groups: " + JSON.stringify(exp.groups));
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
        * Get a random condition from the experiment
        * Probably of sampling a condition should be inversely proportional
        * to the number of completed participants
        * should return cond id
        ****************************************************************/
        //Create an array with length = number of slot
        var slots = [];
        var unlimitedRecruitment;
        var randCond;

        if (exp.conditions[0].partNum == -1) {
            unlimitedRecruitment = true;
            logger.debug("Experiment has no recruitment limit");
            randCond = getRandomElement(exp.conditions);
            logger.trace("Randomly drew " + randCond.description + " condition");
            return randCond._id;
        } else {
            for (var i=0; i<exp.conditions.length; i++) {
              
              //Determin number of participants expected - number already 
              //  assigned and completed
              var numPartWanted = exp.conditions[i].partNum;
              var numPartCompleted = Conditions.findOne({_id: exp.conditions[i]._id}).completedParts.length;
              logger.debug(numPartWanted + " participants wanted for this condition, " + numPartCompleted + " completed the experiment");
              var numPart = numPartWanted - numPartCompleted;
              for (var j=0; j<numPart; j++) {
                slots.push(i);
              }  
            }
        }
        
        //Randomly assign to any condition if experiment is full
        if (slots.length == 0) {
            randCond = getRandomElement(exp.conditions);
            logger.trace("Randomly drew " + randCond.description + " condition");
            return randCond._id;
        } else {
            var condIndex = getRandomElement(slots);
            randCond = exp.conditions[condIndex];
            logger.trace("Randomly drew " + randCond.description + " condition");
            return randCond._id;    
        }
    },

    // not used at the moment
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
          logger.trace(newGroup);
          return getRandomElement(openGroups);
        }
    },

    addExperimentParticipant: function (exp, user) {
      //Look for duplicate participant with same userID and expID
      logger.trace("Adding user with id " + user._id + " as a participant");
      var part = Participants.findOne({userID: user._id, experimentID: exp._id});
      if (part) {
        console.log("repeat participant");
        return part;
      } else {
        //Create new participant if no duplicates found
        
        // assign to a condition
        var condID = this.getRandomCondition(exp);
        var groupID = Session.get("currentGroup")._id;
        var part = new Participant(exp._id, user._id, condID, groupID)
        part._id = Participants.insert(part);

        // log assignment to the experiment
        Experiments.update({_id: exp._id}, {$push: {participantIDs: part._id}});

        // log assignment to the condition in Conditions collection
        Conditions.update({_id: condID}, {$push: {assignedParts: part._id}});

        // log assignment to the group in the Experiments collection
        var groupAssignField = "groups." + groupID;
        Experiments.update({_id: exp._id}, {$set: {groupAssignField: condID}});

        logger.trace("Added new participant with id " + part._id);
        logger.trace("Experiment now has " + exp.participantIDs.length + " participants");
        
        // var group = this.getExpGroup(exp, cond);
        
        // var role = group.template.roles[0]; // grabbing the HCOMPIdeator role, which happens to be the first element
        // var role = GroupManager.addUser(group, user, role);
        // var part = new Participant(exp, user, cond, group, role);
        // part._id = Participants.insert(part);
        // exp.participantIDs.push(part._id);
        // Experiments.update({_id: exp._id}, {$push: {participantIDs: part._id}});
        // console.log("Added new participant, total: " + exp.participantIDs.length)
        return part;
      }
    },

    logParticipantCompletion: function(participant){
      Participants.update({_id: participant._id}, {$set: {hasFinished: true}});
      if (!isInList(participant._id, Conditions.findOne({_id: participant.conditionID}).completedParts)) {
        Conditions.update({_id: participant.conditionID}, {$push: {completedParts: participant._id}})
      }
      logger.trace("Logged experiment completion for participant");
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