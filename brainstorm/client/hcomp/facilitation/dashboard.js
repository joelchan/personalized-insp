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
  
  window.scrollTo(0,0);
  $('.menu-link').bigSlide();
  Notifications.find({
    recipientIDs: Session.get("currentUser")._id,
    'type.val': NotificationTypes.REQUEST_HELP.val
    }).observe({
    added: function(newMsg) {
      console.log("***********************************************");
      console.log("***********************************************");
      console.log(newMsg)
      console.log("Alert generated handled");
      console.log("***********************************************");
      console.log("***********************************************");
      var msgSenderDivID = '#uname-' + newMsg.sender;
      var alertDivID = msgSenderDivID + " .alert-msg";
      if (!newMsg.handled && ($(alertDivID).length == 0)) {
        var msg = UI.render(Template.HelpMessage);
        UI.insert(msg, $(msgSenderDivID)[0]);
      }
      if (!$(msgSenderDivID).hasClass("flashing")) {
        $(msgSenderDivID).addClass("flashing");
        var alertTimer = {'time': 10};
        Session.set(msgSenderDivID, alertTimer);
  		  alertTimer['interval'] = Meteor.setInterval(function(){
          console.log("message alert interval");
          var alertTime = Session.get(msgSenderDivID);
          if (alertTime['time'] != 0) {
  			    $(msgSenderDivID).toggleClass('flash-alert');
            alertTime['time'] = alertTime['time'] - 1;
            Session.set(msgSenderDivID, alertTime)
          } else {
            $(msgSenderDivID).removeClass("flashing");
            Meteor.clearTimeout(alertTime['interval']);
          }

  		  }, 500);
        Session.set(msgSenderDivID, alertTimer);
      }
    },
      
  	changed: function(newMsg, oldMsg){
      console.log("***********************************************");
      console.log("***********************************************");
      console.log(newMsg)
      console.log("Msg handled");
      console.log("***********************************************");
      console.log("***********************************************");
      var msgSenderDivID = '#uname-' + newMsg.sender;
      var alertDivID = msgSenderDivID + " .alert-msg";
      if (newMsg.handled) {
        console.log("Msg handled");
        $(alertDivID).remove();
        if (!$(msgSenderDivID).hasClass("flash-alert")) {
          $(msgSenderDivID).removeClass("flash-alert");
        }
        if (!$(msgSenderDivID).hasClass("flashing")) {
          $(msgSenderDivID).removeClass("flashing");
          Meteor.clearTimeout(
            Session.get(msgSenderDivID)['interval']
          );
        }
      } else {
        console.log("Alert generated handled");
        //$('#uname-' + newMsg.sender)
      }
    }
  });

}

Template.HcompTaskItem.rendered = function(){

    // this should programmatically write in the priority label that matches 
    // the priority attached to the task
    $('<i class="fa fa-exclamation"></i>')
       .appendTo('.task-item div.panel-heading .priority-label');
}

