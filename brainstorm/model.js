/********************************************************************
Group Brainstorming experiment related data models
********************************************************************/

//Holds list of experiments with metadata
Experiments = new Meteor.Collection("experiments");
/********************************************************************
Brainstorming prompts data models 
********************************************************************/
Prompts = new Meteor.Collection("prompts");
// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
Names = new Meteor.Collection("names");
Roles = new Meteor.Collection("roles");

Experiment = function (prompt) {
   /********************************************************************
   * Defines an brainstorming experiment
   *
   * @return {object} GroupTemplate object 
    ********************************************************************/
  
  this.creationTime = new Date().getTime();
  //Question(s) to answer in the brainstorm
  this.prompt = prompt;
  //Description of the experiment
  this.description = null;
  //Number of groups in the experiment
  this.groupNum = 1;
  //Define the make-up of each group
  this.groupTemplate = new GroupTemplate();
  //Url to pass to participants
  this.url = Meteor.absoluteUrl() + 'Ideation/' + this._id;

};

Experiment.prototype.getUrl = function() {
  this.url = Meteor.absoluteUrl() + 'Ideation2/' + this._id;
  console.log(this.url);
  console.log('getting url');
  return Meteor.absoluteUrl() + 'Ideation/' + this._id;
};

Prompt = function (question){
  /********************************************************************
   * Constructor that defines a brainstorming prompt/question
   *
   * @return {object} Prompt object 
  ********************************************************************/

	this.question = question;
	this.participants = [];
	var groupsize;

	//define functions for users; add, remove, find
};

Prompt.prototype.addParticipant = function (name){
		this.participants.push(name);
		console.log("participant added");
};

GroupTemplate = function () {
  /******************************************************************
  * Defines a template for membership of each group in a brainstorm
  *
  * @return {object} GroupTemplate object 
  ******************************************************************/
 
  // list of Role._id
  this.roles = [];

  // Dictionary where key=Role._id; value=number of people of that role
  //this.numRoles = {};

};

GroupTemplate.prototype.addRole = function (role, num){
  /******************************************************************
  * Adds a role to the set of roles in a group template
  *
  * @return null
  ******************************************************************/
  var newRole = new RoleTemplate(role, num);
  this.roles.push(newRole);
  //this.numRoles[role._id] = num;
};

RoleTemplate = function (role, num) {
  this.role = role._id;
  this.title = role.title;
  this.num = num;
}


Role = function (title) {
  /********************************************************************
  * defines a function or sequence of functions performed by an
  * individual
  *
  * @return {object} GroupTemplate object 
  ********************************************************************/

  this.title = title;

};

Idea = function (content, user) {
  /********************************************************************
  * Encapsulation of ideas recorded by the system
  *
  * @return {object} GroupTemplate object 
  ********************************************************************/
  this.time = new Date().getTime();
  this.content = content;
  this.user = user;
};


/*PromptFactory = {
	
	create : function(question, status, participant){
		return {
			question : question,
			status : status,
			participants : [participant],
			
			addParticipant : function(name){
				return participants.push(name);
			}
		};
	}
};*/




//Class that encapsulates prompt and workflow/role + url to each and url to the set
User = function(name){
	this.name = name;
	var role;
	var userUrl;
};

User.prototype.randomAssign = function(){
	var myRand = Math.floor(Math.random()*100);
	if (myRand<33){

	} else if (myRand<66 && myRand>=33){

	} else if (myRand>=66){

	}

};

//Random assignment and user management logic
	//when user opens client they get randomly assigned to a role and/or workflow and paired unique url (hashed)
//Need to track completion


//Hash code function 
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
