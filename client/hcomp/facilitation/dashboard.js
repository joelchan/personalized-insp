// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Dashboard');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Dashboard', 'trace');
// Logger.setLevel('Client:Hcomp:Dashboard', 'debug');
// Logger.setLevel('Client:Hcomp:Dashboard', 'info');
// Logger.setLevel('Client:Hcomp:Dashboard', 'warn');


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
  //logger.debug(height.toString());
  //logger.debug((height*0.7).toString());
  $("#big-picture-viz").height(height*0.65);
  $("#ideawordcloud").height(height*0.55);
  $("#scratchpad").height(height*0.25);
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
  FilterManager.reset("Tasks Filter", Session.get("currentUser"), "tasks");
  FilterManager.create("Tasks Filter", Session.get("currentUser"), "tasks", "promptID", Session.get("currentPrompt")._id);
  FilterManager.create("Tasks Filter", Session.get("currentUser"), "tasks", "groupID", Session.get("currentExp").groupID);
  
};

Template.HcompIdeaWordCloud.rendered = function() {
    FilterManager.reset("IdeaWordCloud Filter", Session.get("currentUser"), "ideas");
    //logger.trace("Creating default filter for ideawordcloud filter");
    createDefaultIdeasFilter("IdeaWordCloud Filter");
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
    //console.log("ALLIDEAS");
    //console.log(allIdeas);
    return allIdeas.length;
    // return getFilteredIdeas("Ideas Filter").length;
  },

  numIdeatorsAll : function(){
    var userIDs;
    var exp = Session.get("currentExp");
    if (exp) {
      var numIdeators = 0;
      var participants = Conditions.findOne({expID: exp._id, description: "Treatment"}).assignedParts;
      participants.forEach(function(pID) {
        var part = Participants.findOne({_id: pID});
        if (part.hasStarted) {
          numIdeators += 1;
        }
      });
      return numIdeators;
    } else {
      var groupID = Session.get("currentPrompt").groupIDs[0];
      var group = Groups.findOne({_id: groupID});
      userIDs = getValsFromField(group.assignments['HcompIdeator'], '_id');
      return userIDs.length;
    }
  },
});

Template.HcompIdeaWordCloud.helpers({
    ideas : function() {
        // console.log("calling ideas for HcompIdeaWordCloud");
        cursor = getFilteredIdeas("Ideas Filter"); //getCloudFromIdeas();
        return cursor;
    },
    getFontSize : function() {
        var count = this.count;
        //console.log(count);
        //console.log("this:")
        //console.log(this);
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
    //logger.debug("Sending self to synthesis");
    Router.go('MturkSynthesis', 
        {'promptID': Session.get("currentPrompt")._id, 
        'userID': Session.get("currentUser")._id}
    );
    // MyUsers.update({_id: Session.get("currentUser")._id}, {$set: {'route': "MturkSynthesis"}});
  },

  'click .review-brainstorm' : function() {
    //logger.debug("Sending self to review brainstorm page");
    Router.go('HcompResultsPage', {promptID: Session.get("currentPrompt")._id, userID: Session.get("currentUser")._id});
  },

  'click .goto-prompts-page' : function() {
    //logger.debug("Sending self to prompts page");
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

function getCloudFromIdeas() {
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
  //logger.debug("Prompt stop words: " + promptStopWords.toString());
  var firstIdeas = FilterManager.performQuery("IdeaWordCloud Filter", 
      Session.get("currentUser"),   
      "ideas").fetch();
  console.log("old ideas:")
  console.log(firstIdeas)
  var ideas = getFilteredIdeas("Ideas Filter");
  console.log("new ideas:")
  console.log(ideas)
  // logger.trace("Found ideas for word cloud: " + JSON.stringify(ideas));
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

			var cloudItem = {'word': '', 'count': 0, 'likes':0};
			cloudItem.likes = ideas[i].votes.length;
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
				cloudItem.count += 1;
				cloud.push(cloudItem);
			}
		}	
	}
  var sortedCloud = cloud.sort(function(a,b) {
      if(a.word < b.word) return -1;
      if(a.word > b.word) return 1;
      return 0;
  });
  console.log("CLOUD");
  console.log(sortedCloud);
	return sortedCloud;
};

priorityToNumIdeators = function(priorityNum) {
  switch (priorityNum) {
    case 1:
      var prop = 1/3;
      break;
    case 2:
      var prop = 2/3;
      break;
    case 3:
      var prop = 3/3;
      break;
    default:
      var prop = 2/3;
      break;
  }
  var exp = Session.get("currentExp");
  logger.trace("Current experiment: " + JSON.stringify(exp));
  if (exp) {
    var ideators = []
    var participants = Conditions.findOne({expID: exp._id, description: "Treatment"}).assignedParts;
    participants.forEach(function(pID) {
      var part = Participants.findOne({_id: pID});
      if (part.hasStarted) {
        ideators.push(part._id)
      }
    });
    logger.trace("Participants in treatment condition who have started experiment: " + JSON.stringify(ideators));
    var ideatorsValTemp = parseInt(ideators.length*prop);
  } else {
    var ideatorsValTemp = parseInt(Session.get("currentGroup").users.length*prop);
  }
  if (ideatorsValTemp < 1) {
    var ideatorsVal = 1;
  } else {
    var ideatorsVal = ideatorsValTemp;
  }

  return ideatorsVal;
}

/************************
Word Bubble Visualization
*************************/

