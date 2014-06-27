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

logDenyParticipation = function(user) {
  event = new Event("User was denied participation in experiment",
      user);
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

logIdeaSubmission = function(participant, ideaID) {
  event = new Event("Participant submitted idea",
      participant.user);
  event.participant = participant;
  event.ideaID = ideaID;
  Events.insert(event);
};


logEndIdeation = function(participant) {
  event = new Event("Participant finished ideation",
      participant.user);
  event.participant = participant;
  Events.insert(event);
};

logExitStudy = function(participant) {
  event = new Event("Participant exited study early",
      participant.user);
  event.participant = participant;
  Events.insert(event);
};

logSubmittedSurvey = function(participant, response) {
  event = new Event("Participant submitted survey",
      participant.user);
  event.participant = participant;
  event.responseID = response._id;
  Events.insert(event);
};


