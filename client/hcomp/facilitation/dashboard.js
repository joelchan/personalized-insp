// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Dashboard');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Dashboard', 'trace');
// Logger.setLevel('Client:Hcomp:Dashboard', 'debug');
// Logger.setLevel('Client:Hcomp:Dashboard', 'info');
//Logger.setLevel('Client:Hcomp:Dashboard', 'warn');


var filters = {
	partFilters: [],
	clusterFilters: [],
	gamchanger: [true, false]
}

MS_PER_MINUTE = 60000;

Template.HcompDashboard.rendered = function(){
  
  //Set height of elements to viewport height
  //Navbar height=50, header up to idealist = 150, clustering interface header=63
  var height = $(window).height() - 75; 
  logger.debug("window viewport height = " + height.toString());
  $(".ideas-view").height(height);
  $(".tasks-view").height(height);
  $(".notes-view").height(height);
  logger.debug(height.toString());
  logger.debug((height*0.7).toString());
  $("#big-picture-viz").height(height*0.45);
  $("#ideawordcloud").height(height*0.45);
  $("#scratchpad").height(height*0.45);
  var scratchpadHeight = $("#scratchpad").height();
  // console.log("Scratchpad height:" + scratchpadHeight);
  // $(".scratchpad-form").height(height*0.38);
  $(".scratchpad-form").height(scratchpadHeight*0.8);

  // var filterboxContainerHeight = $('.Hcomp-filterbox-container').height();
  var promptHeaderHeight = $('.ideas-view h1').height();
  var filterboxHeaderHeight = $('#filterbox-header').height();
  var ideaboxHeaderHeight = $('.idea-box-header').height();
  $('.ideadeck-container').height(height
                                  -promptHeaderHeight
                                  -filterboxHeaderHeight
                                  -ideaboxHeaderHeight
                                  -40); // promptheader margin-top/bottom (30) + ideas number header margin-top (10)

  var facActionsHeight = $('.fac-actions').height();
  var inspirationsHeaderHeight = $('.tasks-view h1').height();
  $('#task-card-list').height(height
                              -facActionsHeight
                              -inspirationsHeaderHeight
                              -80); // padding-top/bottom for fac-actions (30) + margin-top/bottom for inspirations header (30) + padding-top/bottom for task-card list

  Session.set("idealistFilters", filters);
  Session.set("selectedParts", []);
  Session.set("selectedIdeas", []);
  
  // make sure we start with a clean slate on render
  FilterManager.reset("IdeaWordCloud Filter", Session.get("currentUser"), "ideas");
  FilterManager.reset("Tasks Filter", Session.get("currentUser"), "tasks");
  
  // FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
  FilterManager.create("IdeaWordCloud Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
  // add different default filter if we are on an experiment dashboard
  var exp = Session.get("currentExp");
  if (exp) {
    // get treatment participant userIDs
    var treatmentIDs;
    // create filter based on those IDs
    FilterManager.create("IdeaWordCloud Filter", Session.get("currentUser"), "ideas", "userID", treatmentIDs);
  }
  FilterManager.create("Tasks Filter", Session.get("currentUser"), "tasks", "promptID", Session.get("currentPrompt")._id);
  
  };
//
Template.HcompBeginSynthesis.events({
  // 'click .begin-synthesis': function() {
  //   logger.info("Pushing Ideators to begin synthesis");
  //   var groupID = Session.get("currentPrompt").groupIDs[0];
  //   var group = Groups.findOne({_id: groupID});
  //   var userIDs = getValsFromField(group.assignments['HcompIdeator'], '_id');
  //   logger.trace(userIDs);
  //   userIDs.forEach(function (id) {
  //     logger.debug("Updating route for user with id: " + id);
  //     MyUsers.update({_id: id}, {$set: {'route': "MturkSynthesis"}});
  //   });
  // },
});

///********************************************************************
//* Template Helpers
//*********************************************************************/


Template.HcompDashIdeabox.helpers({
  prompt : function(){
    return Session.get("currentPrompt").title;
  },
});

Template.HcompOverallStats.helpers({
    // code for ideation stats here
  numIdeasAll : function(){
    // allIdeas = Ideas.find({prompt: {$elemMatch: {_id: Session.get("currentPrompt")._id}}}).fetch();
    // allIdeas = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"), "ideas", "prompt._id").fetch();
    // FilterManager.create("All Ideas Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
    var allIdeas = FilterManager.performQuery("IdeaWordCloud Filter", 
        Session.get("currentUser"),   
        "ideas").fetch();
    return allIdeas.length;
    // return getFilteredIdeas("Ideas Filter").length;
  },

  numIdeatorsAll : function(){
    var userIDs;
    var exp = Session.get("currentExp");
    if (exp) {
      // get treatment userIDs
    } else {
      var groupID = Session.get("currentPrompt").groupIDs[0];
      var group = Groups.findOne({_id: groupID});
      userIDs = getValsFromField(group.assignments['HcompIdeator'], '_id');
    }
    return userIDs.length;
  },
});

Template.HcompIdeaWordCloud.helpers({
    ideas : function() {
        // console.log("calling ideas for HcompIdeaWordCloud");
        cursor = getCloudFromIdeas();
        return cursor;
    },
    getFontSize : function() {
        var count = this.count;
        return 10 +(count * 4);
    },
    getWordCount : function() {
        var count = this.count;
        return count;
    },
    getWord : function() {
        var word = this.word;
        return word;
    }
});

Template.TaskCards.helpers({
    tasks : function() {
        // taskList = Tasks.find({ desc: { $exists: true}}).fetch();
        taskList = FilterManager.performQuery("Tasks Filter", Session.get("currentUser"), "tasks").fetch();
        var sortedTaskList = taskList.sort(function(a,b) { return b.time - a.time});
        return sortedTaskList;
    },
    numTasks : function() {
        // taskList = Tasks.find({ desc: { $exists: true}}).fetch();
        taskList = FilterManager.performQuery("Tasks Filter", Session.get("currentUser"), "tasks").fetch();
        var sortedTaskList = taskList.sort(function(a,b) { return b.time - a.time});
        return sortedTaskList.length;
    }

});

Template.TaskCard.helpers({
    getDescription : function() {
        var description = this.desc;
        return description;
    },
    isNotEdit : function() {
        var edited = this.edited;
        if((edited == true)) {
            return false;
        }
        return true;
    },
    getPriority : function() {
        var priority = this.priority;
        // return priority;
        var message = "";
        switch(priority) {
            case 1:
                message = "Lo";
                break;
            case 2:
                message = "Mid";
                break;
            case 3:
                message = "Hi";
                break;
            default:
                message = "";
                break;
        }
        logger.debug("Priority is " + message);
        return message;
    },

    isLoPriority : function() {
      var priority = this.priority;
      if (priority == 1) {
        return true;
      } else {
        return false;
      }
    },

    isMidPriority : function() {
      var priority = this.priority;
      if (priority == 2) {
        return true;
      } else {
        return false;
      }
    },

    isHiPriority : function() {
      var priority = this.priority;
      if (priority == 3) {
        return true;
      } else {
        return false;
      }
    },

    getIdeators : function() {
        var numAssignedUsers = this.assignments.length;
        var availableUsers = this.num;
        var message = "";
        message = numAssignedUsers + "/" + availableUsers;
        return message;
    },
    getIdeas : function() {
        var ideaIDs = Clusters.findOne({_id : this.ideaNodeID}).ideaIDs;
        var ideas = Ideas.find({_id : {$in : ideaIDs}}).fetch();
        return ideas.length;
    },
    ideaContents : function() {
        var ideaIDs = Clusters.findOne({_id : this.ideaNodeID}).ideaIDs;
        var ideas = Ideas.find({_id : {$in : ideaIDs}}).fetch();
        return ideas;
    },
    // getQuestions : function()
    // {
    //     var questions = this.comments;
    //     var count = questions.length;
    //     return count;
    // },
    getIdeatorCount : function() {
        var count = this.num;
        return count;
    },
    // getIdeaCount : function()
    // {
    //     var count = this.ideasRequested;
    //     return count;
    // },
    // getMinuteCount : function()
    // {
    //     var count = this.minutesRequested;
    //     return count;
    // },
    getID : function() {
        var id = this._id;
        return id;
    }
});

/********************************************************************
* Template Events
*********************************************************************/

Template.HcompDashboard.events({
	
  'click .begin-synthesis': function() {
    // logger.info("Pushing Ideators to begin synthesis");
    var groupID = Session.get("currentPrompt").groupIDs[0];
    var group = Groups.findOne({_id: groupID});
    var userIDs = getValsFromField(group.assignments['HcompIdeator'], '_id');
    logger.trace(userIDs);
    // userIDs.forEach(function (id) {
    //   logger.debug("Updating route for user with id: " + id);
    //   MyUsers.update({_id: id}, {$set: {'route': "MturkSynthesis"}});
    // });
    logger.debug("Sending self to synthesis");
    Router.go('MturkSynthesis', 
        {'promptID': Session.get("currentPrompt")._id, 
        'userID': Session.get("currentUser")._id}
    );
    // MyUsers.update({_id: Session.get("currentUser")._id}, {$set: {'route': "MturkSynthesis"}});
  },

  'click .review-brainstorm' : function() {
    logger.debug("Sending self to review brainstorm page");
    Router.go('HcompResultsPage', {promptID: Session.get("currentPrompt")._id, userID: Session.get("currentUser")._id});
  },

  'click .goto-prompts-page' : function() {
    logger.debug("Sending self to prompts page");
    Router.go('CrowdPromptPage', {userID: Session.get("currentUser")._id});
  },

  'click .gamechangestar' : function(){
    EventLogger.logToggleGC(this);
		IdeaFactory.toggleGameChanger(this);
	},

	'click #new-task-btn' : function(){
		$('#new-prompt').val("");
	},


	'click #task-create' : function(){
		var message = $("#task-description").val();
		// var priorityText = $("#task-priority").val();
    // console.log("Creating task with priority: " + priorityText);
		var priorityNum = parseInt($("#CreateTask" + " input[type='radio'][name='taskPriorityOptions']:checked").val());
		var ideatorsVal = priorityToNumIdeators(priorityNum);
    // var ideatorsVal;
    // switch (priorityNum) {
    //   case 1:
    //     ideatorsVal = parseInt(Session.get("currentGroup").users.length*0.33); // change this later once we have group assignment working
    //     break;
    //   case 2:
    //     ideatorsVal = parseInt(Session.get("currentGroup").users.length*0.66);
    //     break;
    //   case 3:
    //     ideatorsVal = parseInt(Session.get("currentGroup").users.length);
    //     break;
    //   default:
    //     ideatorsVal = parseInt(Session.get("currentGroup").users.length*0.66);
    //     break;
    // }
    // var ideatorsVal = $("#task-ideators").val();
		// var ideasVal = $("#task-ideas").val();
		// var minutesVal = $("#task-minutes").val();

		// switch (priorityText)
		// {
		// 	case "Low":
		// 		priorityNum = 1;
		// 		break;
		// 	case "Medium":
		// 		priorityNum = 2;
		// 		break;
		// 	case "High":
		// 		priorityNum = 3;
		// 		break;
		// 	default: 
		// 		priorityNum = 1;
		// 		break;
		// }
		// var task = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), message, 'open', priority=priorityNum, num=ideatorsVal, ideasRequested=ideasVal, minutesRequested=minutesVal); 
    var task = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), message, 'open', priority=priorityNum, num=ideatorsVal); 
		task._id = Tasks.insert(task);

    // clear the message description
    $("#task-description").val("");

    $('#CreateTask').toggleClass('in');

    $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='1']").prop("checked",false);
    $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='2']").prop("checked",true);
    $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='3']").prop("checked",false);

    // $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='2']").parent().attr("checked","checked");
    // $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='2']").attr("checked","checked");

	},

  'click #task-create-cancel' : function() {
    $('#CreateTask').toggleClass('in');
    $("#task-description").val("");
    $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='1']").prop("checked",false);
    $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='2']").prop("checked",true);
    $("#CreateTask" + " input[type='radio'][name='taskPriorityOptions'][value='3']").prop("checked",false);
  },

	'click .card-edit' : function() {
		var taskID = $(event.target).parent().parent().parent().attr('id');
		console.log(taskID);
		Tasks.update({ _id: taskID },{$set: { edited: true}});
		
		//var task = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), message, 'open', priority=priorityNum, num=ideatorsVal, ideasRequested=ideasVal, minutesRequested=minutesVal); 
		//task._id = Tasks.insert(task);
	},


	'click .task-update' : function() {
		var taskID = $(event.target).parent().parent().parent().parent().attr('id');
		var message = $("#"+taskID + " .task-description").val();
    var priorityNum = parseInt($("#"+taskID + " input[type='radio'][name='taskPriorityOptions']:checked").val());
    var ideatorsVal = priorityToNumIdeators(priorityNum);
		// var priorityText = $("#"+taskID + " .task-priority").val();
		// var priorityNum;
		// var ideatorsVal = $("#"+taskID + " .task-ideators").val();
		// var ideasVal = $("#"+taskID + " .task-ideas").val();
		// var minutesVal = $("#"+taskID + " .task-minutes").val();

		// switch (priorityText)
		// {
		// 	case "Low":
		// 		priorityNum = 1;
		// 		break;
		// 	case "Medium":
		// 		priorityNum = 2;
		// 		break;
		// 	case "High":
		// 		priorityNum = 3;
		// 		break;
		// 	default: 
		// 		priorityNum = 1;
		// 		break;
		// }

		// Tasks.update({ _id: taskID },{$set: { edited: false, desc: message, priority: priorityNum, num: ideatorsVal, ideasRequested: ideasVal, minutesRequested: minutesVal}});
    Tasks.update({ _id: taskID },
                  {$set: {edited: false, 
                          desc: message, 
                          priority: priorityNum, 
                          num: ideatorsVal}});
	},

  'click .task-update-cancel' : function() {
    var taskID = $(event.target).parent().parent().parent().parent().attr('id');
    Tasks.update({ _id: taskID },{$set: { edited: false}});
  },

});