function drawBubbles() {

var margin = {
    top: 120,
    right: 0,
    bottom: 0,
    left: 0
    },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var n = 56,
    m = 1,
    padding = 16,
    radius = d3.scale.sqrt().range([0, 25]),
    color = d3.scale.category10().domain(d3.range(m)),
    x = d3.scale.ordinal().domain(d3.range(m)).rangePoints([0, width], 1);


//input the cloudItems, map each item to an object with
var cloud =  getCloudFromIdeas();

var nodes = cloud.map(function (item) {
    var i = Math.floor(Math.random() * m); //color
       // v = (i + 1) / m * -Math.log(Math.random()); //value
    return {
        radius: radius(item.count),
        color: color(i),
        cx: x(i),
        cy: height / 3,
        title: item.word,
        likes: item.likes
    };

});



console.log("nodes are:");
console.log(nodes);

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#svgdiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var rem = svg.selectAll("circle")
    .data(nodes, function(d) {return d})
    .exit()
    .style("fill", "grey");


var circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", function (d) {return d.radius;})
    .attr("fill", function(d) {if (d.likes==1) {return "green";} 
                                             else {return "red";};})
    .call(force.drag);

    circle.remove()


console.log("rem:")
console.log(rem[0])


var tex = svg.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("x", function (d) {
      return d.cx-d.radius;
    })
    .attr("y", function (d) {
      return d.cy;
    })
    .text(function(d) {return d.title;})
    .style("font-size", function(d) {return d.radius/2;})
    .style("stroke", function(d) {if (d.likes==1) {return "green";} 
                                             else {return "red";};})
    .call(force.drag);


function tick(e) {
    circle.each(gravity(.1 * e.alpha))
        .each(collide(.5))
        .attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    });
    tex.each(gravity(.2 * e.alpha))
        .each(collide(.5))
        .attr("x", function (d) {
        return d.x-17;
    })
        .attr("y", function (d) {
        return d.y;
    });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
    return function (d) {
        d.y += (d.cy - d.y) * alpha /2;
        d.x += (d.cx - d.x) * alpha /2;
    };
}

// Resolve collisions between nodes.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = d.radius + radius.domain()[1] + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

}



Template.HcompOtherViz.rendered = function() {
  Deps.autorun(function() {
    //get the new dataset 
    //var ideas = getFilteredIdeas("Ideas Filter");

    //selectAll svg elements that correspond, then bind the relevant data to it

    //enter

    //transition

    //exit....remove()
    drawBubbles();
  })
  
}

function formatData(rawIdeas) {

  //takes a list of objects creates list of objects 
    // {id:i , idea:content, categories:[], quality:votes.length}

  var newData = [];

  for (var i = 0; i < rawIdeas.length; i++) {
    var id = i+1
    var idea = rawIdeas[i].content
    var quality = rawIdeas[i].votes.length

    var obj = {"id":1, "idea":" ", "categories":[" "], "quality":0 }

    obj.id = id
    obj.idea = idea 
    obj.quality = quality 

    newData.push(obj);
  }

  return newData;
}

