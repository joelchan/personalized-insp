Session.set("partFilters", []);
Session.set("selectedParts", []);
Session.set("selectedIdeas", []);
MS_PER_MINUTE = 60000;

Template.Dashboard.rendered = function(){
	Session.set("currentPrompt", "Alternate uses for an iPod");
}

Template.tagcloud.rendered = function(){
	var self = this;
	self.node = self.find("svg");
	var w = 453;
	var h = 280;
	var hPad = 20;
	var wPad = 30;
	var svg = d3.select("#tagcloud")
				.append("svg")
				.attr("height", h)
				.attr("width", w);

	var timeDep = new Deps.Dependency();
	Deps.autorun(function () {
		timeDep.depend();
		var clusters = Clusters.find().fetch();

    	var xScale = d3.scale.linear()
						.domain([d3.min(clusters, function(d){
							if(d.position !== undefined) return d.position.left;
						}), d3.max(clusters, function(d) {
							if(d.position !== undefined) return d.position.left; 
						})])
						.range([wPad, w - wPad*3]);

		var yScale = d3.scale.linear()
						.domain([d3.min(clusters, function(d){
							if(d.position !== undefined) return d.position.top;
						}), d3.max(clusters, function(d) {
							if(d.position !== undefined) return d.position.top;
						})])
						.range([hPad, h - hPad]);

		var wsScale = d3.scale.linear()
						.domain([0, d3.max(clusters, function(d){
							if(d.ideas !== undefined) return d.ideas.length;
						})])
						.range([10, 25]);

    	var tags = svg.selectAll("text")
    				.data(clusters);

    	tags.enter()
   			.append("text")
    		.attr("x", function(d){
    			if(d.position !== undefined)
    				return xScale(d.position.left);
   			})
 			.attr("y", function(d){
    			if(d.position !== undefined)
    				return yScale(d.position.top);
    		})
    		.style("font-size", function(d){
    			if(d.ideas !== undefined){
    				console.log(wsScale(d.ideas.length));
    				return wsScale(d.ideas.length);}
    		})
			.text(function(d){
			   	return d.name;
			});

		tags.exit()
			.remove();
	});

	timeDep.changed(); //run once at beginning
	setInterval(function(){
		timeDep.changed();
	}, 5000);
}

