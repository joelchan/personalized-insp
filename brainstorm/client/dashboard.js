handle = Meteor.subscribe("clusters");

Template.Dashboard.rendered = function(){

	/*var w = 400;
	var h = 50;
	var ideasFreq = [2, 5, 3, 1, 2, 0, 2, 1, 2, 0, 1];

	var hist =	d3.select(".series")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

	hist.selectAll("rect")
		.data(ideasFreq)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return i * (w / ideasFreq.length) 
		})
		.attr("y", function(d){
			return h - (d * 5);
		})
		.attr("width", function(d, i){
			return (w / ideasFreq.length)-1 
		})
		.attr("height", function(d){
			return (d * 5);
		})
		.attr("fill", function(d){
			return "rgb("+ (50-10*d) +","+ (118-10*d) +","+ (177-10*d)+")";
		});*/

}

Template.tagcloud.rendered = function(){
	var self = this;
	self.node = self.find("svg");
	var w = 525;
	var h = 325;
	var pad = 30;
	var svg = d3.select("#tagcloud")
				.append("svg")
				.attr("height", h)
				.attr("width", w);

	Deps.autorun(function () {
		console.log('Inside autorun, Deps.active = ', Deps.active);
    	var clusters = Clusters.find().fetch();

    	var xScale = d3.scale.linear()
						.domain([0, d3.max(clusters, function(d) {
							if(d.position !== undefined) return d.position.left; 
						})])
						.range([0, w - pad*5]);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(clusters, function(d) {
							if(d.position !== undefined) return d.position.top;
						})])
						.range([pad, h - pad]);

		var wsScale = d3.scale.linear()
						.domain([0, d3.max(clusters, function(d){
							if(d.ideas !== undefined) return d.ideas.length;
						})])
						.range([10, 30]);
    // Data join
    	var tags = svg.selectAll("text")
    				.data(clusters)
    				.enter()
    				.append("text")
    				.attr("x", function(d){
    					if(d.position !== undefined)
    						return xScale(d.position.left);
    				})
    				.attr("y", function(d){
    					if(d.position !== undefined)
    						return yScale(d.position.top);
    				})
    				.attr("text-anchor", "middle")
    				.style("font-size", function(d){
    					if(d.ideas !== undefined){
    						console.log(wsScale(d.ideas.length));
    						return wsScale(d.ideas.length);}
    				})
			    	.text(function(d){
			    		return d.name;
			    	})
	});
}

Template.userseries.rendered = function(){
	var self = this;
	var part_ID = self.data._id;
	var node = self.find(".series");
	var svg = d3.select(node).append("svg");
	svg.style("border", "1px solid #ddd");

	var h = 70;
	var w = 535;
	var pad = 20;
	//var tFormat = d3.time.format("%H:%M:%S%L");

	var x = d3.scale.linear()
					.domain([0,15])
					.range([0, 535]);

	var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(5);

	var xAxisGroup = svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0," + (h - pad) + ")")
						.call(xAxis);

	/*var x = d3.time.scale();
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(d3.time.minutes, 1)
			.tickFormat(d3.time.format('%M:%S'));

	console.log(xAxis);*/
	//Deps.autorun(function() {});
	//data = Ideas.find({"participantID": part_ID}).fetch();
	//console.log(data);
	//data = processIdeas(data);

	/*svg.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.text(function(d){
			return d.time;
		});*/

	processIdeas = function(ideas){
		var bins = []
		for (var i = 0; i < ideas.length; i++) {
			ideas[i]
		};
	}


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

	'dblclick #examples .idea' : function(){
		event.target.remove()
	}
});