Template.ForceV.rendered = function() {

  var rawIdeas = getFilteredIdeas("Ideas Filter");

  var newData = formatData(rawIdeas)

  incomingIdeaData =  
  [
    {    "id":1,    "idea":"sleep schedule",    "categories":["Health and Wellbeing"],    "quality":0  },
    {    "id":2,    "idea":"health-centered app",    "categories":["Health and Wellbeing"],    "quality":2  },
    {    "id":3,    "idea":"something to track strength over time",    "categories":["Health and Wellbeing"],    "quality":4  },
    {    "id":4,    "idea":"workout routines for EMTs",    "categories":["Health and Wellbeing"],    "quality":5  },
    {    "id":5,    "idea":"game to test finger dexterity",    "categories":["Skillbuilding"],    "quality":5  },
    {    "id":6,    "idea":"well-being monitor",    "categories":["Health and Wellbeing"],    "quality":4  },
    {    "id":7,    "idea":"an app to share funny stories about the things they see",    "categories":["Emotional support"],    "quality":6  },
    {    "id":8,    "idea":"critical incident support guide",    "categories":["Health and Wellbeing"],    "quality":6  },
    {    "id":9,    "idea":"EMT task checklist",    "categories":["Workflow Improvement"],    "quality":5  },
    {    "id":10,    "idea":"group journalling app",    "categories":["Emotional support"],    "quality":6  },
    {    "id":11,    "idea":"messenger app for work ",    "categories":["Workflow Improvement"],    "quality":3  },
    {    "id":12,    "idea":"health resource app",    "categories":["Emotional support"],    "quality":4  },
    {    "id":13,    "idea":"Quick access to first aid instructions",    "categories":["Workflow Improvement"],    "quality":6  },
    {    "id":14,    "idea":"app to tell family/friends when they'll get off work",    "categories":["Family/friends support"],    "quality":5  },
    {    "id":15,    "idea":"game where person drives around a map as quickly as possible",    "categories":["Gamification"],    "quality":6  },
    {    "id":16,    "idea":"app to log best practices for specific situations for other EMTs",    "categories":["Skillbuilding"],    "quality":6  },
    {    "id":17,    "idea":"app that tracks career skillbuilding",    "categories":["Skillbuilding"],    "quality":5  },
    {    "id":18,    "idea":"EMT social network",    "categories":["Emotional support"],    "quality":60  },
    {    "id":19,    "idea":"upload health information using mobile data",    "categories":["Workflow Improvement"],    "quality":6  },
    {    "id":20,    "idea":"Family activity planner",    "categories":["Family/friends support"],    "quality":2  },
    {    "id":21,    "idea":"using cameras to recognize injuries",    "categories":["Workflow Improvement"],    "quality":6  },
    {    "id":22,    "idea":"app for building strength at the gym (can be a game)",    "categories":["Health and Wellbeing"],    "quality":4  },
    {    "id":23,    "idea":"use fingerprint technology to identify individual",    "categories":["Workflow Improvement"],    "quality":2  },
    {    "id":24,    "idea":"app to track driving record",    "categories":["Logging and Performance"],    "quality":4  },
    {    "id":25,    "idea":"Job skill assessment",    "categories":["Skillbuilding"],    "quality":2  },
    {    "id":26,    "idea":"using vibrations/sound to identify proximity to patient",    "categories":["Workflow Improvement"],    "quality":6  },
    {    "id":27,    "idea":"Cheerleader/coach app for emotional support at end of day",    "categories":["Emotional support"],    "quality":5  },
    {    "id":28,    "idea":"app for quick tutorials about career-advancing skills (e.g., how to use excel)",    "categories":["Skillbuilding"],    "quality":4  },
    {    "id":29,    "idea":"Communication systems game",    "categories":["Communication", "Gamification"],    "quality":2  },
    {    "id":30,    "idea":"Medical codes/procedures game",    "categories":["Gamification"],    "quality":20  },
    {    "id":31,    "idea":"\"Work mode\" for the phone",    "categories":["Workflow Improvement"],    "quality":50  },
    {    "id":32,   "idea":"upload patient data using voice recording to cross reference what they said at time of accident versus post accident",    "categories":["Workflow Improvement"],    "quality":6  },
    {    "id":33,    "idea":"use app to visualize health status of patient - connected to devices that measure it such as heart rate monitor,blood pressure etc",   "categories":["Workflow Improvement"],   "quality":7  },
    {    "id":34,    "idea":"Aggregate communications log",   "categories":["Communication", "Logging and Performance"],    "quality":4  },
    {    "id":35,    "idea":"Patient info/status",    "categories":["Logging and Performance"],    "quality":10  },
    {    "id":36,    "idea":"Password protected files",    "categories":["Data/Job tasks"],   "quality":1  },  
    {    "id":37,    "idea":"walkie talkie app",    "categories":["Communication", "hospital, dispatch, cops"],    "quality":2  },
    {    "id":38,    "idea":"Frequent injuries based on area",   "categories":["Workflow Improvement"],    "quality":7  },
    {    "id":39,    "idea":"App that records things done well - offers a reward system for successes - based on roland's need to reassurance while on the job that he is meeting expectations",    "categories":["Logging and Performance"],    "quality":6  },
    {    "id":40,    "idea":"Newsfeed of all EMTs",    "categories":["Community/ Support"],    "quality":6  },
    {    "id":41,    "idea":"gamification of good performance - inspires them to do certain procedure properly",    "categories":["Logging and Performance", "Gamification"],    "quality":5  },
    {    "id":42,    "idea":"Shift/driver/assignment",   "categories":["Logging and Performance"],    "quality":7  },
    {    "id":43,    "idea":"post-critical incident assessment",    "categories":["Communication", "hospital, dispatch, cops"],    "quality":6  },
    {    "id":44,    "idea":"Unrelated stress relief game (angry birds) that passively builds skills",    "categories":["Apps for after work hours", "Skillbuilding"],    "quality":5  },
    {    "id":45,    "idea":"\"Rookie\" app - Learn the basics",    "categories":["Gamification"],    "quality":2  },
    {    "id":46,    "idea":"app that shows the most dangerous areas of the city based on EMT-generated logs (e.g., intersection of X and Y is known to be bad)",    "categories":["Data/Job tasks"],   "quality":7  },
    {    "id":47,    "idea":"Dictated status logging for events and comms",    "categories":["Communication","Logging and Performance"],    "quality":5  },
    {    "id":48,    "idea":"app that sends notifications to EMT's family in the case that somehting happens to the EMT",    "categories":["Family/friends support"],    "quality":5  },
    {    "id":49,    "idea":"driving game where person learns how to get around traffic/streets better",    "categories":["Gamification"],    "quality":6  },
    {    "id":50,    "idea":"app that chronicles positive on the job stories",    "categories":["Emotional support"],    "quality":5  },
    {    "id":51,    "idea":"app that sends bits of inspiration (quotes, pictures, etc) for EMTs when they're burnt out/tired",    "categories":["Emotional support"],    "quality":7  },
    {    "id":52,    "idea":"Send pics to other parties (hospital or cops)",    "categories":["Communication", "hospital, dispatch, cops"],    "quality":5  }
  ];


  //generateIdeaData(); 

  // incomingIdeaData = parseGraph("bb5MupdMxKKk6qgkN");

  CreateForceDiagram(GetForceData(newData));

}

function GetForceData(ideaData)
{
  // Get Category Affinity Matrix
  var categoryAffinity = getCategoryAffinity(ideaData);

  // Get Term Affinity Matrix
  var termAffinity = getTermAffinity(ideaData);

  // Get Combined Affinity Matrix
  var combinedAffinity = getCombinedAffinity(categoryAffinity, termAffinity)

  //var forceData = createForceData(categoryAffinity, ideaData);
  //var forceData = createForceData(termAffinity, ideaData);
  var forceData = createForceData(combinedAffinity, ideaData);

  return forceData;
}

/********************************************************************
* Visualization - Create Graph Data Logic
********************************************************************/


function generateIdeaData()
{
  createGraph();
  
}

function createGraph()
{
  var promptID = 0;
  var groupID = 0;
  var userID = 0;
  Meteor.call('graphCreate', promptID, groupID, userID, function (error, result)  
  {
    var graphId = result;
    //var graph = Graphs.findOne({'_id': graphId});
    populateGraph(graphId);
  });
}

