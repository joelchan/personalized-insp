var filters = {
	partFilters: [],
	clusterFilters: [],
	gamchanger: [true, false]
}

MS_PER_MINUTE = 60000;

Template.HcompDashboard.rendered = function(){

  Session.set("idealistFilters", filters);
  Session.set("selectedParts", []);
  Session.set("selectedIdeas", []);
  
  // make sure we start with a clean slate on render
  FilterManager.reset("IdeaWordCloud Filter", Session.get("currentUser"), "ideas");
  FilterManager.reset("Tasks Filter", Session.get("currentUser"), "tasks");
  
  
  FilterManager.create("IdeaWordCloud Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
  FilterManager.create("Tasks Filter", Session.get("currentUser"), "tasks", "promptID", Session.get("currentPrompt")._id);
  
  // window.scrollTo(0,0);
  // $('.menu-link').bigSlide();
  // Notifications.find({
  //   recipientIDs: Session.get("currentUser")._id,
  //   'type.val': NotificationTypes.REQUEST_HELP.val
  //   }).observe({
  //   added: function(newMsg) {
  //     console.log("***********************************************");
  //     console.log("***********************************************");
  //     console.log(newMsg)
  //     console.log("Alert generated handled");
  //     console.log("***********************************************");
  //     console.log("***********************************************");
  //     var msgSenderDivID = '#uname-' + newMsg.sender;
  //     var alertDivID = msgSenderDivID + " .alert-msg";
  //     if (!newMsg.handled && ($(alertDivID).length == 0)) {
  //       var msg = UI.render(Template.HelpMessage);
  //       UI.insert(msg, $(msgSenderDivID)[0]);
  //     }
  //     if (!$(msgSenderDivID).hasClass("flashing")) {
  //       $(msgSenderDivID).addClass("flashing");
  //       var alertTimer = {'time': 10};
  //       Session.set(msgSenderDivID, alertTimer);
  // 		  alertTimer['interval'] = Meteor.setInterval(function(){
  //         console.log("message alert interval");
  //         var alertTime = Session.get(msgSenderDivID);
  //         if (alertTime['time'] != 0) {
  // 			    $(msgSenderDivID).toggleClass('flash-alert');
  //           alertTime['time'] = alertTime['time'] - 1;
  //           Session.set(msgSenderDivID, alertTime)
  //         } else {
  //           $(msgSenderDivID).removeClass("flashing");
  //           Meteor.clearTimeout(alertTime['interval']);
  //         }

  // 		  }, 500);
  //       Session.set(msgSenderDivID, alertTimer);
  //     }
  //   },
      
  // 	changed: function(newMsg, oldMsg){
  //     console.log("***********************************************");
  //     console.log("***********************************************");
  //     console.log(newMsg)
  //     console.log("Msg handled");
  //     console.log("***********************************************");
  //     console.log("***********************************************");
  //     var msgSenderDivID = '#uname-' + newMsg.sender;
  //     var alertDivID = msgSenderDivID + " .alert-msg";
  //     if (newMsg.handled) {
  //       console.log("Msg handled");
  //       $(alertDivID).remove();
  //       if (!$(msgSenderDivID).hasClass("flash-alert")) {
  //         $(msgSenderDivID).removeClass("flash-alert");
  //       }
  //       if (!$(msgSenderDivID).hasClass("flashing")) {
  //         $(msgSenderDivID).removeClass("flashing");
  //         Meteor.clearTimeout(
  //           Session.get(msgSenderDivID)['interval']
  //         );
  //       }
  //     } else {
  //       console.log("Alert generated handled");
  //       //$('#uname-' + newMsg.sender)
  //     }
  //   }
  // });

}

Template.HcompIdeaWordCloud.rendered = function () 
{
    //console.log(getCloudFromIdeas());
}

/********************************************************************
* Template Helpers
*********************************************************************/

Template.HcompDashboard.helpers({
	// ideas : function(){
	// 	var cursor = FilterManager.performQuery("Ideas Filter", 
 //      Session.get("currentUser"),
 //      "ideas"
 //    );
	// 	return cursor;
 //  	},


 //  	gamechangers : function(){
 //  		return false;
 //  	},


 //  	selectedparts : function(){
 //  		return MyUsers.find({_id: {$in: Session.get("selectedParts")}});
 //  	},

 //  	participants : function(){
	// 	// return MyUsers.find({type: "Experiment Participant"});
	// 	return MyUsers.find({type: "Ideator"});
	// 	// return FilterManager.performQuery(userSeriesFilter,Session.get("currentUser"),"myUsers");
	// },

  	//partFilters : function(){
  		//return MyUsers.find({_id: {$in: Session.get("idealistFilters").partFilters}});
  	//},
//
  	//clusterFilters : function(){
  		//return Session.get("idealistFilters").clusterFilters;
  	//}
});

Template.HcompDashIdeabox.helpers({
  prompt : function(){
    return Session.get("currentPrompt").question;
  },
});

Template.HcompOverallStats.helpers({
    // code for ideation stats here
});

Template.HcompIdeaWordCloud.helpers(
{
    ideas : function()
    {
        // console.log("calling ideas for HcompIdeaWordCloud");
        cursor = getCloudFromIdeas();
            return cursor;
    },
    getFontSize : function()
    {
        var count = this.count;
            return 10 +(count * 4);
    },
    getWordCount : function()
    {
        var count = this.count;
        return count;
    },
    getWord : function()
    {
        var word = this.word;
        return word;
    }
});



Template.TaskCards.helpers(
{
    tasks : function() {
        // taskList = Tasks.find({ desc: { $exists: true}}).fetch();
        taskList = FilterManager.performQuery("Tasks Filter", Session.get("currentUser"), "tasks").fetch();
        var sortedTaskList = taskList.sort(function(a,b) { return b.time - a.time});
        return sortedTaskList;
    }
});

Template.TaskCard.helpers(
{
    getDescription : function()
    {
        var description = this.desc;
        return description;
    },
    isNotEdit : function()
    {
        var edited = this.edited;
        if((edited == true))
        {
            return false;
        }
        return true;
    },
    getPriority : function()
    {
        var priority = this.priority;
        var message = "";
        switch(priority)
        {
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
            return message;
    },
    getIdeators : function()
    {
        var numAssignedUsers = this.assignments.length;
        var availableUsers = this.num;
        var message = "";
        message = numAssignedUsers + "/" + availableUsers;
        return message;
    },
    getIdeas : function()
    {
        var ideaIDs = Clusters.findOne({_id : this.ideaNodeID}).ideaIDs;
        var ideas = Ideas.find({_id : {$in : ideaIDs}}).fetch();
        return ideas.length;
    },
    ideaContents : function()
    {
        var ideaIDs = Clusters.findOne({_id : this.ideaNodeID}).ideaIDs;
        var ideas = Ideas.find({_id : {$in : ideaIDs}}).fetch();
        return ideas;
    },
    getQuestions : function()
    {
        var questions = this.comments;
        var count = questions.length;
        return count;
    },
    getIdeatorCount : function()
    {
        var count = this.num;
        return count;
    },
    getIdeaCount : function()
    {
        var count = this.ideasRequested;
        return count;
    },
    getMinuteCount : function()
    {
        var count = this.minutesRequested;
        return count;
    },
    getID : function()
    {
        var id = this._id;
        return id;
    }
});

/********************************************************************
* Template Events
*********************************************************************/

Template.HcompDashboard.events({
	'click .gamechangestar' : function(){
    EventLogger.logToggleGC(this);
		IdeaFactory.toggleGameChanger(this);
	},

	'click #new-task-btn' : function(){
		$('#new-prompt').val("");
	},


	'click #task-create' : function()
	{
		var message = $("#task-description").val();
		var priorityText = $("#task-priority").val();
		var priorityNum;
		var ideatorsVal = $("#task-ideators").val();
		var ideasVal = $("#task-ideas").val();
		var minutesVal = $("#task-minutes").val();

		console.log(priorityText);
		switch (priorityText)
		{
			case "Low":
				priorityNum = 1;
				break;
			case "Medium":
				priorityNum = 2;
				break;
			case "High":
				priorityNum = 3;
				break;
			default: 
				priorityNum = 1;
				break;
		}
		var task = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), message, 'open', priority=priorityNum, num=ideatorsVal, ideasRequested=ideasVal, minutesRequested=minutesVal); 
		task._id = Tasks.insert(task);
	},

	'click .card-edit' : function()
	{
		var taskID = $(event.target).parent().parent().parent().attr('id');
		console.log(taskID);
		Tasks.update({ _id: taskID },{$set: { edited: true}});
		
		//var task = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), message, 'open', priority=priorityNum, num=ideatorsVal, ideasRequested=ideasVal, minutesRequested=minutesVal); 
		//task._id = Tasks.insert(task);
	},


	'click .task-update' : function()
	{
		var taskID = $(event.target).parent().parent().parent().parent().attr('id');
		var message = $("#"+taskID + " .task-description").val();
		var priorityText = $("#"+taskID + " .task-priority").val();
		var priorityNum;
		var ideatorsVal = $("#"+taskID + " .task-ideators").val();
		var ideasVal = $("#"+taskID + " .task-ideas").val();
		var minutesVal = $("#"+taskID + " .task-minutes").val();

		switch (priorityText)
		{
			case "Low":
				priorityNum = 1;
				break;
			case "Medium":
				priorityNum = 2;
				break;
			case "High":
				priorityNum = 3;
				break;
			default: 
				priorityNum = 1;
				break;
		}

		Tasks.update({ _id: taskID },{$set: { edited: false, desc: message, priority: priorityNum, num: ideatorsVal, ideasRequested: ideasVal, minutesRequested: minutesVal}});
	},

});

function getCloudFromIdeas()
{
	// var ideas = Ideas.find({ content: { $exists: true}}).fetch();
  // var ideas = Ideas.find({ prompt._id : Session.get("currentPrompt")._id}).fetch();
  var ideas = FilterManager.performQuery("IdeaWordCloud Filter", 
      Session.get("currentUser"),   
      "ideas").fetch();
  // console.log(ideas);
	var cloud = [];
	for (var i = 0; i < ideas.length; i++) 
	{
		var idea = ideas[i].content;
		var words = idea.split(" ");
		for (var j = 0; j < words.length; j++) 
		{
			var word = words[j]
                .trim().toLowerCase()
                .replace(/[^\w\s]|_/g, "")
                .replace(/\s{2,}/g," ");

			var cloudItem = {'word': '', 'count': 0};
			
			var containsWord = Boolean(false);
			for (var k = 0; k < cloud.length; k++) 
			{
				if (cloud[k].word == word) 
				{
					cloud[k].count = cloud[k].count + 1;
					containsWord = Boolean(true);
				}
			}
            // && stopWords.words.indexOf(word) >= 0
            // console.log(stopWords);
            // console.log(stopWords.words)
			if(containsWord == false && stopWords.words.indexOf(word) == -1)
			{
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
    }