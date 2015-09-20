// Configure logger for ExperimentManager
var logger = new Logger('Managers:Experiment');
// Comment out to use global logging level
Logger.setLevel('Managers:Experiment', 'trace');
//Logger.setLevel('Managers:Experiment', 'debug');
// Logger.setLevel('Managers:Experiment', 'info');
// Logger.setLevel('Managers:Experiment', 'warn');

ExperimentManager = (function () {
  /****************************************************************
  * Object that allows for most experiment manipulations including 
  *   assignment, creation, and modification
  ****************************************************************/
  return {

    createExp: function(promptID, desc, numParts, IV1, IV2) {
      /**************************************************************
       * Create a new experiment
       * @Params
       *    promptID - id of the prompt for the experiment
       *    desc (string) - name of experiment
       *    numParts (int) - desired number of participants per condition
       *    IV1 (object) - an object that defines an independent variable
       *                   with 2 fields: 1) name, and 2) levels
       *    IV2 (object, optional) - a second IV definition
       * @Return
       *    expID - id of created experiment, false if unsuccessful
       * ***********************************************************/
       logger.trace("Beginning ExperimentManager.createExp");
       if (promptID) {
         logger.trace("Creating new experiment object for prompt: " + promptID);
         var exp = new Experiment(promptID);
         if (desc) {
          exp.description = desc
         }
         expID = Experiments.insert(exp);
         if (expID) {
           logger.trace("Successfully created new experiment with id " + expID);
           
           // create URL for participants to login
           url = this.setExpURL(expID);
           logger.trace("Crowd can login at " + url);
           
           // get experimental conditions
           var conditions = [];
           if (!IV2) {
            logger.debug("Simple one-way design");
            logger.trace("IV1 (" + IV1.name + ") with levels: " + JSON.stringify(IV1.levels));
            conditions = IV1.levels;
           } else {
            logger.debug("Two-way factorial"); // can extend later
            logger.trace("IV1 (" + IV1.name + ") with levels: " + JSON.stringify(IV1.levels));
            logger.trace("IV2 (" + IV2.name + ") with levels: " + JSON.stringify(IV2.levels));
            IV1.levels.forEach(function(IV1level) {
              IV2.levels.forEach(function(IV2level) {
                combo = IV1level + "-" + IV2level;
                conditions.push(combo);
              });
            });
           }

           logger.trace("Conditions to create: " + JSON.stringify(conditions));
           // create experimental conditions
           conditions.forEach(function(cond) {
            ExperimentManager.createExpCond(expID, promptID, cond, numParts);
           });
           // var control = this.createExpCond(expID, promptID, "Control", numParts);
           // var treatment = this.createExpCond(expID, promptID, "Treatment", numParts);
           // Experiments.update({_id: expID},
           //  {$set: {conditions: [control,treatment]}});
           
           // create a group for the experiment
           this.addExpGroup(Experiments.findOne({_id: expID}))

           // initialize group reference
           // this.initGroupRefs(Experiments.findOne({_id: expID}));

         return expID;
        } else {
         return false
        } 
       } else {
        logger.debug("No promptID provided, can't create experiment");
       }
    },

    initSynthExp: function(expID) {
       /**************************************************************
      * tag experiment as needing processing for synthesis
      * ***********************************************************/
      var exp = Experiments.findOne({_id: expID});
      logger.debug("Marking exp " + exp.description + " as a synthesis experiment for processing");
      Experiments.update(
        {_id: exp._id},
        {$set: {isSynthesis: true}}
      );
      Experiments.update(
        {_id: exp._id},
        {$set: {isProcessed: false}}
      );

    },
    
    initCondRoutes: function(condID, routeSequence) {
       /**************************************************************
      * tag experiment as needing processing for synthesis
      * @Params
      *     condID (str) - ID of the condition we want to process
      *     routeSequence (array) - array of route names - order matters!
      * ***********************************************************/
      var cond = Conditions.findOne({_id: condID});
      logger.debug("Updating route for condition " + cond.description +
        "with the route sequence " + JSON.stringify(routeSequence));
      Conditions.update({_id: cond._id},
                        {$set: {'misc.routeSequence': routeSequence}});

    },

    assignSynthSubset: function(partID, condID) {
       /**************************************************************
      * Randomly sample a subset from a condition and assign to participant
      * Need to figure out how to deal with the potential problem of unfinished subsets
      * @Params
      *     partID (str) - the condition object to process
      *     condID (array) - array of route names - order matters!
      * ***********************************************************/
      var part = Participants.findOne({_id: partID});
      if (part.misc) {
        if (part.misc.subsetID) {
          logger.debug("Already has a subset assigned. Doing nothing");
        } 
      } else {
        logger.debug("Assigning a new subset");
        var cond = Conditions.findOne({_id: condID});
        var availableSubsets = SynthSubsets.find({condID: condID, users: []}).fetch();
        logger.debug(availableSubsets.length + " available out of " + cond.misc.subsetIDs.length + " total subsets in this condition ");
        var subset = getRandomElement(availableSubsets);
        logger.trace("Assigning subset with id " + subset._id + " to participant");
        Participants.update({_id: part._id}, {$set: {'misc.subsetID': subset._id}});
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
        newCond.readyParts = [];
        if (desc == "Treatment") {
          newCond.misc.routeSequence = conditionRouteData.IdeationTreatment;
        } else if (desc == "Control") {
          newCond.misc.routeSequence = conditionRouteData.IdeationControl;
        } else if (isInList(desc, pInspConds)) {
          newCond.misc.routeSequence = conditionRouteData.PInsp;
        } else {
          newCond.misc.routeSequence = conditionRouteData.Synthesis;
        }
        logger.trace("New condition created: " + JSON.stringify(newCond));
        // logger.trace("Created group template: " + JSON.stringify(groupTemplate));
        // newCond.groupTemplate = groupTemplate;
        var newCondID = Conditions.insert(newCond);
        newCond._id = newCondID;
        Experiments.update({_id: expID},
            {$addToSet: {conditions: newCond}});
        // if (desc == "Treatment") {
        //   ExperimentManager.initCondRoutes(newCondID, conditionRouteData.IdeationTreatment);
        // } else if (desc == "Control") {
        //   ExperimentManager.initCondRoutes(newCondID, conditionRouteData.IdeationControl);
        // } else if (isInList(desc, pInspConds)) {
        //   ExperimentManager.initCondRoutes(newCondID, conditionRouteData.pInspConds);
        // } else {
        //   ExperimentManager.initCondRoutes(newCondID, conditionRouteData.Synthesis);
        // }
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
      * NOW DEPRECATED
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

    addExpGroup: function(exp) {
      var prompt = Prompts.findOne({_id: exp.promptID});
      logger.trace("Found prompt for experiment with id " + prompt._id + 
        ", current groups: " + JSON.stringify(prompt.groupIDs));
      var group;
      if (prompt.template != null) {
        group = GroupManager.create(prompt.template);
      } else {
        logger.debug("No group template, creating new group with default template");
        var template = GroupManager.defaultTemplate();
        group = GroupManager.create(template);
      }
      logger.trace("Created new group for experiment: " + JSON.stringify(group));
      PromptManager.addGroups(prompt, group);
      logger.trace("Added group to prompt. Current groups are now: " + 
        JSON.stringify(Prompts.findOne({_id: exp.promptID}).groupIDs));
      Experiments.update({_id: exp._id},
        {$set: {groupID: group._id}});
      logger.trace("Added groupID to exp: " + Experiments.findOne({_id: exp._id}).groupID);
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

    getChosenCondition: function(exp, condName) {
      /****************************************************************
        * Get a chosen condition from the experiment 
        * (matching given condName param)
        * should return cond id
        ****************************************************************/      
      logger.debug("Assigning to chosen condition: " + condName);
      var condID = "";
      exp.conditions.forEach(function(cond) {
        if (cond.description == condName) {
          condID = cond._id;
          logger.trace("Matching condition id: " + condID);
        }
      });
      return condID;
    },

    getRandomCondition: function(exp) {
        /****************************************************************
        * Get a random condition from the experiment
        * Probably of sampling a condition is inversely proportional
        * to the number of assigned participants
        * should return cond id
        ****************************************************************/
        //Create an array with length = number of slot
        // var slots = [];
        var unlimitedRecruitment;
        var randCond;
        var cutOffs = [];
        var wantedRecruits = [];

        if (exp.conditions[0].partNum == -1) {
            unlimitedRecruitment = true;
            logger.debug("Experiment has no recruitment limit");
            randCond = getRandomElement(exp.conditions);
            logger.trace("Randomly drew " + randCond.description + " condition");
            return randCond._id;
        } else {

            for (var i=0; i<exp.conditions.length; i++) {
              
              //Determin number of participants expected - number already 
              //  assigned
              var cond = Conditions.findOne({_id: exp.conditions[i]._id})
              var numPartWanted = exp.conditions[i].partNum; // desired number of participants
              var numPartAssigned = cond.assignedParts.length; // number of participants currently assigned
              // var numPartAssigned = cond.completedParts.length; // number of participants currently assigned
              logger.debug(numPartWanted + " participants wanted for " + cond.description + " condition, " + numPartAssigned + " assigned so far");
              
              // Square the number to heavily bias in favor conditions with fewer assigned participants
              var numToRecruit = numPartWanted - numPartAssigned;
              wantedRecruits.push(numToRecruit);
              logger.debug("Need to recruit " + numToRecruit + " for " + cond.description);
              var thisCutOff = Math.pow(numToRecruit,3); // this is the width between each point on the number line
              // Construct the sampling space
              // Each element in cutOffs is a condition
              if (cutOffs.length == 0) {
                logger.trace("Cutoff for " + cond.description + ": " + thisCutOff);
                cutOffs.push(thisCutOff);  
              } else {
                // var priorCutOff = cutOffs[0]; // need to edit this to generalize beyond two conditions
                // for (var j=1; j<cutOffs.length; j++) {
                //   // logger.trace("priorCutOff = " + priorCutOff);
                //   priorCutOff += cutOffs[j];
                // }
                // thisCutOff += priorCutOff
                // logger.trace("Cutoff for " + cond.description + ": " + thisCutOff);
                cutOffs.push(thisCutOff + cutOffs[cutOffs.length-1]);
              }
            }
            logger.trace("Number line is :" + JSON.stringify(cutOffs));
            var max = cutOffs[cutOffs.length-1]
            if (max <= 0) {
              logger.debug("Conditions are both full, randomly sampling smaller condition");
              var condIndex = _.indexOf(wantedRecruits,_.max(wantedRecruits));
              logger.trace("Drawing from wantedRecruits: " + JSON.stringify(wantedRecruits));
              logger.debug("Drew condition index: " + condIndex);
              randCond = exp.conditions[condIndex];
              logger.trace("Randomly drew " + randCond.description + " condition");
              return randCond._id;    
              // reconstruct numberline
              // cutOffs = [];
              // for (var i=0; i<exp.conditions.length; i++) {
              //   var numWantedFull = exp.conditions[i].partNum; // desired number of participants
              //   thisCutOff = Math.pow(numWantedFull,3);
              //   if (cutOffs.length == 0) {
              //     logger.trace("Cutoff for " + cond.description + ": " + thisCutOff);
              //     cutOffs.push(thisCutOff);  
              //   } else {
              //     cutOffs.push(thisCutOff + cutOffs[cutOffs.length-1]);
              //   }
              // }
              // max = cutOffs[cutOffs.length-1]
            }

            // for logging
            for (var i=0; i<cutOffs.length; i++) {
              if (i==0) {
                var p = cutOffs[i]/max;
              } else {
                var p = (cutOffs[i]-cutOffs[i-1])/max;
              }
              var cName = exp.conditions[i].description;
              logger.trace("Probability of sampling " + cName + ": " + p);
            }
        }
        
        // Randomly assign to any condition if experiment is full
        if (cutOffs.length == 0) {
            randCond = getRandomElement(exp.conditions);
            logger.trace("Randomly drew " + randCond.description + " condition");
            return randCond._id;
        } else {

            // Define the sample space to draw from
            logger.trace("Max for sample is " + max);
            
            // Randomly sample a number
            var sample = Math.random() * (max-1) + 1;
            logger.trace("Drew random sample: " + sample);
            
            // Sample a condition
            var condIndex = 0;
            for (var i=0; i<cutOffs.length; i++) {
              logger.trace("Comparing sample to cutoff: " + cutOffs[i]);
              if (sample <= cutOffs[i]) {
                logger.trace("Sample of " + sample + " is less than cutoff " + cutOffs[i]);
                condIndex = i;
                break;
              } 
            }
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
        // var condID = this.getChosenCondition(exp, "Treatment");
        var part = new Participant(exp._id, user._id, condID, exp.groupID)
        part._id = Participants.insert(part);

        // log assignment to the experiment
        Experiments.update({_id: exp._id}, {$push: {participantIDs: part._id}});

        // log assignment to the condition in Conditions collection
        Conditions.update({_id: condID}, {$push: {assignedParts: part._id}});

        // log assignment to the group in the Experiments collection
        var groupAssignField = "groups." + exp.groupID;
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

    logParticipantReady: function(participant) {
       /**************************************************************
       * Mark a participant as ready to proceed from tutorial and
       * begin experiment
       * @Params
       *    participant (object) - the participant
       * @Return
       *    boolean - true if successful
       * ***********************************************************/
       Participants.update({_id: participant._id}, {$set: {isReady: true}});
       var cond = Conditions.findOne({_id: participant.conditionID});
       if (!isInList(participant._id, cond.readyParts)) {
        Conditions.update({_id: participant.conditionID}, {$push: {readyParts: participant._id}});
       }
       logger.trace("Logged participant ready for participant: " + participant._id);
    },
   
    canParticipate: function (exp, userName) {
      if (exp.excludeUsers === undefined) {
        return true;
      }
      //checks if user is on list of prohibitied users
      for (var i=0; i<exp.excludeUsers.length; i++) {
        if (exp.excludeUsers[i] == userName) {
            EventLogger.logDenyParticipation();
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
    },

    addExcludeUsers: function(expID, userNames) {
      var currentExclusions = Experiments.findOne({_id: expID}).excludeUsers;
      userNames.forEach(function(userName) {
        if (!isInList(userName, currentExclusions)) {
          Experiments.update({_id: expID}, 
          {$push: {excludeUsers: userName}});  
        }
      });
    },

    removeExcludeUsers: function(expID, userNames) {
      userNames.forEach(function(userName) {
        Experiments.update({_id: expID}, 
          {$pull: {excludeUsers: userName}});
      });
    },

  };
}());
