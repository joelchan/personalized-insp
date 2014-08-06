// Configure logger for Tools
var logger = new Logger('Models:Data');
// Comment out to use global logging level
Logger.setLevel('Models:Data', 'trace');
//Logger.setLevel('Models:Data', 'debug');
//Logger.setLevel('Models:Data', 'info');
//Logger.setLevel('Models:Data', 'warn');

/********************************************************************
Brainstorming prompts data models 
********************************************************************/
Prompts = new Meteor.Collection("prompts");
// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
ReplayIdeas = new Meteor.Collection("replayIdeas");
IdeasToProcess = new Meteor.Collection("ideasToProcess");
Clusters = new Meteor.Collection("clusters");
// All system users
MyUsers = new Meteor.Collection("myUsers");
UserTypes = new Meteor.Collection("userTypes");
// All roles
Roles = new Meteor.Collection("roles");
// Logs all formed groups
Groups = new Meteor.Collection("groups");
GroupTemplates = new Meteor.Collection("groupTemplates");


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
  this.prompt = prompt;
  this.isGamechanger = false;
  this.inCluster = false;
  this.clusterIDs = [];
  //Optional fields not logged during non-experiments
  if (participant) {
    this.participantID = participant._id;
  }
};


Cluster = function(ideaIDs){
  if (!ideaIDs)
  {
    this.ideaIDs = [];
  } else {
    this.ideaIDs = ideaIDs;
  }
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

//Class that encapsulates prompt and workflow/role + url to each and url to the set
User = function(name, type){
	this.name = name;
  //Currently only "admin" is significant
  this.type = type;
};

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
GroupTemplate = function () {
  /******************************************************************
  * Defines a template for membership of each group in a brainstorm
  *
  * @return {object} GroupTemplate object 
  ******************************************************************/
 
  // list of Roles with role.num defined as the number of that role in
  // the group
  this.roles = [];
  // The number of members in the group where -1 is unlimited
  this.size = 0;

};


Role = function (title) {
  /********************************************************************
  * defines a function or sequence of functions performed by an
  * individual
  *
  * @return {object} GroupTemplate object 
  ********************************************************************/

  this.title = title;
  this.workflow = [];
  // this.num used by GroupTemplates
  // this.misc used by individual page logic to load page specific
  // variables in form [{name: "name", val: "value"}, ...] 

};

RoleManager = (function () {
  //Change deafultRoles to object with list of roles + each role
  //accessible by name
  var defaultRoles = {};
  var newRole = new Role("Ideator");
  newRole.workflow = ['IdeationPage', 'SurveyPage'];
  defaultRoles[newRole.title] = newRole;
  var newRole = new Role("Synthesizer");
  newRole.workflow = ['Clustering', 'SurveyPage'];
  defaultRoles[newRole.title] = newRole;
  var newRole = new Role("Facilitator");
  newRole.workflow = ['Dashboard', 'SurveyPage'];
  defaultRoles[newRole.title] = newRole;
  var newRole = new Role("Unassigned");
  newRole.workflow = ['PromptPage', 'RoleSelectPage'];
  defaultRoles[newRole.title] = newRole;

  return {
    /****************************************************************
     * Object that allows for most group manipulations including 
     *   assignment, creation, and modification
     ***************************************************************/
    //Enum of all default roles
    defaults: defaultRoles,
    getTemplate: function(title, num) {
      /**************************************************************
       * Return a roleTemplate with using a role with a given title
       * and the number specified
       *************************************************************/
      logger.trace("Creating template with role: " + title);
      var role = this.defaults[title];
      if (!role) {
        logger.warn(
            "Failed attempt to create roleTemplate with role title: " +
            title);
      }
      role['num'] = num;
      return role;
    },
    getNextFunc: function(role) {
      /**************************************************************
       * Get the next function/page that the role should transition
       *************************************************************/
      for (var i=0; i<role.workflow.length; i++) {
          var workflowPage = role.workflow[i]; 
          if (workflowPage == current) {
              //console.log("current function is: " + this.workflow[i]);
              var workflowIndex = i;
          }
      }
      if (workflowIndex + 1 < role.workflow.length) {
          //console.log("next function is: " + this.workflow[workflowIndex + 1]);
          return role.workflow[workflowIndex+1];
      } else {
          //console.log("No next function found");
        logger.warn("Attempted to go to next role function when " +
          "none is defined");
        return null;
      }
    },
  };
}());


GroupManager = (function () {
  //Define a default group template
  var defaultTempl = new GroupTemplate();
  defaultTempl.roles = [RoleManager.getTemplate("Ideator", -1),
    RoleManager.getTemplate('Synthesizer', -1),
    RoleManager.getTemplate('Facilitator', -1)
  ];
  defaultTempl.size = -1;
  return {
    /****************************************************************
     * Object that allows for most group manipulations including 
     *   assignment, creation, and modification
     ****************************************************************/
    defaultTemplate: defaultTempl,
    create: function(template) {
      /**************************************************************
      * Create a new group from a tempalte and perform an necessary
      * initialization
      **************************************************************/
      if (!template) {
        template = this.getTemplate();
      }
      var newGroup = new Group(template);
      newGroup._id = Groups.insert(newGroup);
      // Assign users to group if users are given
      //if (users) {
        //for (var i=0; i<users.length; i++) {
          //if (group.isOpen) {
            ////Assign the user and update the db entry
            //this.addUser(group, users[i])
          //}
        //}
      //}
      return newGroup;
    },
    createDefault: function() {
      return this.create(this.defaultTemplate);
    },
    getTemplate: function(roleTemps) {
      /**************************************************************
      * Create a group template with the given role templates
      * @Params
      *   roleTemps - (Optional) Array of RoleTemplates that will 
      *     define the group template
      * @Return
      *   a GroupTemplate Object
      **************************************************************/
      var result = new GroupTemplate();
      if (roleTemps) {
        if (hasForEach(roleTemps)) {
          logger.trace("Adding list of roles to group template");
          roleTemps.forEach(function(roleTemp) {
            this.addRole(result, roleTemp.role, roleTemp.num);
          });
        } else {
          logger.trace("Adding a single role to group template");
        }

      }
      //result._id = GroupTemplates.insert(result);
      return result;
    },
    copy: function(group) {
      /**************************************************************
       * Creates a duplicate group based on a given group's template
       * and adds it to the database. Intended to abstract mechanics
       * of copying/creation of a group. Duplicating groups should
       * be a common function
       **************************************************************/
       return this.create(group.template);
    },
    addRole: function (grp, title, num) {
      /******************************************************************
      * Adds a role to the set of roles in a group template
      *
      * @return null
      ******************************************************************/
      var newRole = RoleManager.getTemplate(title, num);
      var updateDb = false;
      //Check if group is a template
      if (!grp.template) {
        logger.trace("Adding role to a GroupTemplate");
        var target = grp;
      } else {
        logger.trace("Adding role to template of a group");
        updateDb = true; 
        target = grp.template;
      }
      var newRole = RoleManager.getTemplate(title, num);
      if (!isInList(newRole, target.roles, 'title')) {
        target.roles.push(newRole);
        //Update group size
        if (target.size >= 0) {
          if (num < 0) {
            target.size = -1;
          } else {
            target.size += num;
          }
        }
        //Update db fields
        if (updateDb) {
          Groups.update({_id: grp._id}, 
              {
                $push: {'template.roles': newRole},
                $set: {'template.size': target.size}
              }
          );
        }
      } else {
        logger.warn("GroupTemplate already contains given role," +
            " no change made");
      }
      return newRole;
    },

    //create: function(template, users) {
      ///**************************************************************
      //* Create a new group from a tempalte and perform an necessary
      //* initialization
      //**************************************************************/
      //var newGroup = new Group(template);
      //newGroup._id = Groups.insert(newGroup);
      //// Assign users to group if users are given
      //if (users) {
        //for (var i=0; i<users.length; i++) {
          //if (group.isOpen) {
            ////Assign the user and update the db entry
            //this.addUser(group, users[i])
          //}
        //}
      //}
      //return newGroup;
    //},

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
  
    addUser: function(group, user, role) {
      /**************************************************************
      * Adds a user to the group assumes group has capacity unless
      *   isOpen flag is set to false, also updates database entry
      * @Params
      *   group - the group the user will be inserted if there is space
      *   user - user to be added to the group
      *   role - (optional) the role the user will be assigned. 
      *       If none is given, then a random role will be selected
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
    getSize: function(group) {
      return group.template.size;
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
    remove: function(groups) {
      if (hasForEach(groups)) {
        ids = getIDs(groups);
        if (Meteor.isServer) {
          logger.trace("Removing a set of groups using $in");
          Groups.remove({"_id": {$in: ids}}); 
        } else {
          logger.trace("Removing a set of groups individually");
          ids.forEach(function(id) {
            Groups.remove({"_id": id}); 
          });
        }
      } else {
         //groups is just a single group object if not an array
         logger.trace("Removing a single group by ID");
         Groups.remove({_id: groups._id});  
      }
    }
  }; 
}());