Template.HcompUserseries.rendered = function(){
	// var self = this;
	// var userID = self.data._id;
	// //var part_ID = self.data.
	// var node = self.find(".series");
	// var svg = d3.select(node).append("svg");
	// var h = 70;
 //  var width = $(this.firstNode).css('width');
 //  width = trimFromString(width, 'px') - 30;
	// var pad = 20;


	// var submissionEvents = Events.find({userID: userID, description: "User submitted idea"}); //
	// var results = [];
	// var start = new moment(Events.findOne({userID: userID, description: "User began role Ideator"}).time);
	// var sessionlength = Session.get("sessionLength");
	// var end = new moment(Events.findOne({userID: userID, description: "User began role Ideator"}).time).add('m', sessionlength+5);//new Date(start + sessionlength*MS_PER_MINUTE);

	// var x = d3.time.scale()
	// 				.domain([start, end])
	// 				.nice(d3.time.minute)
	// 				.range([pad, width-pad]);

	// var xAxis = d3.svg.axis()
	// 					.scale(x)
	// 					.ticks(7)
	// 					.tickFormat(d3.time.format("%I:%M"))
	// 					.orient("bottom");

	// var xAxisGroup = svg.append("g")
	// 					.attr("class", "axis")
	// 					.attr("transform", "translate(0," + (h - pad) + ")")
	// 					.call(xAxis);

	// var marks = svg.append("g");

	// var tip = d3.tip()
	// 			.attr('class', 'd3-tip')
	// 			.html(function(d) { 
	// 				var desc = d.description;
	// 				if(desc === "Dashboard user sent examples"){
	// 					var ideas = "Examples: ";
	// 					for (var i = 0; i < d.examples.length; i++) {
	// 						ideas += $.trim(d.examples[i].content) +", ";
	// 					};
	// 					return ideas.substring(0, ideas.length-2);
	// 				} else if (desc === "Dashboard user changed prompt")
	// 					return "Message: " + d.prompt;
	// 				else if (desc === "Dashboard user sent theme")
	// 					return "Theme: " + Clusters.findOne({_id: d.theme}).name;
	// 				else if (desc === "User submitted idea")
	// 					return Ideas.findOne({_id: d.ideaID}).content;
	// 			});

	// svg.call(tip);

	// submissionEvents.observe({
	// 	added: function(doc){
	// 		results.push(doc);
	// 		refreshGraph(results);
	// 	}
	// });

	// function refreshGraph(r){
	// 	//console.log(r);
	// 	var m = marks.selectAll("rect")
	// 		.data(r);
	// 	m.enter()
	// 		.append("rect")
	// 		.attr("height", "50px")
	// 		.attr("width", "2px")
	// 		.attr("class", "bar")
	// 		.attr("id", function(d){
	// 			return d._id;
	// 		})
	// 		.attr("x", function(d){
	// 			var time = new Date(d.time);
	// 			return x(time);
	// 		})
	// 		.attr("y", 0)
	// 		.attr("fill", "#d43f3a")
	// 		// .append("svg:title")
	// 		// .text(function(d) { return d.content; })
	// 		.on('mouseover', tip.show)
 //  			.on('mouseout', tip.hide);
	// 	m.exit()
	// 		.remove();
	// }

	// var leverEventsCursor = Events.find({recipientIDs: userID, description: 
	// 	{$in: ["Dashboard user sent examples", "Dashboard user changed prompt", 
	// 	"Dashboard user sent theme"]}}); //this should be based off of filter object .performQuery
	// var leverEvents = [];
	// var leverEventMarks = svg.append("g");

	

	// function refreshLeverEvents(leverData){
	// 	var lme = leverEventMarks.selectAll("circle")
	// 				.data(leverData);
	// 	lme.enter()
	// 		.append("circle")
	// 		.attr("r", "5px")
	// 		.attr("id", function(d){
	// 			return d._id;
	// 		})
	// 		.attr("cx", function(d){
	// 			var time = new Date(d.time);
	// 			return x(time);
	// 		})
	// 		.attr("cy", "50px")
	// 		.attr("fill", function(d){
	// 			var desc = d.description;
	// 				if(desc === "Dashboard user sent examples")
	// 					return "#449d44";
	// 				else if (desc === "Dashboard user changed prompt")
	// 					return "#428bca";
	// 				else if (desc === "Dashboard user sent theme")
	// 					return "#d58512";
	// 			return "#fff";
	// 		})
	// 		.attr("fill-opacity", "0.4")
	// 		.attr("stroke-width", "1px")
	// 		.attr("stroke", function(d){
	// 			var desc = d.description;
	// 				if(desc === "Dashboard user sent examples")
	// 					return "#449d44";
	// 				else if (desc === "Dashboard user changed prompt")
	// 					return "#428bca";
	// 				else if (desc === "Dashboard user sent theme")
	// 					return "#d58512";
	// 			return "#fff";
	// 		})
	// 		// .append("svg:title")
	// 		// .text(function(d) { return d.description; })
	// 		.on('mouseover', tip.show)
 //  			.on('mouseout', tip.hide);
	// 	lme.exit()
	// 		.remove();

	// }

	// leverEventsCursor.observe({
	// 	added: function(doc){
	// 		leverEvents.push(doc);
	// 		refreshLeverEvents(leverEvents);
	// 	}
	// });
	
	// var nowWidth = (width-2*pad)/sessionlength; //1 minute
	// var nowData = [new moment(Date.now())]; // data for nowLine, initialize with current moment
	// var nowLine = svg.append("g");
	// 				//.selectAll("rect")
	// // nowLine.data(nowData) // initialize nowLine
	// // 	.enter()
	// // 	.append("rect")
	// // 	.attr("height", "50px")
	// // 	.attr("width", function(){
	// // 		return nowWidth;
	// // 	})
	// // 	.attr("class", "nowLine")
	// // 	.attr("x", function(d){
	// // 		return x(d)-nowWidth;
	// // 	})
	// // 	.attr("y", 0)
	// // 	.attr("fill", "gray")

	// // function for updating and transitioning the nowLine
	// function drawNow(nd) {
	// 	var nLine = svg.selectAll(".nowLine")
	// 		.data(nd)
	// 	nLine
	// 		.enter()
	// 		.append("rect")
	// 		.attr("height", "45px")
	// 		.attr("width", function(){
	// 			return nowWidth;
	// 		})
	// 		.attr("class", "nowLine")
	// 		.attr("id", function(d){
	// 			return d._id;
	// 		})
	// 		.attr("x", function(d){
	// 			return x(d)-nowWidth;
	// 		})
	// 		.attr("y", 5)
	// 		.attr("fill", "gray")
	// 	nLine.transition()
	// 		.duration(0)
	// 		.attr("height", "45px")
	// 		.attr("width", function(){
	// 			return nowWidth
	// 		})
	// 		.attr("x", function(d){
	// 			return x(d)-nowWidth;
	// 		})
	// 		.attr("y", 5)
	// 		.attr("fill", "gray")
	// 	nLine.exit()
	// 		.transition()
	// 		.duration(0)
	// 		.attr("x",width) // this moves the previous nowLine off the scale
	// 		.remove();
	// }

	// Meteor.setInterval(function(){
	// 	nowData.pop(); // removing the old "now"
	// 	nowData.push(new moment(Date.now())); // pushing the new now in
	// 	drawNow(nowData);
	// }, 100);
}

