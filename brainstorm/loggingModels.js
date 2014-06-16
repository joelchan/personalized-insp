Events = new Meteor.Collection("events");

Event = function (desc, user) {
  //time stamp for the event
  this.time = new Date();
  //description of the event
  this.description = desc;
  //user generating the event
  this.user = user;
}

logParticipantLogin = function (participant) {
  event = new Event("Participant logged into experiment",
      participant.user);
  event.participant = participant;
  Events.insert(event);
};

logConsent = function (participant) {
  event = new Event("Participant consented to experiment",
      participant.user);
  event.participant = participant;
  Events.insert(event);
};

logBeginIdeation = function(participant) {
  event = new Event("Participant began ideation",
      participant.user);
  event.participant = participant;
  Events.insert(event);
};

logIdeaSubmission = function(participant, idea) {
  event = new Event("Participant submitted idea",
      participant.user);
  event.participant = participant;
  event.idea = idea;
  Events.insert(event);
};


logEndIdeation = function(participant) {
  event = new Event("Participant finished ideation",
      participant.user);
  event.participant = participant;
  Events.insert(event);
};