function populateGraph(graphId)
{
  var metadata = {};
  metadata['name'] = "Action"
  Meteor.call('graphCreateThemeNode', graphId, metadata, function (error, result)   
  {
    var themeNodeId = result._id;
    createAndLinkChild(graphId, themeNodeId);
  });

}

function createAndLinkChild(graphId, themeNodeId)
{
  var idea = Ideas.findOne();
  var ideaId = idea._id;
  var metaData = {'themeId': themeNodeId};
  Meteor.call('graphCreateIdeaNode', graphId, ideaId, metaData, function (error, result)  
  {
    var ideaNodeID = result._id;
    var ideaNode = Nodes.findOne({'graphID': graphId,'_id': ideaNodeID});
    var themeNodeId = ideaNode.themeId;
    Meteor.call('graphLinkChild', themeNodeId, ideaNodeID, {});
  });
}


/********************************************************************
* Visualization - Parse Graph Logic
********************************************************************/


function parseGraph(graphId)
{
  var ideaData = [];
  // Get Graph
  var graph = Graphs.findOne({'_id': graphId});
  // Get Idea Nodes
  var ideaNodes = getIdeaNodes(graph);
  for(var i = 0; i < ideaNodes.length; i++)
  { 
    var ideaNode = ideaNodes[i];
    var ideaNodeID = ideaNode._id;
    var ideaNodeContent = ideaNode.content;
    var ideaNodeVote = ideaNode.vote;
    if(ideaNodeVote == false)
    {
      ideaNodeVote = 1;
    }
    var ideaNodeThemes = getIdeaNodeThemes(ideaNodeID, graphId);
    var ideaDataItem = createIdeaDataItem(ideaNodeID, ideaNodeContent, ideaNodeThemes, ideaNodeVote);
    
    ideaData.push(ideaDataItem);
  } 

  return ideaData;
}

function getIdeaNodes(graph)
{
  var ideaNodes = [];
  for(var i = 0; i < graph.nodeIDs.length; i++)
  {
    var nodeId = graph.nodeIDs[i];
    var node = Nodes.findOne({'graphID': graph._id,'_id': nodeId});
    
    if(node.type == 'idea')
    {
      ideaNodes.push(node);
    }

  }

  //Nodes.find({'graphID': graphId,'type': 'idea'});
  
  return ideaNodes;
}

function getIdeaNodeThemes(ideaNodeID, graphId)
{
  var ideaNodeThemes = [];
  // Get parent-child edges with this node as a child
  var parentChildEdges = Edges.find({'type': 'parent_child', 'childID': ideaNodeID}).fetch();
  // Get parent nodes (themes)
  for(var i = 0; i < parentChildEdges.length; i++)
  {
    var themeId = parentChildEdges[i].parentID;
    var themeNode = Nodes.findOne({'graphID': graphId,'_id': themeId});

    // Used for category membership, we could also use the id to allow duplicate names for different themes
    var themeName = themeNode.name;
    ideaNodeThemes.push(themeName);
  }
  return ideaNodeThemes;
}

function createIdeaDataItem(id, idea, categories, quality)
{
  var ideaDataItem = {'id': id, 'idea': idea, 'categories': categories, 'quality': quality};
  return ideaDataItem;
}


////////////////////////////////////////////////////////////////////////////
//  this.nodeIDs = [];
//  this.edgeIDs = [];
// Meteor.call('graphCreate', prompt, group, user);
// Meteor.call('graphCreateNode', graph, metadata);
// graphCreateThemeNode: function(graphID, metadata)
// graphCreateIdeaNode: function(graphID, ideaID, metadata)
// graphCreateEdge: function(type, sourceID, targetID, metadata)
// graphCreateNode: function(graphID, type, metadata)
//  graphCreate: function(promptID, groupID, userID)
//   graphLinkChild: function(parentID, childID, metadata)

/********************************************************************
* Visualization - Helper Function Logic
********************************************************************/
function getMetaData(ideaData)
{
  //Find all categories and ideaKeys present in data
  var ideaKeys = [];
  var categories = [];
  for(var i = 0; i < ideaData.length; i++)
  {
    var ideaKey = ideaData[i].id;
    ideaKeys[ideaKeys.length] = ideaKey;
    var ideaCategories = ideaData[i].categories;
    for(var j = 0; j < ideaCategories.length; j++)
    {
      var category = ideaCategories[j];
      if(categories.indexOf(category) == -1)
      {
        categories[categories.length] = category;
      }
    }
    

  }
  categories.sort();
  var metaData = {"ideaKeys": ideaKeys, "categories": categories};
  
  return metaData;
}


/********************************************************************
* Visualization - Term Affinity (tf-idf weighting) Logic
********************************************************************/

function getTermAffinity(ideaData)
{
  //Find all ideaKeys present in data
  var metaData = getMetaData(ideaData)
  var ideaKeys = metaData.ideaKeys;

  // Corpus = Collection of all documents
  // Document = One unit of textual data (for example, webpages, ideas, or blog posts)
  // Term = One word from a document that is not a stop word
  var corpus = {"terms":[], "documents": []};
  corpus = populateCorpus(corpus, ideaData)

  //Create raw empty matrix
  var rawEmptyMatrix = createEmptyMatrix(ideaKeys.length, corpus.terms.length);


  // Create Term Weight Matrix
  var termWeightMatrix = createTermMatrix(ideaKeys, corpus.terms, rawEmptyMatrix);

  // Populate Term Weight Matrix
  termWeightMatrix = populateTermMatrix(corpus, termWeightMatrix);
  
  //Normalize Term Weight Matrix
  var normalizedTermWeightMatrix = normalizeMatrix(termWeightMatrix, termWeightMatrix.terms.length);

  //Create pair-wise afinity matrix for Term weights
  var rawAffinityMatrix = populatePairwiseAffinityMatrix(termWeightMatrix, normalizedTermWeightMatrix);

  var termAffinityMatrix = createTermAffinityMatrix(ideaKeys, rawAffinityMatrix);
  return termAffinityMatrix;
}

