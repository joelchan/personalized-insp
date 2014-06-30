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
