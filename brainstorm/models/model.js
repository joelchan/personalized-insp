/********************************************************************
Brainstorming prompts data models 
********************************************************************/
Prompts = new Meteor.Collection("prompts");
// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
ReplayIdeas = new Meteor.Collection("replayIdeas");
// All system users
MyUsers = new Meteor.Collection("myUsers");
// All roles
Roles = new Meteor.Collection("roles");
// Logs all formed groups
Groups = new Meteor.Collection("groups");
GroupTemplates = new Meteor.Collection("groupTemplates");
Clusters = new Meteor.Collection("clusters");
IdeasToProcess = new Meteor.Collection("ideasToProcess");
// Generic Filters for dynamic UI filtering
Filters = new Meteor.Collection("filters");



IdeaToProcess = function(content, participant){
  this.content = content;
  this.participantID = participant._id;
  this.inCluster = false;
}

Cluster = function(ideas){
  this.ideas = ideas;
  this.name = "Not named yet"; //default name for unnamed clusters
  this.position; //used only for clustering interface and tag cloud
  this.children = [];
  this.isCollapsed = false; //used only for clustering interface
}

root = {
  _id : "-1",
  isRoot : true,
  children : []
}

UserTypes = new Meteor.Collection("userTypes");


Prompt = function(question, template, exp, cond) {
  /********************************************************************
   * Constructor that defines a brainstorming prompt/question
   * @Params
   *    question - A string containing the brainstorming prompt/subject
   *    template - (Optional) Group Template associated with groups
   *        responding to this prompt
   *    exp      - (Optional) The experiment associated with this prompt
   *    cond     - (Optional) The experiment condition associated with 
   *        this prompt
   *
   * @return {object} Prompt object 
  ********************************************************************/
  this.question = question;
  // Temporary modifications to prompt to quickly associate with an experiment
  if (template) {
    this.template = template;
  }
  if (exp) {
    this.expID = exp._id;
  }
  if (cond) {
    this.condID = cond._id;
  }
};

Group = function(template) {
    this.template = template;
    //Users assigned to the group
    this.users = [];
    // set of objects where roleID is the field name and
    //    each object stored there has a roleTitle, and array
    //    of users assigned to that role
    //this.assignments = []
    this.assignments = {}
    // flag for whether the group is accepting new members
    this.isOpen = true;
    if (template) {
      for (var i=0; i<this.template.roles.length; i++) {
        //Use roleID as the key toe the object containing assignments
        var roleID = this.template.roles[i].roleID;
        //console.log(this.template.roles[i].roleID);
        //var newRoleAssign = {'roleID': roleID};
        this.assignments[roleID] = [];
        //The title of the role associated with these assignments
        //newRoleAssign['roleTitle'] = this.template.roles[i].title;
        //this.assignments[roleID]['roleTitle'] = this.template.roles[i].title;
        //This is the array of users that are assigned to this role
        //newRoleAssign['roleAssignments'] = [];
        //this.assignments[roleID]['roleAssignments'] = [];
        //Add groupAssignment to group
        //this.assignments.push(newRoleAssign);
      } 
    }
}