function createTermMatrix(ideaKeys, terms, rawEmptyMatrix)
{
  // Create Term Weight Matrix
  var termWeightMatrix = 
  {
    "type": "Term_Weighting",
    "ideaKeys": ideaKeys,
    "terms": terms,
    "matrix": rawEmptyMatrix
  }
  return termWeightMatrix;
}

function populateTermMatrix(corpus, termWeightMatrix)
{
  var corpusInverseDocumentFrequencies = getCorpusInverseDocumentFrequencies(corpus);
  
  var documentTermFrequencies = getDocumentTermFrequencies(corpus);

  var tfIdfWeighting = getTermFrequencyInverseDocumentFrequencies(corpusInverseDocumentFrequencies, documentTermFrequencies);
  
  // Populate Term Weight Matrix
  for(var i = 0; i < termWeightMatrix.ideaKeys.length; i++)
  {
    var ideaKey = termWeightMatrix.ideaKeys[i];
    var tfIdfDocument = getTfIdfDocument(ideaKey, tfIdfWeighting);
    for(var j = 0; j < termWeightMatrix.terms.length; j++)
    {
      var term = termWeightMatrix.terms[j].term;
      var termWeight = getTermWeight(term, tfIdfDocument);
      termWeightMatrix.matrix[i][j] = termWeight;
    }
  }
  return termWeightMatrix;
}

function createTermAffinityMatrix(ideaKeys, rawAffinityMatrix)
{
  // Create Term Affinity Matrix
  var termAffinityMatrix = 
  {
    "type": "Term_Similarity",
    "ideaKeys": ideaKeys,
    "matrix": rawAffinityMatrix
  }
  return termAffinityMatrix;
}



/********************************************************************
* Visualization - Term Affinity (tf-idf weighting) Logic
********************************************************************/
function getTermWeight(term, tfIdfDocument)
{
  for(var i = 0; i < tfIdfDocument.terms.length; i++)
  {
    var tfIdfTerm = tfIdfDocument.terms[i];
    if(tfIdfTerm.term == term)
    {
      return tfIdfTerm.tfIdf;
    }
    else
    {
      continue;
    }
  }
  return 0.0;
}

function getTfIdfDocument(ideaKey, tfIdfWeighting)
{
  for(var i = 0; i < tfIdfWeighting.length; i++)
  {
    var tfIdfDocument = tfIdfWeighting[i];
    if(tfIdfDocument.id == ideaKey)
    {
      return tfIdfDocument;
    }
    else
    {
      continue;
    }
  }
}

function getDocumentTerms(ideaText)
{
  var terms = [];
  var words = ideaText.split(" ");
  for (var j = 0; j < words.length; j++) 
  {
    // Get Word
    var word = words[j]
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]|_/g, "")
            .replace(/\s{2,}/g," ");
    
    var containsWord = Boolean(false);
    
    // Increase term count for terms in list of document terms
    for (var k = 0; k < terms.length; k++) 
    {
      if (terms[k].term == word) 
      {
        terms[k].count = terms[k].count + 1;
        containsWord = Boolean(true);
      }
    }

    // Add words that are not in terms or in stopwords to document
    if(containsWord == false && stopWords.words.indexOf(word) == -1) 
    {
      var term = {'term': word, 'count': 1};
      terms.push(term);
    }
  } 
  return terms;
}

function getCorpusTerms(corpus)
{
  for(var i = 0; i < corpus.documents.length; i++)
  {
    var document = corpus.documents[i];
    for(var j = 0; j < document.terms.length; j++)
    {
      var term = document.terms[j].term;
      
      var containsTerm = Boolean(false);
    
      // Increase term count for terms in list of corpus terms
      for (var k = 0; k < corpus.terms.length; k++) 
      {
        if (corpus.terms[k].term == term) 
        {
          corpus.terms[k].count = corpus.terms[k].count + 1;
          containsTerm = Boolean(true);
        }
      }

      // Add words that are not in terms or in stopwords to document
      if(containsTerm == false) 
      {
        var corpusTerm = {'term': term, 'count': 1};
        corpus.terms.push(corpusTerm);
      }
    }
  }
  return corpus;
}

function populateCorpus(corpus, ideaData)
{
  for (var i = 0; i < ideaData.length; i++) 
  {
    var ideaText = ideaData[i].idea;
    var document = {"id": ideaData[i].id, "terms": []};
    document.terms = getDocumentTerms(ideaText);
    corpus.documents.push(document);
  }
  corpus = getCorpusTerms(corpus);
  return corpus;
}

function getCorpusInverseDocumentFrequencies(corpus)
{
  var idfTerms = [];
  for(var i = 0; i < corpus.terms.length; i++)
  {
    
    var numberOfDocuments = corpus.documents.length;
    // Document frequency = Number of documents that contain the term
    var documentFrequency = corpus.terms[i].count;
    // Inverse Document Frequency = Number of Documents / Document Frequency
    var inverseDocumentFrequency = numberOfDocuments / documentFrequency;
    // Dampened Inverse Document Frequency = Log 10(Inverse Document Frequency)
    var dampenedInverseDocumentFrequency = Math.log10(inverseDocumentFrequency);
    var idfTerm = {'term': corpus.terms[i].term, 'idf': dampenedInverseDocumentFrequency};

    idfTerms.push(idfTerm);
  }
  return idfTerms;
}

