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
    'sorters':Sorters,
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
