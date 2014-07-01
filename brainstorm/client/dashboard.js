handle = Meteor.subscribe("clusters");
MS_PER_MINUTE = 60000;
start = Date.now;

Template.Dashboard.rendered = function(){
	Session.set("currentPrompt", "Alternate uses for an iPod");
	Session.set("participant", null);

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

	Deps.autorun(function () {
		console.log('Inside autorun, Deps.active = ', Deps.active);
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
    // Data join

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
}

Template.userseries.rendered = function(){
	var self = this;
	var part_ID = self.data._id;
	var node = self.find(".series");
	var svg = d3.select(node).append("svg");

	var h = 70;
	var w = 535;
	var pad = 20;

	Deps.autorun(function() {
		data = Ideas.find({"participantID": part_ID}).fetch();
		var now = new Date(Date.now());
		var minAgo = new Date(now - 15*MS_PER_MINUTE);
		var x = d3.time.scale()
						.domain([minAgo, now])
						.range([w-pad, pad]);

		var xAxis = d3.svg.axis()
							.scale(x)
							.ticks(2)
							.tickFormat(function(d){
								return moment(d).fromNow();
							})
							.orient("bottom")

		var xAxisGroup = svg.append("g")
							.attr("class", "axis")
							.attr("transform", "translate(0," + (h - pad) + ")")
							.call(xAxis);

		var marks = svg.append("g")
						.selectAll("rect")
						.data(data)
		marks.enter()
			.append("rect")
			.attr("height", "50px")
			.attr("width", "1.5px")
			.attr("id", function(d){
				return d._id;
			})
			.attr("x", function(d){
				//console.log(now)
				var durToIdea = moment.duration(d.time, "hh:mm:ss.SSS");
				var ideaTime = moment(minAgo).add(durToIdea);
				return x(ideaTime);
			})
			.attr("y", 0)
			.attr("fill", "red")
			.append("svg:title")
   			.text(function(d) { return d.content; });
	});
}

/********************************************************************
* Template Helpers
*********************************************************************/
Template.Dashboard.helpers({
	ideas : function(){
   		return Ideas.find();
  	},

  	numIdeas : function(){
  		return Ideas.find().fetch().length
  	},

  	gamechangers : function(){
  		return false;
  	},

  	clusters : function(){
    	return Clusters.find().fetch();
  	},

  	participants : function(){
  		return Participants.find().fetch();
  	},
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
		console.log(id);
	},

	'dblclick .profile' : function(){
		var id = $(this).attr('id');
		console.log(id);
	},

	'dblclick #examples .idea' : function(){
		event.target.remove()
	}
});
