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
Consents = new Meteor.Collection("consents");
Participants = new Meteor.Collection("participants");
Groups = new Meteor.Collection("groups");
Clusters = new Meteor.Collection("clusters");

Cluster = function(ideas){
  this.ideas = ideas;
  this.id; //should be the same as id of entry in mongo db collection (?)
  this.name = "Not named yet"; //default name for unnamed clusters
  this.position;
}

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


Prompt = function(question) {
  this.question = question;
};

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

//Participants.prototype.assignCondition = function() {
    //this.condition = this.experiment.getRandomCondition();
//
//};


//Prompt = function (question){
  /********************************************************************
   * Constructor that defines a brainstorming prompt/question
   *
   * @return {object} Prompt object 
  ********************************************************************/

//Predefined prompt for preliminary mechanical turk trials
prelimPrompt = {
	question : "What are alternate uses for a bowling pin?",
	status : "Active",
	participants : [],
	_id : "7pMWSVEvAVz36ixXb10e" //randomly generated 20 char string to use as unidque id
};


GroupTemplate = function () {
  /******************************************************************
  * Defines a template for membership of each group in a brainstorm
  *
  * @return {object} GroupTemplate object 
  ******************************************************************/
 
  // list of RoleTemplates
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
          console.log("current function is: " + this.workflow[i]);
          var workflowIndex = i;
      }
  }
  if (workflowIndex + 1 < this.workflow.length) {
      console.log("next function is: " + this.workflow[workflowIndex + 1]);
      return this.workflow[workflowIndex+1];
  } else {
      console.log("No next function found");
    return null;
  }
};

Role.prototype.getRole = function(newRole) {
  return $.extend(true, new Role(), newRole);
}


Idea = function (content, participant) {
  /********************************************************************
  * Encapsulation of ideas recorded by the system
  *
  * @return {object} GroupTemplate object 
  ********************************************************************/
  this.time = new Date().getTime();
  this.content = content;
  this.participant = participant;
  this.inCluster = false;
  //this.user = user;
  //this.experiment = experiment;
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
	//this.verifyCode = name.hashCode();
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

//Javascript implementation of Java's hash code function 
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

//Generates random alphanumeric string id
makeID = function(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

getRandomElement = function (array) {
    /****************************************************************
    * get a random element in a given array
    ****************************************************************/
	  var myRand = Math.floor(Math.random()*1024);
    //Divide range of 1024 evenly between number of condidions
    var interval = Math.floor(1024/array.length); 
    for (var i=0; i<array.length; i++) {
      if ((myRand >= interval * i) && (myRand < interval * (i + 1))) {
        return array[i];
      } 
    }
    //If exiting without a return, then myRand was in the small rounding
    // error margin at the top of the range
    return array[array.length - 1];
};
