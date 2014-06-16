/********************************************************************
Group Brainstorming experiment related data models
********************************************************************/
//Holds list of experiments with metadata
Experiments = new Meteor.Collection("experiments");
// Logs user experiment consent
Consents = new Meteor.Collection("consents");
// Logs all participants in experiments
Participants = new Meteor.Collection("participants");

Experiment = function () {
   /********************************************************************
   * Defines an brainstorming experiment
   *
   * @return {object} GroupTemplate object 
    ********************************************************************/
  
  this.creationTime = new Date().getTime();
  //Description of the experiment
  this.description = null;
  //Url to pass to participants 
  // **** Need to update *****
  this.url = Meteor.absoluteUrl() + 'LoginPage/';
  //List of all experimental conditions
  this.conditions = [];
  //Tracks group references: key: condition, value: array of groups
  this.groups = {};
  //Tracks all participants in the experiment
  this.participants = [];

};

Experiment.prototype.getUrl = function() {
  //this.url = Meteor.absoluteUrl() + 'Ideation/' + this._id;
  //console.log(this.url);
  //console.log('getting url');
  return Meteor.absoluteUrl() + 'LoginPage/' + this._id;
};

Experiment.prototype.setNumGroups = function(num) {
  /******************************************************************
  * sets all experimental conditions to have the same number of groups
  ******************************************************************/
  for (var i=0; i<this.conditions.length; i++) {
    this.conditions[i].groupNum = num;
    //console.log("adding group for condition:");
    //console.log(this.conditions[i]);
    //INitialize empty groups for each condition
    var groups = [];
    for (var j=0; j<num; j++) {
        var newGroup = new Group(this.conditions[j].groupTemplate);
        Groups.insert(newGroup);
      groups.push(newGroup);
    }
    this.groups[this.conditions[i].id] = groups
  }
};

Experiment.prototype.getRandomCondition = function() {
    return getRandomElement(this.conditions);
  ////Get Random Number
	//var myRand = Math.floor(Math.random()*1024);
  ////Divide range of 1024 evenly between number of condidions
  //var interval = Math.floor(1024/this.conditions.length); 
  //for (var i=0; i<this.conditions.length; i++) {
    //if ((myRand >= interval * i) && (myRand < interval * (i + 1))) {
      //return this.condition[i];
    //} 
  //}
  ////If exiting without a return, then myRand was in the small rounding
  //// error margin at the top of the range
  //return this.conditions[this.conditions.length-1];
};

Experiment.prototype.getGroup = function(condition) {
    var openGroups = [];
    var numSlots = 0;
    //Find all groups with open slots
    for (var i=0; i<this.groups[condition.id].length; i++) {
        var group = $.extend(new Group(), 
            this.groups[condition.id][i]
            );
        var groupOpenSlots = group.numSlots();
        if (groupOpenSlots > 0) {
            openGroups.push(this.groups[condition.id][i]);
            numSlots += groupOpenSlots;
        }
    }
    //Ignore open slots for now
    var result = getRandomElement(openGroups);

    return $.extend(true, new Group(), result);
};

Experiment.prototype.addParticipant = function(user) {
  var cond = this.getRandomCondition();
  var group = this.getGroup(cond);
  var role = group.addUser(user);
  var part = new Participant(this, user, cond, group, role);
  part._id = Participants.insert(part);
  this.participants.push(part);
  return part;
}

ExpCondition = function(id, prompt, desc, groupNum) {
  //Unique ID (with respect to the experiment)
  this.id = id;
  //Question(s) to answer in the brainstorm
  this.prompt = new Prompt(prompt);
  this.prompt._id = Prompts.insert(this.prompt);
  //Description of the experiment
  this.description = desc;
  //Number of groups in the experiment
  if (groupNum) {
      this.groupNum = groupNum;
  } else {
      this.groupNum = 1;
  }
  //Define the make-up of each group
  this.groupTemplate = new GroupTemplate();
};

Participant = function(exp, user, cond, group, role) {
    /****************************************************************
    * Initialize participant and perform complete random assignment
    ****************************************************************/
    this.experiment = exp._id;
    this.user = user;
    // Assign Participant to condition
    this.condition = exp.getRandomCondition();
    this.group = group._id;
    this.role = Roles.findOne(role.role);
};

Consent = function (user, experiment) {
  /********************************************************************
  * Personal information captured by consent form
  *
  * @return {object} Consent object 
  ********************************************************************/
  this.user = user;
  this.experiment = experiment;
  this.datetime = new Date();
};
