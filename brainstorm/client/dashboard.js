/********************************************************************
* Template Helpers
*********************************************************************/
Template.Dashboard.helpers({
	ideas : function(){
   		return Ideas.find();
  	},

  	gamechangers : function(){
  		return false;
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

	'dblclick #examples .idea' : function(){
		event.target.remove()
	}
});
