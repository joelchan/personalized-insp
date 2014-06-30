Meteor.subscribe("clusters");

Template.Dashboard.rendered = function(){

	var w = 400;
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
		});

}

Template.tagcloud.rendered = function(){
	var self = this;
	self.node = self.find("svg");
	var w = 525;
	var h = 325;
	var pad = 20;
	var svg = d3.select("#tagcloud")
				.append("svg")
				.attr("height", h)
				.attr("width", w);

	Deps.autorun(function () {
    	var clusters = Clusters.find().fetch();

    	var xScale = d3.scale.linear()
						.domain([0, d3.max(clusters, function(d) {
							if(d.position !== undefined) return d.position.left; 
						})])
						.range([pad, w - pad*4]);

		var yScale = d3.scale.linear()
						.domain([0, d3.max(clusters, function(d) {
							if(d.position !== undefined) return d.position.top;
						})])
						.range([pad, h - pad]);
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
			    	.text(function(d){
			    		return d.name;
			    	})

	});
}
/********************************************************************
* Template Helpers
*********************************************************************/
Template.Dashboard.helpers({
	ideas : function(){
   		return Ideas.find();
  	},

  	gamechangers : function(){
  		return false;
  	},

  	clusters : function(){
    	return Clusters.find().fetch();
  	},

  	users : function(){
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
