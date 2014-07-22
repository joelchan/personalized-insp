// Generic Filters for dynamic UI filtering
Filters = new Meteor.Collection("filters");

Filter = function (name, user, collection) {
  /******************************************************************
   * Filter definition with parameters for filtering across a given
   * collection
   *
   * @params
   *    name - String describing the filter, useful as a lookup ref
   *    user - user associated with a given filter
   *    collection - string matching the collection name string
   *****************************************************************/
  this.name =  name;
  this.user = user;
  this.collection = collection;
  this.sort = [];
  this.filter = [];
};

FilterFactory = (function () {
  return {
    //myCollections: (function() {
      //console.log("running init of all collections dictionary");
      //var allCols = {};
      //for(var key in window) {
        //var value = window[key];
        //if (value instanceof Meteor.Collection) {
          //allCols[value._name] = value;
        //}
      //}
      //return allCols; 
    //}()),
      //"ideas": Ideas,
      //"prompts": Prompts,
      //"replayIdeas": ReplayIdeas,
      //"myUsers": MyUsers,
      //"roles": Roles,
      //"groups": Groups,
      //'groupTemplates': GroupTemplates,
      //'clusters': Clusters,
      //'ideasToProcess': IdeasToProcess,
      //'filters': Filters,
      //'notifications': Notifications,
      //'experiments': Experiments,
      //'exp-conditions': Conditions,
      //'consents': Consents,
      //'participants': Participants,
      //'surveyResponses': SurveyResponses
    //},
    create: function(name, user, collection) {
      var newFilter = new Filter(name, user, collection);
      newFilter._id = Filters.insert(newFilter);
      return newFilter;
    },

    performQuery: function(filter) {
      //Build query
      var querySelector = {};
      for (var i = 0; i <filter.filter.length; i++) {
      	querySelector[filter.filter[i].key] = filter.filter[i].val;
      };
      // querySelector = {_id: {$in: clusterIdeas}, 
      //         isGamechanger: {$in: filters.gamchanger}
      //         });
      //Build sort
      var sortParams = {};
      // for (var i=0; i<filter.sort.length) {
      // }
      //Perform query with sort on desired colection
      var collection = MyCollections[filter.collection];
      //console.log(filter);
      //console.log("query:");
      //console.log(querySelector);
      var results =  collection.find(querySelector, 
        {sort: sortParams});
      //console.log("query result count: " + results.count());
      return results;
    },

    resetFilter: function(filter) {
      /**************************************************************
       * Reset a given filter to no sort and filter parameters
       *************************************************************/

    },

    getFilterCollection: function(filter){
    	return MyCollections[filter.collection];
    },

    addSort: function(filter, key, val) {
      /* update the given filter in the db */
      /* Add the given sort params to the given filter */
      filter.sort.push({'key': key,
          'val': val
      });
      Filters.update({'_id': filter._id},
        {$push: {sort: {'key': key,
          'val': val}}}
      );
    },

    addFilter: function(filter, key, val) {
      /**************************************************************
       * add a filter by specifying the key: val of the mongo 
       * selector
       *************************************************************/
      filter.filter.push({'key': key, 'val': val});
      Filters.update({'_id': filter._id},
        {$push: {filter: {'key': key,
          'val': val}}}
      );
    },
    addComparisonFilter: function(filter, key, op, val) {
      /**************************************************************
       * add a filter by specifying the key, the comparison operator
       * and the val to compare in a mongo selector
       *************************************************************/
      filter.filter.push({'key': key, 'val': {op: val}});
      Filters.update({'_id': filter._id},
        {$set: {filter: {'key': key,
          'val': {op: val}}}}
      );
    },
    addInListFilter: function(filter, key, list) {
      /**************************************************************
       * add a filter by specifying the key, the comparison operator
       * and the list of vals to compare in a mongo selector
       *************************************************************/
      var val = {'$in': list};
      filter.filter.push({'key': key, 'val': val});
      Filters.update({'_id': filter._id},
        {$set: {filter: {'key': key,
          'val': String({'$in': list})}}}
      );
    },
    addNotInListFilter: function(filter, key, list) {
      /**************************************************************
       * add a filter by specifying the key, the comparison operator
       * and the list of vals to compare in a mongo selector
       *************************************************************/
      filter.filter.push({'key': key, 'val': {'$nin': list}});
      Filters.update({'_id': filter._id},
        {$set: {filter: {'key': key,
          'val': {'$in': list}}}}
      );
    },

    appendInListFilter: function(filter, key, list) {
      filter.filter.push({key: val});
      Filters.update({'_id': filter._id},
        {$push: {filter: {'key': key,
          'val': val}}}
        );
    },

    removeFromInListFilter: function(filter, key, member) {
      /* Search through the list at the given key and remove
       * the member
       */
      var list = filter.filter[key];
      removeMember(list, member);
      filter.filter[key] = list;
      ///////////// Unfinished /////////////////
     //  Filters.update({'_id': filter._id},
     //    {$pull: 
     //    	{filter: 'val': val}
     //    }
    	// });
      //////////// Unfinished /////////////////
    },

    //performQuery: function(filter) {
      //return ideas.find({selector: filter.filter, 
        //sort: filter.sort});
    //},
    deleteFilter: function(filter) {
      Filters.remove({"_id": filter._id});
    }
  };
}());

