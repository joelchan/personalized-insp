//Session.set("partFilters", []);
Session.set("selectedParts", []);
Session.set("selectedIdeas", []);
Session.set("sessionLength", 30);
var filters = {
	partFilters: [],
	clusterFilters: [],
	gamchanger: [true, false]
}

/////////////////////////// Demo code //////////////////////////


///////// Sample Filtering code /////////////////////////////////
//FilterFactory.addSort(myFilter, 'user', [1,2,3]);
//FilterFactory.performQuery(myFilter);

// var myFilter = FilterFactory.create("Dashboard Participant Filter",
//     Session.get("currentUser"),
//     "ideas"
//     );

// console.log(getCollection(myFilters));

// myFilters = Filters.findOne({name: "Dashboard Participant Filter", 
//               user: Session.get("currentUser")
// });

// filter.filter = [{key: "_id", val: {$in: clusterIdeas}},
//       {key: "isGamechanger", val: {$in: filters.gamchanger}}];



////////////////////////////////////////////////////////////////




Session.set("idealistFilters", filters);
MS_PER_MINUTE = 60000;

Template.Dashboard.rendered = function(){
	$('.menu-link').bigSlide();
	//Session.set("currentPrompt", "Alternate uses for an iPod");
}

Template.tagcloud.rendered = function(){
	// var self = this;
	// self.node = self.find("svg");
	// var w = 453;
	// var h = 280;
	// var hPad = 20;
	// var wPad = 30;
	// var svg = d3.select("#tagcloud")
	// 			.append("svg")
	// 			.attr("height", h)
	// 			.attr("width", w);

	// var timeDep = new Deps.Dependency();
	// Deps.autorun(function () {
	// 	timeDep.depend();
	// 	var clusters = Clusters.find().fetch();

 //    	var xScale = d3.scale.linear()
	// 					.domain([d3.min(clusters, function(d){
	// 						if(d.position !== undefined) return d.position.left;
	// 					}), d3.max(clusters, function(d) {
	// 						if(d.position !== undefined) return d.position.left; 
	// 					})])
	// 					.range([wPad, w - wPad*3]);

	// 	var yScale = d3.scale.linear()
	// 					.domain([d3.min(clusters, function(d){
	// 						if(d.position !== undefined) return d.position.top;
	// 					}), d3.max(clusters, function(d) {
	// 						if(d.position !== undefined) return d.position.top;
	// 					})])
	// 					.range([hPad, h - hPad]);

	// 	var wsScale = d3.scale.linear()
	// 					.domain([0, d3.max(clusters, function(d){
	// 						if(d.ideas !== undefined) return d.ideas.length;
	// 					})])
	// 					.range([10, 25]);

 //    	var tags = svg.selectAll("text")
 //    				.data(clusters);

 //    	tags.enter()
 //   			.append("text")
 //    		.attr("x", function(d){
 //    			if(d.position !== undefined)
 //    				return xScale(d.position.left);
 //   			})
 // 			.attr("y", function(d){
 //    			if(d.position !== undefined)
 //    				return yScale(d.position.top);
 //    		})
 //    		.style("font-size", function(d){
 //    			if(d.ideas !== undefined){
 //    				//console.log(wsScale(d.ideas.length));
 //    				return wsScale(d.ideas.length);}
 //    		})
	// 		.text(function(d){
	// 		   	return d.name;
	// 		});

	// 	tags.exit()
	// 		.remove();
	// });

	// timeDep.changed(); //run once at beginning
	// setInterval(function(){
	// 	timeDep.changed();
	// }, 5000);
}