/********************************************************************
* Template Helpers
*********************************************************************/

Template.HcompDashboard.helpers({
	ideas : function(){
		var cursor = FilterManager.performQuery("Ideas Filter", 
      Session.get("currentUser"),
      "ideas"
    );
		return cursor;
  	},


  	gamechangers : function(){
  		return false;
  	},


  	selectedparts : function(){
  		return MyUsers.find({_id: {$in: Session.get("selectedParts")}});
  	},

  	participants : function(){
		// return MyUsers.find({type: "Experiment Participant"});
		return MyUsers.find({type: "Ideator"});
		// return FilterManager.performQuery(userSeriesFilter,Session.get("currentUser"),"myUsers");
	},

  	//partFilters : function(){
  		//return MyUsers.find({_id: {$in: Session.get("idealistFilters").partFilters}});
  	//},
//
  	//clusterFilters : function(){
  		//return Session.get("idealistFilters").clusterFilters;
  	//}
});

Template.HcompDashIdeabox.helpers({
	ideas : function(){
	  var cursor = FilterManager.performQuery("Ideas Filter", 
      Session.get("currentUser"),
      "ideas"
    );
    return cursor;
  },
  numIdeas : function(){
  	return Template.Ideabox.ideas().count();
  },
});

Template.HcompNewTaskModal.helpers({
    // participants : function(){
    //     // return MyUsers.find({type: "Experiment Participant"});
    //     return MyUsers.find({type: "Ideator"});
    //     // return FilterManager.performQuery(userSeriesFilter,Session.get("currentUser"),"myUsers");
    // },
});