GroupAssignment = (function(){//function(user, role) {
    ///****************************************************************
    //* Encapsulates the assignment of a user in a group to a role
    //* @Params
    //*   user - the user that is being assign
    // * and adds it to the database. Intended to abstract mechanics
    // * of copying/creation of a group. Duplicating groups should
    // * be a common function
    // **************************************************************/
    //   var newGroup = new Group(group.template);
    //   newGroup._id = Groups.insert(newGroup);
    //   return newGroup;
    // },

    return {createGroup: function(template, users) {
      /**************************************************************
      * Create a new group from a tempalte and perform an necessary
      * initialization
      **************************************************************/
      var newGroup = new Group(template);
      newGroup._id = Groups.insert(newGroup);
      // Assign users to group if users are given
      if (users) {
        for (var i=0; i<users.length; i++) {
          if (group.isOpen) {
            //Assign the user and update the db entry
            this.addUser(group, users[i])
          }
        }
      }
      return newGroup;
    },

    numOpenSlots: function(group) {
      /****************************************************************
      * Determine if the group can accept more members according to 
      * the template definition 
      ****************************************************************/
      var numSlots = 0;
      var numAssigned = 0;
      //Sum all the assignemnts for each role
      //for (var i=0; i<group.assignments.length; i++) {
        //numAssigned += group.assignments[i].roleAssignments.length;
      //}
      for (var role in group.assignments) {
        if (group.assignments.hasOwnProperty(role)) {
          //numAssigned += group.assignements[role].roleAssignments.length;
          numAssigned += group.assignments[role].length;
        }
      }
      //Sum all the potential slots for each role
      var roles = group.template.roles;
      for (var i=0; i<roles.length; i++) {
        numSlots += roles[i].num;
      }
      //Return the difference
      return numSlots - numAssigned;
    },
  
    addUser: function(group, user) {
      /**************************************************************
      * Adds a user to the group assumes group has capacity unless
      *   isOpen flag is set to false, also updates database entry
      * @Params
      *   user - user to be added to the group
      * @Return
      *   role - the role that the user was assigned or undefined if 
      *       no assignment was successfully made
      **************************************************************/
      var role;
      if (group.isOpen) {
        //Get role and add user and assignment info
        role = this.getRandomRole(group);
        group.users.push(user)
        //Add User to the list of users assigned to a specific fole
        group.assignments[role.roleID].push(user);
        //group.assignments[role.roleID].roleAssignments.push(user);
        // Mark closed if no more slots are open after assignment
        if (this.numOpenSlots(group) == 0) {
          group.isOpen = false;
        }
        //Update group in group collection
        Groups.update({_id: group._id},
            {
              $push: {users: user},
              $set: {assignments: group.assignments,
                  isOpen: group.isOpen}
            }
        );
      }
      return role;
    },

    getRandomRole: function (group) {
      /**************************************************************
      * Returns from the group a random role that has open slots
      **************************************************************/
      var roleTemplates = group.template.roles;
      var openRoles = []
      for (var i=0; i<roleTemplates.length; i++) {
        var numSlots = roleTemplates[i].num;
        var numAssign = group.assignments[roleTemplates[i].roleID].length
        var diff = numSlots - numAssign;
        if (diff > 0) {
          openRoles.push(roleTemplates[i]);
        }
      };
      return getRandomElement(openRoles);
    },

    addRole: function (grpTemplate, role, num) {
      /******************************************************************
      * Adds a role to the set of roles in a group template
      *
      * @return null
      ******************************************************************/
      var newRole = new RoleTemplate(role, num);
      grpTemplate.size += num;
      grpTemplate.roles.push(newRole);
    }
  }; 
}());

//Group.prototype.numSlots = function() {
    ///****************************************************************
    //* Determine if the group can accept more members according to 
    //* the template definition 
    //****************************************************************/
    //var numOpen = 0;
    //var roles = this.template.roles;
    //for (var i=0; i<roles.length; i++) {
        //var numUsers = this.assignments[roles[i].roleID].length;
        //var numSlots = roles[i].num;
        //numOpen += numSlots - numUsers;
    //}
    //return numOpen;
//};
//
//
//Group.prototype.addUser = function(user) {
    //var role = this.getRandomRole();
    //this.users[user._id] = role;
    //this.assignments[role._id] = user;
    //return role;
//}

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

//GroupTemplate.prototype.addRole = function (role, num){
  ///******************************************************************
  //* Adds a role to the set of roles in a group template
  //*
  //* @return null
  //******************************************************************/
  //var newRole = new RoleTemplate(role, num);
  //this.size += num;
  //this.roles.push(newRole);
//};

RoleTemplate = function (role, num) {
  this.roleID = role._id;
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
  this.time = new Date();
  this.content = content;
  this.userID = user._id;
  this.userName = user.name;
  this.prompt = prompt;
  this.isGamechanger = false;
  this.inCluster = false;
  //Optional fields not logged during non-experiments
  this.participantID = participant._id;
};

//Class that encapsulates prompt and workflow/role + url to each and url to the set
User = function(name, type){
	this.name = name;
  //Currently only "admin" is significant
  this.type = type;
};

Filter = function (name, user, collection) {
  this.name =  name
  this.user = user
  this.collection = collection
  this.sort = [];
  this.filter [];
};

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

