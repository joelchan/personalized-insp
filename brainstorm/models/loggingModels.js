Events = new Meteor.Collection("events");

Event = function (desc, userID, userName, type) {
  //time stamp for the event
  this.time = new Date();
  //description of the event
  this.description = desc;
  //_id of user generating the event
  this.userID = userID;
  //Name of user generating the event
  this.userName = userName;
  //There are additional fields that can be added
  //See logger for details
}