Template.userseries.rendered = function(){
	//var start = Date.now;
	//console.log(this);
	var self = this;
	var userID = self.data._id;
	console.log(userID);
	//var part_ID = self.data.
	var node = self.find(".series");
	var svg = d3.select(node).append("svg");

	var h = 70;
	var w = 546;
	var pad = 20;


	var submissionEvents = Events.find({userID: userID, description: "Participant submitted idea"}); //
	var results = [];
	var start = new moment(Events.findOne({userID: userID, description: "Participant began ideation"}).time);
	var sessionlength = Session.get("sessionLength");
	var end = new moment(Events.findOne({userID: userID, description: "Participant began ideation"}).time).add('m', sessionlength);//new Date(start + sessionlength*MS_PER_MINUTE);

	var x = d3.time.scale()
					.domain([start, end])
					.nice(d3.time.minute)
					.range([pad, w-pad]);

	var xAxis = d3.svg.axis()
						.scale(x)
						.ticks(10)
						.tickFormat(d3.time.format("%I:%M"))
						.orient("bottom");

	var xAxisGroup = svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0," + (h - pad) + ")")
						.call(xAxis);

	var marks = svg.append("g");

	var tip = d3.tip()
				.attr('class', 'd3-tip')
				.html(function(d) { 
					var desc = d.description;
					if(desc === "Dashboard user sent examples"){
						var ideas = "Examples: ";
						for (var i = 0; i < d.examples.length; i++) {
							ideas += $.trim(d.examples[i].content) +", ";
						};
						return ideas.substring(0, ideas.length-2);
					} else if (desc === "Dashboard user changed prompt")
						return "Prompt: " + d.prompt;
					else if (desc === "Dashboard user sent theme")
						return "Theme: " + Clusters.findOne(d.theme).name;
					else if (desc === "Participant submitted idea")
						return Ideas.findOne({_id: d.ideaID}).content;
				});

	svg.call(tip);

	submissionEvents.observe({
		added: function(doc){
			results.push(doc);
			refreshGraph(results);
		}
	});

	function refreshGraph(r){
		//console.log(r);
		var m = marks.selectAll("rect")
			.data(r);
		m.enter()
			.append("rect")
			.attr("height", "50px")
			.attr("width", "2px")
			.attr("class", "bar")
			.attr("id", function(d){
				return d._id;
			})
			.attr("x", function(d){
				var time = new Date(d.time);
				return x(time);
			})
			.attr("y", 0)
			.attr("fill", "#d43f3a")
			// .append("svg:title")
			// .text(function(d) { return d.content; })
			.on('mouseover', tip.show)
  			.on('mouseout', tip.hide);
		m.exit()
			.remove();
	}

	var leverEventsCursor = Events.find({recipient: userID, description: 
		{$in: ["Dashboard user sent examples", "Dashboard user changed prompt", 
		"Dashboard user sent theme"]}}); //this should be based off of filter object .performQuery
	var leverEvents = [];
	var leverEventMarks = svg.append("g");

	

	function refreshLeverEvents(leverData){
		var lme = leverEventMarks.selectAll("circle")
					.data(leverData);
		lme.enter()
			.append("circle")
			.attr("r", "5px")
			.attr("id", function(d){
				return d._id;
			})
			.attr("cx", function(d){
				var time = new Date(d.time);
				return x(time);
			})
			.attr("cy", "50px")
			.attr("fill", function(d){
				var desc = d.description;
					if(desc === "Dashboard user sent examples")
						return "#449d44";
					else if (desc === "Dashboard user changed prompt")
						return "#428bca";
					else if (desc === "Dashboard user sent theme")
						return "#d58512";
				return "#fff";
			})
			.attr("fill-opacity", "0.4")
			.attr("stroke-width", "1px")
			.attr("stroke", function(d){
				var desc = d.description;
					if(desc === "Dashboard user sent examples")
						return "#449d44";
					else if (desc === "Dashboard user changed prompt")
						return "#428bca";
					else if (desc === "Dashboard user sent theme")
						return "#d58512";
				return "#fff";
			})
			// .append("svg:title")
			// .text(function(d) { return d.description; })
			.on('mouseover', tip.show)
  			.on('mouseout', tip.hide);
		lme.exit()
			.remove();

	}

	leverEventsCursor.observe({
		added: function(doc){
			leverEvents.push(doc);
			refreshLeverEvents(leverEvents);
		}
	});
	
	var nowWidth = (w-2*pad)/sessionlength; //1 minute
	var nowData = [new moment(Date.now())]; // data for nowLine, initialize with current moment
	var nowLine = svg.append("g");
					//.selectAll("rect")
	// nowLine.data(nowData) // initialize nowLine
	// 	.enter()
	// 	.append("rect")
	// 	.attr("height", "50px")
	// 	.attr("width", function(){
	// 		return nowWidth;
	// 	})
	// 	.attr("class", "nowLine")
	// 	.attr("x", function(d){
	// 		return x(d)-nowWidth;
	// 	})
	// 	.attr("y", 0)
	// 	.attr("fill", "gray")

	// function for updating and transitioning the nowLine
	function drawNow(nd) {
		var nLine = svg.selectAll(".nowLine")
			.data(nd)
		nLine
			.enter()
			.append("rect")
			.attr("height", "45px")
			.attr("width", function(){
				return nowWidth;
			})
			.attr("class", "nowLine")
			.attr("id", function(d){
				return d._id;
			})
			.attr("x", function(d){
				return x(d)-nowWidth;
			})
			.attr("y", 5)
			.attr("fill", "gray")
		nLine.transition()
			.duration(0)
			.attr("height", "45px")
			.attr("width", function(){
				return nowWidth
			})
			.attr("x", function(d){
				return x(d)-nowWidth;
			})
			.attr("y", 5)
			.attr("fill", "gray")
		nLine.exit()
			.transition()
			.duration(0)
			.attr("x",w) // this moves the previous nowLine off the scale
			.remove();
	}

	Meteor.setInterval(function(){
		nowData.pop(); // removing the old "now"
		nowData.push(new moment(Date.now())); // pushing the new now in
		drawNow(nowData);
	}, 100);
}

