/********************************************************************
* Currrently holds all subscriptions to all collections. These should
* be moved to relevant locations (e.g. routes.js and specific
* Templates where the data is actually needed) in client as logic 
* becomes more developed. Publications are located in 
* brainstorm/publications.js for now.
********************************************************************/

Meteor.startup(function(){

	if(Meteor.isClient){
		/************************************************************
		* Subscribe to models.js collections
		************************************************************/
		Meteor.subscribe("ideas");
		Meteor.subscribe("replayIdeas");
		Meteor.subscribe("ideasToProcess");
		Meteor.subscribe("clusters");
		Meteor.subscribe("prompts");
		Meteor.subscribe("names");
		Meteor.subscribe("roles");
		Meteor.subscribe("groups");
		Meteor.subscribe("userTypes");
		/************************************************************
		* Subscribe to experimentModels.js collections
		************************************************************/
		Meteor.subscribe("experiments");
		Meteor.subscribe("consents");
		Meteor.subscribe("participants");
		Meteor.subscribe("SurveyResponses");
		/************************************************************
		* Subscribe to contentModels.js collections
		************************************************************/
		Meteor.subscribe("screens");
		Meteor.subscribe("textBlocks");
		/************************************************************
		* Subscribe to loggingModels.js collection
		************************************************************/
		Meteor.subscribe("events");
		/************************************************************
		* Subscribe to notificationModels.js collection
		************************************************************/
		Meteor.subscribe("notifications");
	}
});