Template.userseries.rendered = function(){
	//var start = Date.now;
	//console.log(this);
	var self = this;
	var userID = self.data._id;
	//console.log(userID);
	//var part_ID = self.data.
	var node = self.find(".series");
	var svg = d3.select(node).append("svg");

	var h = 70;
	var w = 546;
	var pad = 20;


	var submissionEvents = Events.find({userID: userID, description: "Participant submitted idea"}); //
	var results = [];//submissionEvents.fetch();

	//console.log(data);
	var start = new moment(Events.findOne({userID: userID, description: "Participant began ideation"}).time);
	console.log("start: ");
	console.log(start);
	//console.log(start);
	var sessionlength = 15;
	var end = new moment(Events.findOne({userID: userID, description: "Participant began ideation"}).time).add('m', 15);//new Date(start + sessionlength*MS_PER_MINUTE);
	console.log("end: ");
	console.log(end);
	// var now = new Date(Date.now());
	// var minAgo = new Date(now - 15*MS_PER_MINUTE);
	var x = d3.time.scale()
					.domain([start, end])
					.nice(d3.time.minute)
					.range([pad, w-pad]);

	var xAxis = d3.svg.axis()
						.scale(x)
						.ticks(15)
						.tickFormat(d3.time.format("%I:%M"))
						// .tickFormat(function(d){
						// 	return moment(d).fromNow();
						// })
						.orient("bottom");

	var xAxisGroup = svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0," + (h - pad) + ")")
						.call(xAxis);

	var marks = svg.append("g")
					.selectAll("rect")

	submissionEvents.observe({
		added: function(doc){
			results.push(doc);
			refreshGraph(results);
		}
	});

	function refreshGraph(r){
		console.log(r);
		marks.data(r)
			.enter()
			.append("rect")
			.attr("height", "50px")
			.attr("width", "1.5px")
			.attr("class", "bar")
			.attr("id", function(d){
				return d._id;
			})
			.attr("x", function(d){
				//console.log(now)
				// var durToIdea = moment.duration(d.time);
				// var ideaTime = moment(minAgo).add(durToIdea);
				// return x(ideaTime);
				//console.log(d);
				var time = new Date(d.time);
				//console.log(time);
				console.log(x(time));
				return x(time);
			})
			.attr("y", 0)
			.attr("fill", "#d43f3a")
			.append("svg:title")
			.text(function(d) { return d.content; });
		marks.transition()
			.duration(500)
			.attr("height", "50px")
			.attr("width", "1.5px")
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
		marks.exit()
			.transition()
			.duration(500)
			.attr("x",w)
			.remove();
	}

	var nowData = [new moment(Date.now())]; // data for nowLine, initialize with current moment
	var nowLine = svg.append("g")
					.selectAll("rect")
	nowLine.data(nowData) // initialize nowLine
		.enter()
		.append("rect")
		.attr("height", "50px")
		.attr("width", "2px")
		.attr("class", "nowLine")
		.attr("x", function(d){
			return x(d);
		})
		.attr("y", 0)
		.attr("fill", "gray")

	// function for updating and transitioning the nowLine
	function drawNow(nd) {
		var nLine = svg.selectAll(".nowLine")
			.data(nd)
		nLine
			.enter()
			.append("rect")
			.attr("height", "50px")
			.attr("width", "2px")
			.attr("class", "nowLine")
			.attr("id", function(d){
				return d._id;
			})
			.attr("x", function(d){
				return x(d);
			})
			.attr("y", 0)
			.attr("fill", "gray")
		nLine.transition()
			.duration(500)
			.attr("height", "50px")
			.attr("width", "2px")
			.attr("x", function(d){
				return x(d);
			})
			.attr("y", 0)
			.attr("fill", "gray")
		nLine.exit()
			.transition()
			.duration(500)
			.attr("x",w) // this moves the previous nowLine off the scale
			.remove();
	}

	Meteor.setInterval(function(){
		nowData.pop(); // removing the old "now"
		nowData.push(new moment(Date.now())); // pushing the new now in
		drawNow(nowData);
	}, 1000);
	//var timeDep = new Deps.Dependency();

	// Events.find({userID: userID, description: "Participant submitted idea"}).observeChanges({
	// 	added: function(doc){
	// 		// console.log("calling refreshGraph");
	// 		// console.log(data);
	// 		data.push(Events.findOne({_id: doc}));
	// 		// console.log(data);
	// 		refreshGraph();
	// 	}
	// });

	//refreshGraph();


	// function refresh(){
	// 	console.log("refresh");
	// 	//timeDep.depend();
	// 	data = Events.find({userID: userID, description: "Participant submitted idea"/*, time: {$lt: Date(now - 15*MS_PER_MINUTE)}*/}).fetch();
	// 	console.log(data.length);
	// 	// data = Events.find({userID: userID, description: "Participant submitted idea"}).fetch(); //
	// 	// //data = Ideas.find({"participantID": part_ID}).fetch(); //change to events
	// 	// var now = new Date(Date.now());
	// 	// var minAgo = new Date(now - 15*MS_PER_MINUTE);
	// 	// var x = d3.time.scale()
	// 	// 				.domain([minAgo, now])
	// 	// 				.nice(d3.time.minute)
	// 	// 				.range([w-pad, pad]);

	// 	// var xAxis = d3.svg.axis()
	// 	// 					.scale(x)
	// 	// 					.ticks(4)
	// 	// 					.tickFormat(function(d){
	// 	// 						return moment(d).fromNow();
	// 	// 					})
	// 	// 					.orient("bottom")

	// 	// var xAxisGroup = svg.append("g")
	// 	// 					.attr("class", "axis")
	// 	// 					.attr("transform", "translate(0," + (h - pad) + ")")
	// 	// 					.call(xAxis);
	// 	//marks.remove();
	// 	marks.attr("transform", "translate("+x(new Date(Date.now()+1000))+")")

	// 	marks.data(data)
	// 		.enter()
	// 		.append("rect")
	// 		.attr("height", "50px")
	// 		.attr("width", "1.5px")
	// 		.attr("class", "bar")
	// 		.attr("id", function(d){
	// 			return d._id;
	// 		})
	// 		.attr("x", function(d){
	// 			//console.log(now)
	// 			// var durToIdea = moment.duration(d.time);
	// 			// var ideaTime = moment(minAgo).add(durToIdea);
	// 			// return x(ideaTime);
	// 			console.log("x");
	// 			return x(d.time);
	// 		})
	// 		.attr("y", 0)
	// 		.attr("fill", "#d43f3a")
	// 		.append("svg:title")
 //   			.text(function(d) { return d.content; });

 //   	}

	// Meteor.setInterval(function(){
	// 	refresh()
	// }, 1000);
}