/********************************************************************
* Template Helpers
*********************************************************************/
Template.Dashboard.helpers({
	ideas : function(){
		var cursor = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas");
		console.log(cursor.count());
		return cursor;
		// var filters = Session.get("idealistFilters");//Session.get("partFilters");
		// var clusterIdeas = [];
		// for (var i = 0; i < filters.clusterFilters.length; i++) {
		// 	clusterIdeas = clusterIdeas.concat(filters.clusterFilters[i].ideas);
		// };
		// if (filters.partFilters.length > 0 && clusterIdeas.length > 0){
		// 	return IdeasToProcess.find({_id: {$in: clusterIdeas}, userID: {$in: filters.partFilters}, isGamechanger: {$in: filters.gamchanger}});
		// } else if (clusterIdeas.length > 0){
  //  			return IdeasToProcess.find({_id: {$in: clusterIdeas}, isGamechanger: {$in: filters.gamchanger}});
  //  		} else if (filters.partFilters.length > 0){
  //  			return IdeasToProcess.find({userID: {$in: filters.partFilters}, isGamechanger: {$in: filters.gamchanger}})
  //  		} else {
  //  			return IdeasToProcess.find({isGamechanger: {$in: filters.gamchanger}});
  //  		}
  	},

  	numIdeas : function(){
  		return Template.Dashboard.ideas().count();
  	},

  	clusters : function(){
  		return Clusters.find({isRoot: {$ne: true}});
  	},

  	gamechangers : function(){
  		return false;
  	},

  	users : function(){
  		var beganIdeation = Events.find({description: "Participant began ideation"});
  		var userIDs = [];
  		beganIdeation.forEach(function(event){
  			userIDs.push(event.userID);
  		})
  		return MyUsers.find({name: {$ne: "ProtoAdmin"}, _id: {$in: userIDs}});
  	},

  	selectedparts : function(){
  		return MyUsers.find({_id: {$in: Session.get("selectedParts")}});
  	},

  	partFilters : function(){
  		return MyUsers.find({_id: {$in: Session.get("idealistFilters").partFilters}});
  	},

  	clusterFilters : function(){
  		return Session.get("idealistFilters").clusterFilters;
  	}
});

Template.tagcloud.helpers({
	clusters : function(){
    	return Clusters.find({isRoot: {$ne: true}}, {sort: {name: 1}});
  	},

  	getFontSize : function(){
  		//console.log(this);
  		return 10 +(this.ideaIDs.length * 4);
  	},

  	getClusterSize : function(){
  		return this.ideaIDs.length;
  	}
})

