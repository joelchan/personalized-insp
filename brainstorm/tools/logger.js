//Logging still needs refinement for logger instantiation and
//function scope

/********************************************************************
 * Configuring Pince logger to enable multi-level logging for 
 * system monitoring to console
 *******************************************************************/
//Set global message logging level
Logger.setLevel('trace');

EventLogger = (function () {
  return {
    /*****************************************************************
    * Global object for logging high level system events to database
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

  /** Notification Drawer Events**/
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
    },

    /** Notification events**/
    logSendExamples: function(notification){
      var msg = "Dashboard user sent examples";
      var user = notification.sender;
      misc = [{name: "sender", data: notification.sender._id},
              {name: "recipient", data: notification.recipient},
              {name: "type", data: notification.type},
              {name: "examples", data: notification.examples}];
      this.logEvent(msg, user, "notification", misc);
    },

    logChangePrompt: function(notification){
      console.log(notification);
      var msg = "Dashboard user changed prompt";
      var user = notification.sender;
      console.log(user);
      misc = [{name: "sender", data: notification.sender._id},
              {name: "recipient", data: notification.recipient},
              {name: "type", data: notification.type},
              {name: "prompt", data: notification.prompt}];
      this.logEvent(msg, user, "notification", misc);
    },

    logSendTheme: function(notification){
      var msg = "Dashboard user sent theme";
      var user = notification.sender;
      misc = [{name: "sender", data: notification.sender._id},
              {name: "recipient", data: notification.recipient},
              {name: "type", data: notification.type},
              {name: "theme", data: notification.theme}];
      this.logEvent(msg, user, "notification", misc);
    },

    logRequestHelp: function(notification){
      var msg = "Ideator requested help";
      var user = notification.sender;
      misc = [{name: "sender", data: notification.sender._id},
              {name: "recipient", data: notification.recipient},
              {name: "type", data: notification.type}];
      this.logEvent(msg, user, "notification", misc);
    },
  };
}());
  