Template.HcompTaskList.helpers({
    
    // this should return the list of tasks
    tasks : function() {
    
        // temporary creating a new task for making the UI
        var task1 = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), 
          "This is a test task", 'open', priority=5, num=5);
        //Attach inspiration to task
        task1._id = Tasks.insert(task1);
        var task2 = new Task(Session.get('currentUser'), Session.get('currentPrompt'), Session.get('currentGroup'), 
          "This is another test task. Much much longer though. Will have to truncate to fit into the title bar", 'open', priority=3, num=5);
        //Attach inspiration to task
        task2._id = Tasks.insert(task2);

        return Tasks.find().fetch();
    },

});

Template.HcompTaskItem.helpers({

    title : function() {
        var titleLength = 50;
        return this.desc.substring(0,titleLength) + "...";
    },

    // this should return the number of ideas attached to a given task
    totalTaskIdeas : function() {
        return 15;
    },

    // this should return the number of ideas generated for a task since the user last looked at it
    newTaskIdeas : function() {
        return 4;
    },

});

Template.HcompTagCloud.helpers({
	clusters : function(){
    var filteredIdeaIDs = getIDs(Template.Ideabox.ideas());
    cursor = Clusters.find(
       {isRoot: {$ne: true}, ideaIDs: {$in: filteredIdeaIDs}}, 
       {sort: {name: 1}}
     ).fetch();
    // update the copied clusters' idea IDs to filter out ideas not in the current ideas filter
    // cursor.forEach(function(c) {
    //  c.ideaIDs.forEach(function(i){
    // 	 if (!isInList(i,filteredIdeaIDs)) {
    // 		 c.ideaIDs.pop(i);
    // 	 }
    //  })
    // })
   	
    return cursor;
  },
  getFontSize : function(){
    // console.log(this);
    var thisIdeaIDs = this.ideaIDs;
    var filteredIdeaIDs = getIDs(Template.Ideabox.ideas());
    var thisClusterSize = 0;
    thisIdeaIDs.forEach(function(i) {
    	if(isInList(i,filteredIdeaIDs)) {
    		// thisIdeaIDs.pop(i);
    		thisClusterSize++;
    	}
    })
    return 10 +(thisClusterSize * 4);
    // return 10 +(Template.TagCloud.getClusterSize() * 4);
    // return 10 +(Template.TagCloud.getClusterSize() * 4);
  },
  getClusterSize : function(){
    var thisIdeaIDs = this.ideaIDs;
    var filteredIdeaIDs = getIDs(Template.Ideabox.ideas());
    // console.log(filteredIdeaIDs);
    var thisClusterSize = 0;
    thisIdeaIDs.forEach(function(i) {
    	if(isInList(i,filteredIdeaIDs)) {
    		// thisIdeaIDs.pop(i);
    		thisClusterSize++;
    	}
    })
    // return this.ideaIDs.length;
    // return thisIdeaIDs.length;
    return thisClusterSize;
  },
});