/********************************************************************
* Template Events
*********************************************************************/
Template.Dashboard.events({
	'click .gamechangestar' : function(){
		var id = (this)._id;
		var idea = Ideas.findOne({_id: id});
		var state = !idea.isGamechanger;

		Ideas.update({_id: id}, {$set: {isGamechanger: state}});
	},

	// 'click #filterGamechangers' : function(){
	// 	var filters = Session.get("idealistFilters");
	// 	if ($("#filterGamechangers").hasClass("fa-star-o")){
	// 		filters.gamchanger = [true];
	// 		$("#filterGamechangers").switchClass("fa-star-o", "fa-star")
	// 		return Session.set("idealistFilters", filters);
	// 	} else if ($("#filterGamechangers").hasClass("fa-star")){
	// 		filters.gamchanger = [true, false];
	// 		$("#filterGamechangers").switchClass("fa-star", "fa-star-o")
	// 		return Session.set("idealistFilters", filters);
	// 	}
	// },

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
		// //var userName = MyUsers.findOne({_id: id}).name;
		// //var parts = Session.get("idealistFilters");
		// // var filters = Session.get("idealistFilters");
		// // var parts = filters.partFilters;

		// // for (var i = 0; i < parts.length; i++) {
		// // 	if(parts[i] === id) 
		// // 		return false;
		// // };

		// // filters.partFilters.push(id);
		// // //Session.set("partFilters", parts);
		// Session.set("idealistFilters", filters);

		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "userID", id);

	},

	'click .tagname' : function(){
		var id = $(event.target).parent().attr("id");
		id = id.split("-")[1];
		
		// var filters = Session.get("idealistFilters");
		// var clusters = filters.clusterFilters;

		// for (var i = 0; i < clusters.length; i++) {
		// 	if(clusters[i].id === id) 
		// 		return false;
		// };

		// var clusterMap = {
		// 	ideas: [], //maps cluster id to its idea's ids
		// }

		// var myCluster = Clusters.findOne({_id: id});
		// clusterMap.ideas = myCluster.ideas;
		// clusterMap.name = myCluster.name;
		// clusterMap.id = id;

		// filters.clusterFilters.push(clusterMap);
		// Session.set("idealistFilters", filters);

		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "clusters", id);	
	},

	'click .fa-minus-circle' : function(){
		var label = $(event.target).parent();
		var id = label.attr("id");
		id = id.split("-")[1];
		// //console.log(id);
		// var filters = Session.get("idealistFilters");

		// if(label.hasClass("partfilter-label")){
		// 	for (var i = 0; i < filters.partFilters.length; i++) {
		// 		if (filters.partFilters[i] === id){
		// 			filters.partFilters.splice(i,1);
		// 			return Session.set("idealistFilters", filters);
		// 		}
		// 	}
		// } else if(label.hasClass("clusterfilter-label")){
		// 	for (var i = 0; i < filters.clusterFilters.length; i++) {
		// 		console.log(filters.clusterFilters[i].id);
		// 		if (filters.clusterFilters[i].id === id){
		// 			filters.clusterFilters.splice(i,1);
		// 			return Session.set("idealistFilters", filters);
		// 		}
		// 	}
		// } else 
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

	'click .show-modal' : function(event, template){
		event.preventDefault();

 		var selected = template.findAll( "input[type=checkbox]:checked");

   		var array = _.map(selected, function(item) {
     		return item.defaultValue;
   		});

   		Session.set("selectedParts", array);
	},

	'click #changebutton' : function(){
		$('#new-prompt').val("");
	},

	'click #sendexbutton' : function(){
		$('.modal .idea-item').each(function(){
			$(this).removeClass("selected");
		});
	},

	//send theme clear selections
	'click #sendthemebutton' : function(){
		$('input[name="themeRadios"]').prop('checked', false);
	},

	'click .modal .idea-item' : function(event){
		var $target = $(event.target)
		if ($target.hasClass("gamechangestar"))
			return false;
		$target.toggleClass("selected");
	},

	'click #changemodal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
		var sender = Session.get("currentUser")._id;
		var recipients = Session.get("selectedParts");
		var prompt = $('#new-prompt').val();

		if(prompt === "" || prompt === " ")
			return false;

		for (var i = 0; i < recipients.length; i++) {
			changePromptNotify(sender, recipients[i], prompt);
		};
	},

	'click #sendExModal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
		var sender = Session.get("currentUser")._id;
		var recipients = Session.get("selectedParts");
		var examples = [];


		$('.modal .ideadeck .idea-item.selected').each(function(i){
			console.log("getting idea");
			var idea = {_id: $(this).attr('id'), content: $(this).text()}
			examples.push(idea);
		});
		console.log(examples)

		if(examples.length < 1)
			return false;

		for (var i = 0; i < recipients.length; i++) {
			sendExamplesNotify(sender, recipients[i], examples);
		};
	},

	'click #sendThemeModal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
		var sender = Session.get("currentUser")._id;
		var recipients = Session.get("selectedParts");
		var theme = $('input[name=themeRadios]:checked').val();
		
		if(theme === undefined)
			return false;

		for (var i = 0; i < recipients.length; i++) {
			sendThemeNotify(sender, recipients[i], theme);
		};
	}
});
