//Logging still needs refinement for logger instantiation and
//function scope

/********************************************************************
 * Configuring Pince logger to enable multi-level logging for 
 * system monitoring to console
 *******************************************************************/
//Set global message logging level
Logger.setLevel('info');

// Configure logger for event logging 
var logger = new Logger('Tools:Logging');
// Comment out to use global logging level
Logger.setLevel('Tools:Logging', 'info');

EventLogger = (function () {
  return {
    /*****************************************************************
    * Global object for logging high level system events to database
    ******************************************************************/
    log: function(type, data) {
      /*
      *  log any event. If insufficient data is given, warning is
      *  logged, but does not throw error
      *   Input:
      *   type - the EventType associated with this event
      *   data - (Optional) the data to be associated with the event
      *       Specified as an object where only fieldNames specified
      *       in type are stored
      */ 
      //The current user is assumed to have generated the event
      var user = Session.get("currentUser");
      var event = new Event(type, user);
      //Index participantID and experimentID if experiment is set
      var exp = Session.get("currentExperiment");
      if (exp) {
        var part = Session.get("currentParticipant");
        event['participantID'] = part._id;
        event['expID'] = exp._id;
      }
        
      //Set each field specified in type
      if (type.fields) {
        type.fields.forEach(function(field) {
          if (data[field]) {
            event[field] = data[field];
          } else {
            logger.warn("Expected field \"" + field +
                "\" but no data given for that field");
          }
        });
      }
      //Insert into db
      event._id = Events.insert(event);
      return event;
    },

    remove: function(events) {
      /**************************************************************
       * Remove a set of logged events
       *    This is primarily to support tests and needs to eventually
       *    be secured.
       * @params
       *    events: an array or cursor of events to be removed
       * @return
       *    n/a
       *************************************************************/
      if (hasForEach(events)) {
        ids = getIDs(events); 
        if (Meteor.isServer) {
          Events.remove({_id: {$in: ids}});
        } else {
          events.forEach(function(event) {
            Events.remove({_id: event._id});
          });
        }
      } else {
        Events.remove({_id: events._id});
      }

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
      var type = EventTypeManager.get(msg);
      this.log(type);
    },
   
    logDenyParticipation: function(user) {
      var msg = "User was denied participation in experiment";
      var type = EventTypeManager.get(msg);
      this.log(type);
    },
   
    logConsent: function (participant) {
      var msg = "Participant consented to experiment";
      var type = EventTypeManager.get(msg);
      this.log(type);
    },
   
    logBeginIdeation: function(participant) {
      var msg = "Participant began ideation";
      var type = EventTypeManager.get(msg);
      this.log(type);
    },
   
    logIdeaSubmission: function(participant, ideaID) {
      var msg = "Participant submitted idea";
      var type = EventTypeManager.get(msg);
      var data = {"ideaID": ideaID};
      this.log(type, data);
    },
   
    logEndIdeation: function(participant) {
      var msg = "Participant finished ideation";
      var type = EventTypeManager.get(msg);
      this.log(type);
    },
   
    logExitStudy: function(participant) {
      var msg = "Participant exited study early";
      var type = EventTypeManager.get(msg);
      this.log(type);
    },
   
    logSubmittedSurvey: function(participant, response) {
      var msg = "Participant submitted survey";
      var type = EventTypeManager.get(msg);
      var data = {'responseID': response._id};
      this.log(type, data);
    },

  /** Notification Drawer Events**/
    logNotificationHandled: function(participant, notificationID){
      var msg = "Participant handled a notification";
      var type = EventTypeManager.get(msg);
      var data = {"notificationID": notificationID};
      this.log(type, data);
    },
    
    logNotificationExpanded: function(participant, notificationID){
      var msg = "Participant expanded a notification";
      var type = EventTypeManager.get(msg);
      var data = {"notificationID": notificationID};
      this.log(type, data);
    },

    logNotificationCollapsed: function(participant, notificationID){
      var msg = "Participant collapsed a notification";
      var type = EventTypeManager.get(msg);
      var data = {"notificationID": notificationID};
      this.log(type, data);
    },

    /** Notification events**/
    logSendExamples: function(notification){
      var msg = "Dashboard user sent examples";
      var type = EventTypeManager.get(msg);
      var data  = {"sender": notification.sender,
              "recipient": notification.recipient,
              "type": notification.type,
              "examples": notification.examples};
      this.log(type, data);
    },

    logChangePrompt: function(notification){
      console.log(notification);
      var msg = "Dashboard user changed prompt";
      var type = EventTypeManager.get(msg);
      var data  = {"sender": notification.sender,
              "recipient": notification.recipient,
              "type": notification.type,
              "prompt": notification.prompt};
      this.log(type, data);
      //var user = notification.sender;
      //console.log(user);
      //misc = [{name: "sender", data: notification.sender._id},
              //{name: "recipient", data: notification.recipient},
              //{name: "type", data: notification.type},
              //{name: "prompt", data: notification.prompt}];
      //this.logEvent(msg, user, "notification", misc);
    },

    logSendTheme: function(notification){
      var msg = "Dashboard user sent theme";
      var type = EventTypeManager.get(msg);
      console.log(type);
      var data  = {"sender": notification.sender,
              "recipient": notification.recipient,
              "type": notification.type,
              "theme": notification.theme};
      this.log(type, data);
      //var user = notification.sender;
      //misc = [{name: "sender", data: notification.sender._id},
              //{name: "recipient", data: notification.recipient},
              //{name: "type", data: notification.type},
              //{name: "theme", data: notification.theme}];
      //this.logEvent(msg, user, "notification", misc);
    },

    logRequestHelp: function(notification){
      var msg = "Ideator requested help";
      var type = EventTypeManager.get(msg);
      var data  = {"sender": notification.sender,
              "recipient": notification.recipient,
              "type": notification.type};
      this.log(type, data);
      //var user = notification.sender;
      //misc = [{name: "sender", data: notification.sender._id},
              //{name: "recipient", data: notification.recipient},
              //{name: "type", data: notification.type}];
      //this.logEvent(msg, user, "notification", misc);
    },

  };
}());

EventTypeManager = (function() {
  return {
    create: function(desc, fields) {
      var type = new EventType(desc, fields); 
      type._id = EventTypes.insert(type);
      return type;
    },
    get: function(desc, fields) {
      var create = false;
      if (fields) {
        logger.trace("Looking for EventType with matching fields");
        var results = EventTypes.find(
          {desc: desc,
            fields: fields
          });
        if (results.count() > 0) {
          logger.trace("found " + results.count() + " matching results");
          return results.fetch()[0];
        }
      } else {
        logger.trace("Looking for EventType with matching desc");
        var results = EventTypes.find({desc: desc});
        if (results.count() > 0) {
          logger.trace("found " + results.count() + " matching results");
          return results.fetch()[0];
        }
      }
      //No result foudn, so return newly created type
      logger.trace("no match creating new EventType");
      return this.create(desc, fields);
    },
    remove: function(types) {
      if (types instanceof Array) {
        ids = [];
        if (Meteor.isServer) {
          for (var i=0; i<types.length; i++) {
            ids.push(types._id);
          } 
          EventTypes.remove({"_id": {$in: ids}}); 
        } else {
          types.forEach(function(type) {
            EventTypes.remove({"_id": type._id}); 
          });
        } 
      } else {
        //types is just a single EventType object, not an array
        EventTypes.remove({_id: types._id});  
      }
    }
  };
}());
