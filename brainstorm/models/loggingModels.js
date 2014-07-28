Events = new Meteor.Collection("events");
EventTypes = new Meteor.Collection("eventTypes");

Event = function (type, user) {
  //time stamp for the event
  this.time = new Date();
  //type of the event
  this.type = type;
  /*********** Leaving description in for legacy reasons *******/
  //description of the event
  this.description = type.desc;
  //_id of user generating the event
  this.userID = user._id;
  //Name of user generating the event
  this.userName = user.name;
  //There are additional fields that can be added
  //See logger for details
}

/********************************************************************
 * Decentralizing definition of events to code creating the event
 *******************************************************************/
EventType = function (desc, fields) {
  /******************************************************************
   * Events each have a type associated to make them easily indexable
   * and easily semi-automate generation
   * @Params
   *    desc - String identifying/describing the event
   *    fields - (Optional) array of strings of field names for 
   *        additional data
   * ***************************************************************/
  //Identifying description of the event
  this.desc = desc;
  //Optional additional fields with this type
  if (fields) {
    this.fields = fields;
  }

}

/********************************************************************
 * Initialize all known EventTypes
 *******************************************************************/
Meteor.startup(function() {
  //Initializes if not already present
  var fields;
  EventTypeManager.get("Participant logged into experiment");
  EventTypeManager.get("User was denied participation in experiment");
  EventTypeManager.get("Participant consented to experiment");
  EventTypeManager.get("Participant began ideation");
  fields = ['ideaID'];
  EventTypeManager.get("Participant submitted idea", fields);
  EventTypeManager.get("Participant finished ideation");
  EventTypeManager.get("Participant exited study early");
  fields = ['responseID'];
  EventTypeManager.get("Participant submitted survey", fields);
  fields = ['notificationID'];
  EventTypeManager.get("Participant handled a notification", fields);
  EventTypeManager.get("Participant expanded a notification", fields);
  EventTypeManager.get("Participant collapsed a notification", fields);
  fields = ['sender', 'recipient', 'type', 'examples'];
  EventTypeManager.get("Dashboard user sent examples", fields);
  fields = ['sender', 'recipient', 'type', 'prompt'];
  EventTypeManager.get("Dashboard user changed prompt", fields);
  fields = ['sender', 'recipient', 'type', 'theme' ];
  EventTypeManager.get("Dashboard user sent theme", fields);
  fields = ['sender', 'recipient', 'type'];
  EventTypeManager.get("Ideator requested help", fields);
});
  