/********************************************************************
* Template Events
*********************************************************************/
Template.HcompDashboard.events({
	'click .gamechangestar' : function(){
    EventLogger.logToggleGC(this);
		IdeaFactory.toggleGameChanger(this);
	},

	'click #checkall' : function(event, template){
		//event.target
		$("input[type=checkbox]").each(function(i){
			$(this).prop('checked', true);
		});
	},

	'click #uncheckall' : function(event, template){
		//event.target
		$("input[type=checkbox]").each(function(i){
			$(this).prop('checked', false);
		});
	},

	'click .userprofilename' : function(e){
		var id = $(e.currentTarget).parents('.profile').attr("id");
		id = id.split("-")[1];
		var isOn = FilterManager.toggle("Ideas Filter", Session.get("currentUser"), "ideas", "userID", id);
        EventLogger.logToggleUserFilter(
            Session.get("currentUser"),
            id,
            isOn
        );
	},

	'click .tagname' : function(){
		var id = $(event.target).parent().attr("id");
		id = id.split("-")[1];

		var isOn = FilterManager.toggle(
        "Ideas Filter", 
        Session.get("currentUser"), 
        "ideas", 
        "clusterIDs", 
        id
    );	
    EventLogger.logToggleClusterFilter(
        Session.get("currentUser"),
        id,
        isOn
    );
		// console.log(Filters.find().fetch());
	},

	'mouseover .tagname' : function(){
		var id = $(event.target).parent().attr("id");
		id = id.split("-")[1];
		var thisTheme = Clusters.findOne({_id: id});
		var filteredIdeaIDs = getIDs(Template.Dashboard.ideas());
		var thisThemeIdeas = [];
		thisTheme.ideaIDs.forEach(function(i){
			if (isInList(i,filteredIdeaIDs)) {
				thisThemeIdeas.push(Ideas.findOne({_id: i}).content);	
			}
			// var thisIdea = Ideas.findOne({_id: i}).content
			// ideaText = ideaText + thisIdea + "\n";
		});
		// $('<span class="tag-tip"></span>').text(ideaText)
		$('<span class="tag-tip"></span>')
			.appendTo('body')
			.css('top', (event.pageY - 10) + 'px')
			.css('left', (event.pageX + 20) + 'px')
			.fadeIn('slow');
		$('<span></span>').text("Ideas in " + thisTheme.name + ":")
			.appendTo('.tag-tip');
		$('<br>')
			.appendTo('.tag-tip');
		thisThemeIdeas.forEach(function(i){
			iText = "- " + i;
			$('<span></span>').text(iText)
				.appendTo('.tag-tip');
			$('<br>')
				.appendTo('.tag-tip');
		})
	},

	'mouseout .tagname' : function(){
		$('.tag-tip').remove();
	},

	'mousemove .tagname' : function(){
		$('.tag-tip')
		.css('top', (event.pageY - 10) + 'px')
		.css('left', (event.pageX + 20) + 'px');
	},

	'click .fa-minus-circle' : function(){
		var label = $(event.target).parent();
		var id = label.attr("id");
		id = id.split("-")[1];
		if (label.hasClass("part-label")) {
			var selectedParts = Session.get("selectedParts");
			for (var i = 0; i < selectedParts.length; i++) {
				if (selectedParts[i] === id){
					selectedParts.splice(i,1);
					$("input:checkbox[value="+id+"]").attr("checked", false);
					return Session.set("selectedParts", selectedParts);
				}
			};
		}
	},

    'click .dropdown-menu li' : function(event) {
        var $target = $( event.currentTarget );
        $target.closest( '.btn-group' )
            .find( '[data-bind="label"]' ).text( $target.text() )
            .end()
            .children( '.dropdown-toggle' ).dropdown( 'toggle' );
        return false;
    },

	'click .show-modal' : function(event, template){
		event.preventDefault();

 		var selected = template.findAll( "input[type=checkbox]:checked");

   		var array = _.map(selected, function(item) {
     		return item.defaultValue;
   		});

   		Session.set("selectedParts", array);
	},

	'click #new-task-btn' : function(){
		$('#new-prompt').val("");
	},

    // event handler for publishing a new task
    'click #new-task > div > div > div.modal-footer > button.btn.btn-primary' : function(){
        // code goes here
    },

	// 'click #sendexbutton' : function(){
	// 	$('.modal .idea-item').each(function(){
	// 		$(this).removeClass("selected");
	// 	});
	// },

	// //send theme clear selections
	// 'click #sendthemebutton' : function(){
	// 	$('input[name="themeRadios"]').prop('checked', false);
	// },

	// 'click .modal .idea-item' : function(event){
	// 	var $target = $(event.target)
	// 	if ($target.hasClass("gamechangestar"))
	// 		return false;
	// 	$target.toggleClass("selected");
	// },
	
	// 'click .modal > div > div > div.radio': function(event){

	// },

	// 'click #new-task > div > div > div.modal-footer > button.btn.btn-primary' : function(){
	// 	var sender = Session.get("currentUser")._id;
	// 	// var recipients = Session.get("selectedParts");
	// 	var recipientSelection = $('input[name=userSelectRadios]:checked').val();
	// 	var recipients = getUserSelection(recipientSelection);
	// 	var prompt = $('#new-prompt').val();

	// 	if(prompt === "" || prompt === " ")
	// 		return false;

	// 	changePromptNotify(sender, recipients, prompt);
	// },

	// 'click #sendExModal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
	// 	var sender = Session.get("currentUser")._id;
	// 	// var recipients = Session.get("selectedParts");
	// 	var recipientSelection = $('input[name=userSelectRadios]:checked').val();
	// 	var recipients = getUserSelection(recipientSelection);
	// 	var examples = [];


	// 	$('.modal .ideadeck .idea-item.selected').each(function(i){
	// 		console.log("getting idea");
	// 		var idea = {_id: $(this).attr('id'), content: $(this).text()}
	// 		examples.push(idea);
	// 	});
	// 	console.log(examples)

	// 	if(examples.length < 1)
	// 		return false;

	// 	sendExamplesNotify(sender, recipients, examples);
	// },

	// 'click #sendThemeModal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
	// 	var sender = Session.get("currentUser")._id;
	// 	// var recipients = Session.get("selectedParts");
	// 	var recipientSelection = $('input[name=userSelectRadios]:checked').val();
	// 	var recipients = getUserSelection(recipientSelection);
	// 	var theme = $('input[name=themeRadios]:checked').val();
		
	// 	if(theme === undefined)
	// 		return false;

	//   sendThemeNotify(sender, recipients, theme);
	// }
});

