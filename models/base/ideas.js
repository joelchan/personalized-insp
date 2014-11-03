// Configure logger for Tools
var logger = new Logger('Models:Data');
// Comment out to use global logging level
//Logger.setLevel('Models:Data', 'trace');
//Logger.setLevel('Models:Data', 'debug');
//Logger.setLevel('Models:Data', 'info');
//Logger.setLevel('Models:Data', 'warn');

/********************************************************************
Brainstorming prompts data models 
********************************************************************/
// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
ReplayIdeas = new Meteor.Collection("replayIdeas");
IdeasToProcess = new Meteor.Collection("ideasToProcess");
Clusters = new Meteor.Collection("clusters");


IdeaToProcess = function(content, participant){
  this.content = content;
  this.participantID = participant._id;
  this.inCluster = false;
}

Idea = function (content, user, prompt, participant) {
  /********************************************************************
  * Encapsulation of ideas recorded by the system
  *
  * @return {object} GroupTemplate object 
  ********************************************************************/
  this.time = new Date().getTime();
  this.content = content;
  this.userID = user._id;
  this.userName = user.name;
  this.prompt = prompt; /*** Deprecated **/
  this.promptID = prompt._id;
  this.isGamechanger = false;
  //List of userIDs of users who have voted
  this.votes = [];
  this.inCluster = false;
  this.clusterIDs = [];
  //Optional fields not logged during non-experiments
  if (participant) {
    this.participantID = participant._id;
  }
};



Cluster = function(user, prompt, ideaIDs){
  if (!ideaIDs)
  {
    this.ideaIDs = [];
  } else {
    this.ideaIDs = ideaIDs;
  }
  this.userID = user._id;
  this.userName = user.name;
  this.promptID = prompt._id;
  this.name = "Not named yet"; //default name for unnamed clusters
  this.position; //used only for clustering interface and tag cloud
  var jitterTop = 30 + getRandomInt(0, 30);
  var jitterLeft = getRandomInt(0, 30);
  this.position = {top: jitterTop , left: jitterLeft};
  this.children = [];
  this.isCollapsed = false; //used only for clustering interface
  //Used to mark a cluster as trash without deleting the data
  this.isTrash = false;
}

root = {
  _id : "-1",
  isRoot : true,
  children : []
}