function getDocumentTermFrequencies(corpus)
{
  var tfDocuments = [];
  for(var i = 0; i < corpus.documents.length; i++)
  {
    var document = corpus.documents[i];
    var tfDocument = {"id": document.id, "terms": []};
    for(var j = 0; j < document.terms.length; j++)
    {
      var term = document.terms[j];
      // Term frequency = Number of times the term appears in this document
      var termFrequency = term.count;
      // Scaled Term Frequency = 1 + Log 10(Term Frequency)
      var scaledTermFrequency = 1 + Math.log10(termFrequency);
      var tfTerm ={'term': term.term, 'tf': scaledTermFrequency};
      tfDocument.terms.push(tfTerm);
    }
    tfDocuments.push(tfDocument)
    
  }
  return tfDocuments;
}

function getTermFrequencyInverseDocumentFrequencies(idfTerms, tfDocuments)
{
  var tfIdfDocuments = [];

  for(var i = 0; i < tfDocuments.length; i++)
  {
    var tfDocument = tfDocuments[i];
    var tfIdfDocument = {"id": tfDocument.id, "terms": []};
    for(var j = 0; j < tfDocument.terms.length; j++)
    {
      var tfTerm = tfDocument.terms[j];
      // Scaled Term Frequency = 1 + Log 10(Term Frequency)
      var scaledTermFrequency = tfTerm.tf;
      // Dampened Inverse Document Frequency = Log 10(Inverse Document Frequency)
      var dampenedInverseDocumentFrequency = getInverseDocumentFrequency(tfTerm.term, idfTerms)
      // Term Frequency - Inverse Document Frequency = (Term Frequency * Inverse Document Frequency)
      var termFrequencyInverseDocumentFrequency = (scaledTermFrequency * dampenedInverseDocumentFrequency);
      var tfIdfTerm ={'term': tfTerm.term, 'tfIdf': termFrequencyInverseDocumentFrequency};
      tfIdfDocument.terms.push(tfIdfTerm);
    }
    tfIdfDocuments.push(tfIdfDocument)
  }

  return tfIdfDocuments;
}

function getInverseDocumentFrequency(term, idfTerms)
{
  var inverseDocumentFrequency = 0;
  for(var i = 0; i < idfTerms.length; i++)
  {
    var idfTerm = idfTerms[i].term;
    var idfWeight = idfTerms[i].idf;
    if(term == idfTerm)
    {
      inverseDocumentFrequency = idfWeight;
      break;
    }
  }
  return inverseDocumentFrequency;
}


/********************************************************************
* Visualization - Category Affinity (category membership) Logic
********************************************************************/

function getCategoryAffinity(ideaData)
{
  //Find all categories and ideaKeys present in data
  var metaData = getMetaData(ideaData)
  var ideaKeys = metaData.ideaKeys;
  var categories = metaData.categories;

  //Create raw empty matrix
  var rawEmptyMatrix = createEmptyMatrix(ideaKeys.length, categories.length);

  // Create Category Weight Matrix
  var categoryWeightMatrix = createCategoryMatrix(ideaKeys, categories, rawEmptyMatrix);

  // Populate Category Weight Matrix
  categoryWeightMatrix = populateCategoryMatrix(ideaData, categoryWeightMatrix);
  
  //Normalize Category Weight Matrix
  var normalizedCategoryWeightMatrix = normalizeMatrix(categoryWeightMatrix, categoryWeightMatrix.categories.length);

  //Create pair-wise afinity matrix for category membership
  var rawAffinityMatrix = populatePairwiseAffinityMatrix(categoryWeightMatrix, normalizedCategoryWeightMatrix);

  var categoryAffinityMatrix = createCategoryAffinityMatrix(ideaKeys, rawAffinityMatrix);
  return categoryAffinityMatrix;
}

function createCategoryMatrix(ideaKeys, categories, rawEmptyMatrix)
{
  // Create Category Weight Matrix
  var categoryWeightMatrix = 
  {
    "type": "Category_Weighting",
    "ideaKeys": ideaKeys,
    "categories": categories,
    "matrix": rawEmptyMatrix
  }
  return categoryWeightMatrix;
}

function createCategoryAffinityMatrix(ideaKeys, rawAffinityMatrix)
{
  // Create Category Affinity Matrix
  var categoryAffinityMatrix = 
  {
    "type": "Category_Similarity",
    "ideaKeys": ideaKeys,
    "matrix": rawAffinityMatrix
  }
  return categoryAffinityMatrix;
}

function populateCategoryMatrix(ideaData, categoryWeightMatrix)
{
  // Populate Category Weight Matrix
  for(var i = 0; i < ideaData.length; i++)
  {
    var ideaCategories = ideaData[i].categories;
    for(var j = 0; j < ideaCategories.length; j++)
    {
      var category = ideaCategories[j];
      var categoryIndex = categoryWeightMatrix.categories.indexOf(category);
      categoryWeightMatrix.matrix[i][categoryIndex] = 1;
    }
  }
  return categoryWeightMatrix;

}

