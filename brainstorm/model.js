// Setup a collection to contain all ideas

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

//Prompt constructor function
Prompt = function (question, status, users){
	this.question = question;
	this.status = status;
	this.participants = [];
	var groupsize;

	//define functions for users; add, remove, find
};

Prompt.prototype.addParticipant = function (name){
		this.participants.push(name);
		console.log("participant added");
};

//Class for roles - one role = one screen
Role = function(title){
	this.title = title;
};

//Class for workflow - a set of role-screens
Workflow = function(role1, role2, role3){

};

//Class for groups - number of each role
Group = function(numRole1, numRole2, numRole3){
	var groupSize;
};

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

Prompts = new Meteor.Collection("prompts");
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");
Names = new Meteor.Collection("names");


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

