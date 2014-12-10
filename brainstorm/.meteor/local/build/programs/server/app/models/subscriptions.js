(function(){/********************************************************************
* Currrently holds all subscriptions to all collections. These should
* be moved to relevant locations (e.g. routes.js and specific
* Templates where the data is actually needed) in client as logic 
* becomes more developed. Publications are located in 
* brainstorm/models/publications.js for now.
********************************************************************/

Meteor.startup(function(){
  if (Meteor.isClient) {
		/************************************************************
		* Subscribe to models.js collections
		************************************************************/
		//Meteor.subscribe("ideas");
		Meteor.subscribe("replayIdeas");
		Meteor.subscribe("clusters");
		Meteor.subscribe("prompts");
		Meteor.subscribe("myUsers");
		Meteor.subscribe("roles");
		Meteor.subscribe("groups");
		Meteor.subscribe("groupTemplates");
		Meteor.subscribe("userTypes");
    Meteor.subscribe("filters");
		/************************************************************
		* Subscribe to experimentModels.js collections
		************************************************************/
		Meteor.subscribe("experiments");
    Meteor.subscribe('exp-conditions');
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
		//Meteor.subscribe("events");
		Meteor.subscribe("eventTypes");
		Meteor.subscribe("events");
		/************************************************************
		* Subscribe to notificationModels.js collection
		************************************************************/
		Meteor.subscribe("notifications");

  }
});

// Manually define dictionary of all collections
MyCollections = 
{
    "ideas": Ideas,
    "prompts": Prompts,
    "replayIdeas": ReplayIdeas,
    "myUsers": MyUsers,
    "roles": Roles,
    "groups": Groups,
    'groupTemplates': GroupTemplates,
    'clusters': Clusters,
    'ideasToProcess': IdeasToProcess,
    'filters': Filters,
    'notifications': Notifications,
    'experiments': Experiments,
    'exp-conditions': Conditions,
    'consents': Consents,
    'participants': Participants,
    'surveyResponses': SurveyResponses
};
//myCollections = (function() {
  //console.log("running init of all collections dictionary");
  //var allCols = {};
  //for(var key in window) {
    //var value = window[key];
    //if (value instanceof Meteor.Collection) {
      //allCols[value._name] = value;
    //}
  //}
  //return allCols; 
//}());

})();