/********************************************************************
* Template Helpers
*********************************************************************/
Template.Dashboard.helpers({
	ideas : function(){
		var filters = Session.get("partFilters");
		if(filters.length > 0){
			return Ideas.find({userName: {$in: filters}});
		} else
   			return Ideas.find();
  	},

  	numIdeas : function(){
  		var filters = Session.get("partFilters");
		if(filters.length > 0){
			return Ideas.find({userName: {$in: filters}}).count();
		} else
   			return Ideas.find().count();
  	},

  	gamechangers : function(){
  		return false;
  	},

  	clusters : function(){
    	return Clusters.find();
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
  		return Session.get("selectedParts");
  	},

  	filters : function(){
  		return Session.get("partFilters");
  	}
});

/********************************************************************
* Template Events
*********************************************************************/
Template.Dashboard.events({
	'dblclick .idealist .idea' : function(){
		$('#examples').append(event.target);
		//need to show visually that idea is selected as example in idea list?
	},

	'click .idealist .idea' : function(){
		var id = $(event.target).attr('id');
	},

	'dblclick .profile' : function(e){
		var id = e.currentTarget.id;
		id = id.split("-")[1];
		var userName = MyUsers.findOne({_id: id}).name;
		var parts = Session.get("partFilters");

		for (var i = 0; i < parts.length; i++) {
			if(parts[i] === id) 
				return false;
		};

		parts.push(userName);
		Session.set("partFilters", parts);
	},

	'click .fa-minus-circle' : function(){
		var label = $(event.target).parent();
		var id = label.text();
		console.log(id);
		if(label.hasClass("filter-label")){
			console.log("removeing filter label");
			var partFilters = Session.get("partFilters");
			for (var i = 0; i < partFilters.length; i++) {
				if (partFilters[i] === id){
					partFilters.splice(i,1);
					console.log("removed");
					return Session.set("partFilters", partFilters);
				}
			};
		} else if (label.hasClass("part-label")) {
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

	'click .modal .idea' : function(){
		$(event.target).toggleClass("selected");
	},

	'click #changemodal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
		var recipients = Session.get("selectedParts");
		var prompt = $('#new-prompt').val();
		var sender = Session.get("currentUser");

		for (var i = 0; i < recipients.length; i++) {
			changePromptNotify(sender, recipients[i], prompt);
		};
	},

	'click #sendmodal > div > div > div.modal-footer > button.btn.btn-primary' : function(){
		var recipients = Session.get("selectedParts");
		var examples = [];

		var sender = Session.get("currentUser");

		$('#sendmodal-idealist .idea.selected').each(function(i){
			var idea = {_id: $(this).attr('id'), content: $(this).text()}
			examples.push(idea);
		});

		for (var i = 0; i < recipients.length; i++) {
			sendExamplesNotify(sender, recipients[i], examples);
		};
	}
});
