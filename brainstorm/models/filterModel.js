// Generic Filters for dynamic UI filtering
//    -- currently only supports comparison filters
Filters = new Meteor.Collection("filters");

Filter = function (name, user, collection) {
  /******************************************************************
   * Filter definition with parameters for filtering across a given
   * collection> 
   *
   * @params
   *    name - String describing the filter, useful as a lookup ref
   *    user - user associated with a given filter
   *    collection - string matching the collection name string
   *    field - the field of the document to match
   *    val - the value of the document
   *    op - the query comparison operator. If none, then just 
   *        matching is performed 
   *****************************************************************/
  this.name = name;
  this.user = user;
  this.collection = collection;
  this.field = field;
  this.val = val;
  if (op) {
    this.op = op
  } else {
    this.op = "in";
  }
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
    create: function(name, user, collection, field, val, op) {
      /**************************************************************
       * Create a new filter
       * @Params
       *    name - An identifier used but the filtering component
       *    user - the user that is using the query
       *    collection - the colleciton that will be queried
       *    field - the document field to be operated on (using
       *        dot notation for document subfields)
       *    val  -  the value used for comparison with the field
       *    op  - (optional) the comparison operator to be applied
       *        with the given value (ie: eq, neq, gt, lt, gte, lte)
       * @Return
       *    boolean - true if successful creation of iflter that will
       *        not conflict with existing queries
       * ***********************************************************/
      /*****************   Stub code *******************************/
      /*****************   End Stub code ***************************/
      /*****************   Actual Implementation code **************/
      /*****************   End Actual Implementation code **********/

      var newFilter = new Filter(name, user, collection);
      newFilter._id = Filters.insert(newFilter);
      return newFilter;
    },
    getFilterList: function(name, user, col) {
      /**************************************************************
       * Get the raw list of filters that will shape the query
       * @Params
       *    name - An identifier used but the filtering component
       *    user - the user that is using the query
       *    col - the colleciton that will be queried
       * @Return
       *    cursor pointing to list of filters 
       * ***********************************************************/
      /*****************   Stub code *******************************/
      /*****************   End Stub code ***************************/
      /*****************   Actual Implementation code **************/
      /*****************   End Actual Implementation code **********/

    },
    createMappedFilterList: function(name, user, col, sessVar) {
      /**************************************************************
       * Gets a filter list and pushes the mapped result into a 
       * session var
       * @Params
       *    name - An identifier used but the filtering component
       *    user - the user that is using the query
       *    col - the colleciton that will be queried
       *    sessVar - the name of the session variable to store the 
       *        mapped filter result        
       * @Return
       *    object with 5 possible fields
       *      users - a list of users referenced by filters
       *      clusters - a list of clusters referenced by filters
       *      eventTypes - the list of Event types
       *      time - a single object with 2 possible fields: begin
       *          and end, where begin and end are a javascript Date
       *      misc - array of raw filters not translated into one of
       *          the above categories 
       * ***********************************************************/
      /*****************   Stub code *******************************/
      /*****************   End Stub code ***************************/
      /*****************   Actual Implementation code **************/
      /*****************   End Actual Implementation code **********/

    },
    remove: function(name, user, col, field, val) {
      /**************************************************************
       * Delete the specific filter matching the given params
       * @Params
       *    name - An identifier used but the filtering component
       *    user - the user that is using the query
       *    collection - the colleciton that will be queried
       *    field - the document field to be operated on (using
       *        dot notation for document subfields)
       *    val  -  the value used for comparison with the field
       *
       * @Return
       *    boolean if the filter was successfully removed
       * ***********************************************************/
      /*****************   Stub code *******************************/
      /*****************   End Stub code ***************************/
      /*****************   Actual Implementation code **************/
      /*****************   End Actual Implementation code **********/

    },
    reset: function(name, user, col) {
      /**************************************************************
       * Delete all filters associated with the name, user, and
       * collection
       * @Params
       *    name - An identifier used but the filtering component
       *    user - the user that is using the query
       *    collection - the colleciton that will be queried
       * @Return
       *    boolean if all the filters was successfully removed
       * ***********************************************************/
      /*****************   Stub code *******************************/
      /*****************   End Stub code ***************************/
      /*****************   Actual Implementation code **************/
      /*****************   End Actual Implementation code **********/

    },
    performQuery: function(name, user, collection) {
      /**************************************************************
       * Create a new filter
       * @Params
       *    name - An identifier used but the filtering component
       *    user - the user that is using the query
       *    collection - the colleciton that will be queried
       * @Return
       *    Collection cursor of the collection specified
       * ***********************************************************/
      /*****************   Stub code *******************************/
      /*****************   End Stub code ***************************/
      /*****************   Actual Implementation code **************/
      /*****************   End Actual Implementation code **********/

    },

    //performQuery: function(filter) {
      ////Build query
      //var querySelector = {};
      //for (var i = 0; i <filter.filter.length; i++) {
      	//querySelector[filter.filter[i].key] = filter.filter[i].val;
      //};
      //// querySelector = {_id: {$in: clusterIdeas}, 
      ////         isGamechanger: {$in: filters.gamchanger}
      ////         });
      ////Build sort
      //var sortParams = {};
      //// for (var i=0; i<filter.sort.length) {
      //// }
      ////Perform query with sort on desired colection
      //var collection = MyCollections[filter.collection];
      ////console.log(filter);
      ////console.log("query:");
      ////console.log(querySelector);
      //var results =  collection.find(querySelector, 
        //{sort: sortParams});
      ////console.log("query result count: " + results.count());
      //return results;
    //},
//
    //resetFilter: function(filter) {
      ///**************************************************************
       //* Reset a given filter to no sort and filter parameters
       //*************************************************************/
//
    //},
//
    //getFilterCollection: function(filter){
    	//return MyCollections[filter.collection];
    //},
//
    //addSort: function(filter, key, val) {
      ///* update the given filter in the db */
      ///* Add the given sort params to the given filter */
      //filter.sort.push({'key': key,
          //'val': val
      //});
      //Filters.update({'_id': filter._id},
        //{$push: {sort: {'key': key,
          //'val': val}}}
      //);
    //},
//
    //addFilter: function(filter, key, val) {
      ///**************************************************************
       //* add a filter by specifying the key: val of the mongo 
       //* selector
       //*************************************************************/
      //filter.filter.push({'key': key, 'val': val});
      //Filters.update({'_id': filter._id},
        //{$push: {filter: {'key': key,
          //'val': val}}}
      //);
    //},
    //addComparisonFilter: function(filter, key, op, val) {
      ///**************************************************************
       //* add a filter by specifying the key, the comparison operator
       //* and the val to compare in a mongo selector
       //*************************************************************/
      //filter.filter.push({'key': key, 'val': {op: val}});
      //Filters.update({'_id': filter._id},
        //{$set: {filter: {'key': key,
          //'val': {op: val}}}}
      //);
    //},
    //addInListFilter: function(filter, key, list) {
      ///**************************************************************
       //* add a filter by specifying the key, the comparison operator
       //* and the list of vals to compare in a mongo selector
       //*************************************************************/
      //var val = {'$in': list};
      //filter.filter.push({'key': key, 'val': val});
      //Filters.update({'_id': filter._id},
        //{$set: {filter: {'key': key,
          //'val': String({'$in': list})}}}
      //);
    //},
    //addNotInListFilter: function(filter, key, list) {
      ///**************************************************************
       //* add a filter by specifying the key, the comparison operator
       //* and the list of vals to compare in a mongo selector
       //*************************************************************/
      //filter.filter.push({'key': key, 'val': {'$nin': list}});
      //Filters.update({'_id': filter._id},
        //{$set: {filter: {'key': key,
          //'val': {'$in': list}}}}
      //);
    //},
//
    //appendInListFilter: function(filter, key, list) {
      //filter.filter.push({key: val});
      //Filters.update({'_id': filter._id},
        //{$push: {filter: {'key': key,
          //'val': val}}}
        //);
    //},
//
    //removeFromInListFilter: function(filter, key, member) {
      ///* Search through the list at the given key and remove
       //* the member
       //*/
      //var list = filter.filter[key];
      //removeMember(list, member);
      //filter.filter[key] = list;
      /////////////// Unfinished /////////////////
     ////  Filters.update({'_id': filter._id},
     ////    {$pull: 
     ////    	{filter: 'val': val}
     ////    }
    	//// });
      ////////////// Unfinished /////////////////
    //},
//
    ////performQuery: function(filter) {
      ////return ideas.find({selector: filter.filter, 
        ////sort: filter.sort});
    //},
    //deleteFilter: function(filter) {
      //Filters.remove({"_id": filter._id});
    //}
  };
}());