/********************************************************************
* Visualization - Combine Term and Category Affinity Matrices Logic
********************************************************************/
function getCombinedAffinity(categoryAffinity, termAffinity)
{
  var combinedAffinity = createCombinedAffinityMatrix(categoryAffinity);
  for(var i = 0; i < combinedAffinity.ideaKeys.length; i++)
  {
    for(var j = 0; j < combinedAffinity.ideaKeys.length; j++)
    {
      var categoryDampeningFactor = getAverageSimilarity(termAffinity.matrix);
      var dampenedCategoryWeight = categoryDampeningFactor * categoryAffinity.matrix[i][j];
      combinedAffinity.matrix[i][j] = dampenedCategoryWeight + termAffinity.matrix[i][j];
    }
  }
  //var normalizedCombinedAffinity = normalizeMatrix(combinedAffinity, combinedAffinity.ideaKeys.length);
  //combinedAffinity.matrix = normalizedCombinedAffinity
  return combinedAffinity;
}

function createCombinedAffinityMatrix(affinityMatrix)
{
  // Create Combined Affinity Matrix
  var rawAffinityMatrix = createEmptyMatrix(affinityMatrix.ideaKeys.length, affinityMatrix.ideaKeys.length);
  var combinedAffinityMatrix = 
  {
    "type": "Combined_Similarity",
    "ideaKeys": affinityMatrix.ideaKeys,
    "matrix": rawAffinityMatrix
  }
  return combinedAffinityMatrix;
}

function getAverageSimilarity(matrix)
{
  // We are dropping 0s and 1s to get the average similarity
  var totalValue = 0;
  var totalCount = 0;
  for(var i = 0; i < matrix.length; i++)
  {
    for(var j = 0; j < matrix[i].length; j++)
    {
      var value = matrix[i][j];
      if(value > 0 && value < 1)
      {
        totalCount += 1;
        totalValue += value;
      }
    }
  }
  var averageSimilarity = totalValue / totalCount;
  return averageSimilarity;
}


/********************************************************************
* Visualization - General Matrix Logic
********************************************************************/

function createEmptyMatrix(rowCount, columnCount)
{
  //Create raw empty matrix
  var rawEmptyMatrix = new Array(rowCount);
  for(var i = 0; i < rowCount; i++)
  {
    rawEmptyMatrix[i] = new Array(columnCount);
    for(var j = 0; j < columnCount; j++)
    {
      rawEmptyMatrix[i][j] = 0;
    }
  }
  return rawEmptyMatrix;
}

function normalizeMatrix(weightMatrix, columnCount)
{
  //Normalize Weight Matrix
  var ideaCount = weightMatrix.ideaKeys.length;
  var normalizedweightMatrix = createEmptyMatrix(ideaCount, columnCount);

  for(var i = 0; i < ideaCount; i++)
  {
    //Get Normalization Factor (Square Root of Sum of Squares)
    var normalizationFactor = 0;
    var sumOfSquares = 0; 
    for(var j = 0; j < columnCount; j++)
    {
      var rawWeight = weightMatrix.matrix[i][j];
      sumOfSquares += (rawWeight * rawWeight);
    }
    normalizationFactor = Math.sqrt(sumOfSquares);

    //Normalize Weight Matrix
    for(var j = 0; j < columnCount; j++)
    {
      var rawWeight = weightMatrix.matrix[i][j];
      var normalizedWeight = rawWeight/normalizationFactor;
      normalizedweightMatrix[i][j] = normalizedWeight;
    }
  }
  return normalizedweightMatrix;
}

function populatePairwiseAffinityMatrix(weightMatrix, normalizedWeightMatrix)
{
  var ideaCount = weightMatrix.ideaKeys.length;
  //Create pair-wise afinity matrix
  var pairwiseAffinityMatrix = createEmptyMatrix(ideaCount, ideaCount);

  //Populate pair-wise afinity matrix
  for(var i = 0; i < ideaCount; i++)
  {
    var currentIdeaId = weightMatrix.ideaKeys[i];
    var currentIdeaVector = normalizedWeightMatrix[i];
    for(var j = 0; j < ideaCount; j++)
    {
      var targetIdeaId = weightMatrix.ideaKeys[j];
      var targetIdeaVector = normalizedWeightMatrix[j];
      if(currentIdeaId == targetIdeaId)
      {
        pairwiseAffinityMatrix[i][j] = 1;
        continue;
      }
      
      var cosineSimilarity = 0;
      //Get cosine similarity (Normalized Dot Product)
      for(var k = 0; k < currentIdeaVector.length; k++)
      {
        cosineSimilarity += currentIdeaVector[k] * targetIdeaVector[k];
      }
      pairwiseAffinityMatrix[i][j] = cosineSimilarity;
    
    }
  }
  return pairwiseAffinityMatrix;
}

/********************************************************************
* Visualization - Force Data (category and term affinity) Logic
********************************************************************/

function createGraphNode(sourceLabel, sourceId, nodeSize)
{
  var graphNode = 
  {    
    "source_idea_label": sourceLabel,    
    "source_idea_id": sourceId,   
    "size": nodeSize  
  };
  return graphNode;
}

function createGraphEdge(sourceId, targetId, linkStrength)
{
  var graphEdge = 
  {      
    "source_idea_id": sourceId,    
    "target_idea_id": targetId,       
    "strength": linkStrength  
  };
  return graphEdge;
}

function createForceData(affinityMatrix, ideaData)
{
  var totalLinkStrengh = 0;
  var totalLinkCount = 0;
  var forceData = {"nodes": [], "edges": []};
  for(var i = 0; i < ideaData.length; i++)
  {
    var sourceLabel = ideaData[i].idea;
    var sourceId = ideaData[i].id;
    var nodeSize = ideaData[i].quality;

    var graphNode = createGraphNode(sourceLabel, sourceId, nodeSize);
    forceData.nodes.push(graphNode);

    var affinityVector = affinityMatrix.matrix[i];
    for(var j = 0; j < affinityVector.length; j++)
    {
      var targetId = affinityMatrix.ideaKeys[j];
      var linkStrength = affinityVector[j];
      if(linkStrength > 0 && targetId != sourceId)
      {
        totalLinkCount += 1;
        totalLinkStrengh += linkStrength;
        var graphEdge = createGraphEdge(sourceId, targetId, linkStrength);
        forceData.edges.push(graphEdge);
      }
    }
  }
  var linkAverageStrength = totalLinkStrengh / totalLinkCount;
  
  forceData = trimForceData(forceData, linkAverageStrength);
  
  return forceData;
}

