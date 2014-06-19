/********************************************************************
Brainstorming prompts data models 
********************************************************************/
Prompts = new Meteor.Collection("prompts");
// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
ReplayIdeas = new Meteor.Collection("replayIdeas");
// All system users
Names = new Meteor.Collection("names");
// All roles
Roles = new Meteor.Collection("roles");
// Logs all formed groups
Groups = new Meteor.Collection("groups");
Clusters = new Meteor.Collection("clusters");
IdeasToProcess = new Meteor.Collection("ideasToProcess");

IdeaToProcess = function(content, participant){
  this.content = content;
  this.participantID = participant._id;
  this.inCluster = false;
}

Cluster = function(ideas){
  this.ideas = ideas;
  this.id; //should be the same as id of entry in mongo db collection (?)
  this.name = "Not named yet"; //default name for unnamed clusters
  this.position;
  this.children = [];
}

root = {
  _id : "1",
  isRoot : true,
  children : []
}
if(Clusters.findOne({_id: "1"}) === undefined) Clusters.insert(root);

UserTypes = new Meteor.Collection("userTypes");


Prompt = function(question) {
  /********************************************************************
   * Constructor that defines a brainstorming prompt/question
   *
   * @return {object} Prompt object 
  ********************************************************************/
  this.question = question;
};

Group = function(template) {
    this.template = template;
    //Users held in the namesc oollection. Maps users to roles
    this.users = {};
    // Key: Role._id. Value: array of users
    this.assignments = {};
    if (template) {
      for (var i=0; i<this.template.roles.length; i++) {
          this.assignments[this.template.roles[i].role] = [];
      } 
    }

    this. getRandomRole = function () {
        return getRandomElement(this.template.roles);
      ////Get Random Number
	    //var myRand = Math.floor(Math.random()*1024);
      //var roles = this.template.roles;
      ////Divide range of 1024 evenly between number of condidions
      //var interval = Math.floor(1024/roles.length); 
      //for (var i=0; i<roles.length; i++) {
        //if ((myRand >= interval * i) && (myRand < interval * (i + 1))) {
          //return roles[i];
        //} 
      //}
      ////If exiting without a return, then myRand was in the small rounding
      //// error margin at the top of the range
      //return roles[roles.length - 1];

    };

}

Group.prototype.numSlots = function() {
    /****************************************************************
    * Determine if the group can accept more members according to 
    * the template definition 
    ****************************************************************/
    var numOpen = 0;
    var roles = this.template.roles;
    for (var i=0; i<roles.length; i++) {
        var numUsers = this.assignments[roles[i].role].length;
        var numSlots = roles[i].num;
        numOpen += numSlots - numUsers;
    }
    return numOpen;
};


Group.prototype.addUser = function(user) {
    var role = this.getRandomRole();
    this.users[user._id] = role;
    this.assignments[role._id] = user;
    return role;
}

GroupTemplate = function () {
  /******************************************************************
  * Defines a template for membership of each group in a brainstorm
  *
  * @return {object} GroupTemplate object 
  ******************************************************************/
 
  // list of RoleTemplates
  this.roles = [];
  // The number of members in the group where -1 is unlimited
  this.size = 0;
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
  this.size += num;
  this.roles.push(newRole);
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
  this.workflow = [];

};

Role.prototype.nextFunc = function (current) {
  for (var i=0; i<this.workflow.length; i++) {
      var workflowPage = this.workflow[i]; 
      if (workflowPage == current) {
          //console.log("current function is: " + this.workflow[i]);
          var workflowIndex = i;
      }
  }
  if (workflowIndex + 1 < this.workflow.length) {
      //console.log("next function is: " + this.workflow[workflowIndex + 1]);
      return this.workflow[workflowIndex+1];
  } else {
      //console.log("No next function found");
    return null;
  }
};

Role.prototype.getRole = function(newRole) {
  return $.extend(true, new Role(), newRole);
}


Idea = function (content, user, prompt, participant) {
  /********************************************************************
  * Encapsulation of ideas recorded by the system
  *
  * @return {object} GroupTemplate object 
  ********************************************************************/
  this.time = new Date().getTime();
  this.content = content;
  this.user = user;
  this.prompt = prompt;
  //Optional field not logged during non-experiments
  this.participant = participant;
};

//Class that encapsulates prompt and workflow/role + url to each and url to the set
User = function(name, type){
	this.name = name;
  //Currently only "admin" is significant
  this.type = type;
};

//Random assignment and user management logic
	//when user opens client they get randomly assigned to a role and/or workflow and paired unique url (hashed)
//Need to track completion


//Javascript implementation of Java's hash code function 
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