/********************************************************************
* Deprecated
*********************************************************************/

// Template.SendThemeModal.helpers({
//     participants : function(){
//         // return MyUsers.find({type: "Experiment Participant"});
//         return MyUsers.find({type: "Ideator"});
//         // return FilterManager.performQuery(userSeriesFilter,Session.get("currentUser"),"myUsers");
//     },
//     clusters : function(){
//     var filteredIdeaIDs = getIDs(Template.Dashboard.ideas());
//     cursor = Clusters.find(
//        {isRoot: {$ne: true}, ideaIDs: {$in: filteredIdeaIDs}}, 
//        {sort: {name: 1}}
//      ).fetch();
//     // update the copied clusters' idea IDs to filter out ideas not in the current ideas filter
//     cursor.forEach(function(c) {
//      c.ideaIDs.forEach(function(i){
//          if (!isInList(i,filteredIdeaIDs)) {
//              c.ideaIDs.pop(i);
//          }
//      })
//     })
//     return cursor;
//   },
// });

// Template.SendExamplesModal.helpers({
//     ideas : function(){
//       var cursor = FilterManager.performQuery("Ideas Filter", 
//       Session.get("currentUser"),
//       "ideas"
//     );
//     return cursor;
//   },
//     participants : function(){
//         // return MyUsers.find({type: "Experiment Participant"});
//         return MyUsers.find({type: "Ideator"});
//         // return FilterManager.performQuery(userSeriesFilter,Session.get("currentUser"),"myUsers");
//     },
// });

// Template.IdeatorPanels.helpers({
//   users : function(){
//     console.log("*************** getting users *******************")
//     var beganIdeation = Events.find({description: "User began role Ideator"});
//     var userIDs = [];
//     beganIdeation.forEach(function(event){
//       userIDs.push(event.userID);
//     })
//     return MyUsers.find({name: {$ne: ["ProtoAdmin", 'TestAdmin']}, 
//       _id: {$in: userIDs}});
//   },
// });