Template.HcompIdeaWordCloud.events({
  'click .cloudItem' : function() {
    var clickedWord = $(event.target).children().context.text;
    currentSearchQuery = $('#search-query').val();
    
    // toggling logic
    if (currentSearchQuery === clickedWord) { 
      $('.search-remove-btn').click();
    } else {
      $('#search-query').val(clickedWord);
      $('.search-apply-btn').click();  
    }
  },
})

function getCloudFromIdeas()
{
	// var ideas = Ideas.find({ content: { $exists: true}}).fetch();
  // var ideas = Ideas.find({ prompt._id : Session.get("currentPrompt")._id}).fetch();
  
  // get prompt specific stopwords
  var promptStopWords = []
  var promptWords = Session.get("currentPrompt").question.split(" ");
  for (var i = 0; i < promptWords.length; i++) {
    promptStopWords[i] = promptWords[i].trim()
                                       .toLowerCase()
                                       .replace(/[^\w\s]|_/g, "")
                                       .replace(/\s{2,}/g," ");
  }
  logger.debug("Prompt stop words: " + promptStopWords.toString());

  var ideas = FilterManager.performQuery("IdeaWordCloud Filter", 
      Session.get("currentUser"),   
      "ideas").fetch();
  // console.log(ideas);
	var cloud = [];
	for (var i = 0; i < ideas.length; i++) {
		var idea = ideas[i].content;
		var words = idea.split(" ");
		for (var j = 0; j < words.length; j++) {
			var word = words[j]
                .trim().toLowerCase()
                .replace(/[^\w\s]|_/g, "")
                .replace(/\s{2,}/g," ");

			var cloudItem = {'word': '', 'count': 0};
			
			var containsWord = Boolean(false);
			for (var k = 0; k < cloud.length; k++) {
				if (cloud[k].word == word) {
					cloud[k].count = cloud[k].count + 1;
					containsWord = Boolean(true);
				}
			}
            // && stopWords.words.indexOf(word) >= 0
            // console.log(stopWords);
            // console.log(stopWords.words)
			if(containsWord == false 
        && stopWords.words.indexOf(word) == -1
        && promptStopWords.indexOf(word) == -1) {
				// console.log(stopWords);
        cloudItem.word = word;
				cloudItem.count = 1;
				cloud.push(cloudItem);
			}
		}	
	}
  var sortedCloud = cloud.sort(function(a,b) {
      if(a.word < b.word) return -1;
      if(a.word > b.word) return 1;
      return 0;
  });
	return sortedCloud;
};

priorityToNumIdeators = function(priorityNum) {
  switch (priorityNum) {
    case 1:
      var prop = 0.33;
      break;
    case 2:
      var prop = 0.66;
      break;
    case 3:
      var prop = 1.0;
      break;
    default:
      var prop = 0.66;
      break;
  }

  var ideatorsValTemp = parseInt(Session.get("currentGroup").users.length*prop);
  if (ideatorsValTemp < 1) {
    var ideatorsVal = 1;
  } else {
    var ideatorsVal = ideatorsValTemp;
  }

  return ideatorsVal;
}
