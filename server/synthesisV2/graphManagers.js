// Configure logger for Filters
var logger = new Logger('Server:SynthesisV2:GraphManagers');
// Comment out to use global logging level
Logger.setLevel('Server:SynthesisV2:GraphManagers', 'trace');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'debug');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'info');
//Logger.setLevel('Server:SynthesisV2:GraphManagers', 'warn');


Meteor.methods({
  /****************************************************************
   * Graph management functions
   * *************************************************************/
  graphCreate: function() {
    logger.trace("Creating new Graph");
    var graph = new Graph();
    graph._id = Graphs.insert(graph);
    //var factory = this;
    //if (hasForEach(ideas)) {
      //ideas.forEach(function(idea) {
        //logger.trace("Adding idea with id + " + idea._id + " to cluster");
        //ClusterFactory.insertIdeaToCluster(idea, cluster);
      //});
    //} else if (ideas) {
      //logger.trace("Adding idea with id + " + ideas._id + " to cluster");
      //ClusterFactory.insertIdeaToCluster(ideas, cluster);
    //}
    return Graph;
  },

});
