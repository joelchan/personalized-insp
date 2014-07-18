//Logging still needs refinement for logger instantiation and
//function scope

Logger = (function () {
  return {
    /*****************************************************************
    * Global object used to contain scope of all logging functionality
    ******************************************************************/
   
    logEvent: function(msg, user, type, misc) {
      /*
      *  log any event
      *   Input:
      *   msg - a string describing the event
      *   user - the user who generated the event
      *   type - the type/level of the event logged (default = info)
      *   misc - an array of objects to log where each object
      *         has 2 fields, name and data
      */ 
      var event;
      if (type) {
        event = new Event(msg, user._id, user.name, type);
      } else {
        event = new Event(msg, user._id, user.name, "info");
      }
      if (misc) {
        //Write all misc data fields into the event
        for (var i=0; i<misc.length; i++) {
          event[misc[i].name] = misc[i].data
        }
      }
      Events.insert(event);
    },
  
    logExpEvent: function(msg, part, type, misc) {
      /*
      *  log an event from an experiment. Similar to event log but
      *     handles extra fields for experiments
      *   Input:
      *   msg - a string describing the event
      *   type - the type/level of the event logged (default = info)
      *   part - a participant in the participant to associate
      *   misc - an array of objects to log where each object
      *         has 2 fields, name and data
      */ 
      if (!misc) {
        misc = []
      }
      if (!type) {
        type = "info"
      }
      //Push relevant participant fields into misc array
      misc.push({name: 'participantID', data: part._id});
      misc.push({name: 'expID', data: part.experimentID});
      //Retrieve user from participant fields
      user = MyUsers.findOne({_id: part.userID});
      //Log Event
      this.logEvent(msg, user, type, misc);
    },
   
    logParticipantLogin: function (participant) {
      var msg = "Participant logged into experiment";
      this.logExpEvent(msg, participant);
    },
   
    logDenyParticipation: function(user) {
      var msg = "User was denied participation in experiment";
      this.logExpEvent(msg, participant);
    },
   
    logConsent: function (participant) {
      var msg = "Participant consented to experiment";
      this.logExpEvent(msg, participant);
    },
   
    logBeginIdeation: function(participant) {
      var msg = "Participant began ideation";
      this.logExpEvent(msg, participant);
    },
   
    logIdeaSubmission: function(participant, ideaID) {
      var msg = "Participant submitted idea";
      misc = [{name: "ideaID", data: ideaID}];
      this.logExpEvent(msg, participant, "info", misc);
    },
   
    logEndIdeation: function(participant) {
      var msg = "Participant finished ideation";
      this.logExpEvent(msg, participant);
    },
   
    logExitStudy: function(participant) {
      var msg = "Participant exited study early";
      this.logExpEvent(msg, participant);
    },
   
    logSubmittedSurvey: function(participant, response) {
      var msg = "Participant submitted survey";
      misc = [{name: 'responseID', data: response._id}];
      this.logExpEvent(msg, participant, "info", misc);
    },

  /** Notifications **/
    logNotificationHandled: function(participant, notificationID){
      var msg = "Participant handled a notification";
      misc = [{name: "notificationID", data: notificationID}]
      this.logExpEvent(msg, participant, "info", misc);
    },
    
    logNotificationExpanded: function(participant, notificationID){
      var msg = "Participant expanded a notification";
      misc = [{name: "notificationID", data: notificationID}]
      this.logExpEvent(msg, participant, "info", misc);
    },

    logNotificationCollapsed: function(participant, notificationID){
      var msg = "Participant collapsed a notification";
      misc = [{name: "notificationID", data: notificationID}]
      this.logExpEvent(msg, participant, "info", misc);
    }
  };
}());
  