function trimForceData(forceData, cutOffValue)
{
  for(var i = 0; i < forceData.edges.length; i++)
  {
    var edge = forceData.edges[i];
    if(edge.strength < cutOffValue)
    {
      forceData.edges.splice(i, 1);
    }
  }
  return forceData;
}


/********************************************************************
* Visualization - Force Directed Graph Logic
********************************************************************/

function CreateForceDiagram(forceData)
{
  // global intensity of attraction
  var charge = -200;
  // link distance factor used to determine line length;
  var distanceFactor = 40;
  var maxDistance = 250;

  //size of the svg
  var width = 800;
  var height = 600;

  //in order to use the force layout for d3, the dataset has to be an object with two elements, nodes and edges, with each element being an array of objects.
    
  //ordinal scale in order to color the nodes
  var colors = d3.scale.category20();

  //makes the svg element
  var svg = d3.select("#svgdiv2")
    .attr("width", width)
    .attr("height", height)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //variables for maps and arrays for the nodes and edges of the diagram
  var indexByName = d3.map(),
    nameByIndex = d3.map(),
    nodes = [],
    edges = [],
    sizeMax = 0,
    sizeMin = 0,
    strengthMax = 0,
    strengthMin = 0,
    n = 0;

  //find min and max of the sizes in order to scale them to needed size
  forceData.nodes.forEach(function(d) 
  {
    if(parseInt(d.size) > sizeMax) sizeMax = parseInt(d.size);
    if(parseInt(d.size) < sizeMin) sizeMin = parseInt(d.size);
  });

  //scales the sizes to between 10px and 30px
  var size_scale = d3.scale.linear()
    .domain([sizeMin, sizeMax])
    .range([1, 50]);

  //find min and max of the sizes in order to scale them to needed size
  forceData.edges.forEach(function(d) 
  {
    if(parseFloat(d.strength) > strengthMax) strengthMax = parseFloat(d.strength);
    if(parseFloat(d.strength) < strengthMin) strengthMin = parseFloat(d.strength);
  });

  //scales the sizes to between 10px and 30px
  var strength_scale = d3.scale.linear()
    .domain([strengthMin, strengthMax])
    .range([1, 25]);

  //goes through all of the data and makes sure that it is mapped in the maps
  //also puts the source_idea_label and size into the nodes array
  forceData.nodes.forEach(function(d) 
  {
    if (!indexByName.has(d.source_idea_id)) 
    {
      nameByIndex.set(n, d.source_idea_id);
      nodes.push({name: d.source_idea_id, size: size_scale(parseInt(d.size)), text: d.source_idea_label});
      indexByName.set(d.source_idea_id, n);
      n++;
          }
  });

  //loops through the data array and looks up all the edges and puts them into the edges array
  for(var x = 0; x < forceData.edges.length; x++) 
  {
    var sourceNode = parseInt(indexByName.get(forceData.edges[x].source_idea_id));
        var targetNode = parseInt(indexByName.get(forceData.edges[x].target_idea_id));
        var linkStrength = parseInt(strength_scale(forceData.edges[x].strength)); 

        edges.push({source: sourceNode, target: targetNode, strength: linkStrength});
  }

  //creates the dataset object that contains the arrays of nodes and edges
  var dataset = { nodes: nodes, edges: edges}; 

  //this sets up the force layout - it needs where the nodes and links are and the size of the space, as well as optional parameters like how long you want the distance between them to be and how much you want the nodes to repel each other
  var force = d3.layout.force()
    .nodes(dataset.nodes)
    .links(dataset.edges)
    .size([width, height])
    .linkDistance(function(d) 
    {
      return maxDistance - (Math.round(Math.sqrt(d.strength)) * distanceFactor);
    })
    .charge(charge)
    .start();

  //making the svg lines that connect the nodes
  var edges = svg.selectAll(".link")
    .data(dataset.edges)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "black")
    .style("opacity", function(d) 
    {
      return 0.3;
    })
        .style("stroke-width", function(d) 
    {
      return Math.round(Math.sqrt(d.strength));
    });

  //making the svg text that are the nodes
  //choosing colors from the ordinal scale for the text
  var nodes = svg.selectAll(".node")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", function(d) 
    { 
      return Math.sqrt(d.size) * 2; 
    })
    .style("fill", function(d, i) 
    {
      return colors(i);
    })
    .call(force.drag);//this line is necessary in order for the user to be able to move the nodes (drag them)

  nodes.append("title")
    .text(function(d) { return d.text; });

  //this tells the visualization what to do when time passes
  //it updates where the nodes and edges should be
  force.on("tick", function() 
  {
    edges.attr("x1", function(d) 
    { 
      return d.source.x; 
    })
        .attr("y1", function(d) 
    { 
          return d.source.y; 
    })
        .attr("x2", function(d) 
    { 
          return d.target.x; 
        })
        .attr("y2", function(d) 
    { 
          return d.target.y; 
        });

    nodes.attr("cx", function(d) 
    {
      return d.x; 
    })
    .attr("cy", function(d) 
    { 
      return d.y; 
    });
  });
}