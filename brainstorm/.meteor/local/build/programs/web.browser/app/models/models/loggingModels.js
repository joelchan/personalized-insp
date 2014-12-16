(function(){Events = new Meteor.Collection("events");
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
  EventTypeManager.get("User logged into experiment");
  EventTypeManager.get("User was denied participation in experiment");
  EventTypeManager.get("User consented to experiment");
  _.keys(RoleManager.defaults).forEach(function(title) {
    fields = ['role'];
    EventTypeManager.get("User began role " + title, fields);
    EventTypeManager.get("User finished role " + title, fields);
  });
  //EventTypeManager.get("User began ideation");
  EventTypeManager.get("User exited study early");
  fields = ['ideaID', 'promptID'];
  EventTypeManager.get("User submitted idea", fields);
  //EventTypeManager.get("User finished ideation");
  fields = ['responseID'];
  EventTypeManager.get("User submitted survey", fields);
  fields = ['notificationID', 'promptID'];
  EventTypeManager.get("User handled a notification", fields);
  EventTypeManager.get("User expanded a notification", fields);
  EventTypeManager.get("User collapsed a notification", fields);
  fields = ['sender', 'recipientIDs', 'type', 'examples', 'promptID'];
  EventTypeManager.get("Dashboard user sent examples", fields);
  fields = ['sender', 'recipientIDs', 'type', 'prompt', 'promptID'];
  EventTypeManager.get("Dashboard user changed prompt", fields);
  fields = ['sender', 'recipientIDs', 'type', 'theme', 'promptID' ];
  EventTypeManager.get("Dashboard user sent theme", fields);
  fields = ['sender', 'recipientIDs', 'type', 'promptID'];
  EventTypeManager.get("Ideator requested help", fields);
  fields = ['clusterID', 'newState'];
  EventTypeManager.get("User toggled cluster collapse", fields);
  fields = ['ideaID', 'newState'];
  EventTypeManager.get("User toggled idea game changer", fields);
  fields = ['clusterID', 'newName'];
  EventTypeManager.get("User modified cluster name", fields);
  fields = ['clusterID', 'position'];
  EventTypeManager.get("User moved cluster", fields);
  fields = ['clusterID', 'name'];
  EventTypeManager.get("Empty Cluster is being deleted", fields);
  fields = ['ideaID', 'sourceID', 'targetID'];
  EventTypeManager.get("User removed Idea from cluster", fields);
  fields = ['ideaID', 'sourceID', 'targetID'];
  EventTypeManager.get("User created new cluster", fields);
  fields = ['ideaID', 'sourceID', 'targetID'];
  EventTypeManager.get("User inserted idea to cluster", fields);
  fields = ['ideaID', 'sourceID'];
  EventTypeManager.get("User unclustered idea", fields);
});
  

})();