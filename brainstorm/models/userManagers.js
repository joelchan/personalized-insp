// Configure logger for Tools
var logger = new Logger('Models:UserManager');
// Comment out to use global logging level
//Logger.setLevel('Models:UserManager', 'trace');
//Logger.setLevel('Models:UserManager', 'debug');
Logger.setLevel('Models:UserManager', 'info');
//Logger.setLevel('Models:UserManager', 'warn');

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
      var isGroup = false;
      //Check if group is a template
      if (!grp.template) {
        logger.trace("Adding role to a GroupTemplate");
        var target = grp;
      } else {
        logger.trace("Adding role to template of a group");
        isGroup = true; 
        target = grp.template;
      }
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
        if (isGroup) {
          grp.assignments[newRole.title] = [];
          //Update db fields
          Groups.update({_id: grp._id}, 
              {
                $push: {'template.roles': newRole},
                $set: {'template.size': target.size, 
                    'assignments': []
                }
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
      if (group.template.size < 0) {
        return -1;
      } else {
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
        //var roles = group.template.roles;
        //for (var i=0; i<roles.length; i++) {
          //numSlots += roles[i].num;
        //}
        //Return the difference
        return group.template.size - numAssigned;
      }
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
      logger.debug("number of assigned to role, " + role + " " + 
          group.assignments[role].length);
      logger.debug("number of possible to role, " + role + " " + 
          this.getSize(group, role));
      if (group.isOpen && 
          ((this.getSize(group, role) > group.assignments[role].length) ||
           (this.getSize(group) < 0))) {
        if (!role) {
          //Get role if not already given
          role = this.getRandomRole(group);
        } else {
          //Get role based on role title given
          role = RoleManager.defaults[role];
        }
        if (!isInList(user, group.users, '_id')) {
          logger.debug("adding new user to group with id: " + user._id);
          group.users.push(user);
        } else {
          logger.warn("Attempting to add already present user to group");
          //Return the role already assigned to the user
          return this.getRole(group, user); 
        }
        //logger.debug("list of userIDs: " +JSON.stringify(getIDs(group.users)));
        //Add group to user
        user.groupID = group._id;
        //Add User to the list of users assigned to a specific fole
        logger.debug(group.assignments);
        group.assignments[role.title].push(user);
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
        //Update user in db
        MyUsers.update({_id: user._id},
            {$set: {'groupID': group._id}}
        );
        return role;
      } else {
        if (isInList(user, group.users, '_id')) {
          //Return the role already assigned to the user
          logger.trace("user already in full group");
          return this.getRole(group, user); 
        } else {
          logger.trace("Group or role is full, could not assign user");
          return null;
        }
      }
    },
    getSize: function(group, title) {
      /**************************************************************
       * Get the size of the group, or the number of slots for a 
       * given role with title
       ************************************************************/
      if (title) {
        //If a role title is given, find the size fo the role
        logger.trace("Getting size of role in group: " + title);
        logger.debug(group.template.roles);
        var result = 0;
        group.template.roles.forEach(function(role) {
          if (role.title.trim() == title.trim()) {
            logger.debug("size of role is: " + role.num);
            result =  role.num;
          }
        });
        return result;
      }
      //Get the size fo the full group
      logger.trace("Getting size of group");
      return group.template.size;
    },
    getRole: function(group, user) {
      /**************************************************************
       * Retieve the role assigned to a given user in the group.
       * Null if user is not assigned
       *************************************************************/
      var roles = group.template.roles;
      for (var i=0; i<roles.length; i++) {
        var title = roles[i].title;
        if (isInList(group[title], user, '_id')) {
          return roles[i];
        }
      }
      return null;
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
