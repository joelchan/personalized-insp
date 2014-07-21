// Generic Filters for dynamic UI filtering
Filters = new Meteor.Collection("filters");

Filter = function (name, user, collection) {
  this.name =  name;
  this.user = user;
  this.collection = collection;
  this.sort = [];
  this.filter = [];
};

FilterFactoryInit = function () {
  return {
    create: function(name, user, collection) {
      var newFilter = new Filter(name, user, collection);
      newFilter._id = Filters.insert(newFilter);
      return newFilter;
    },
    buildFilter: function(filter) {
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
      var ideas = Ideas.find(querySelector).sort(sortParams);
    },
    getFilterCollection: function(filter){
    	getCollection(filter.collection);
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
      filter.filter.push({key: val});
      Filters.update({'_id': filter._id},
        {$push: {filter: {'key': key,
          'val': val}}}
        );
    },
    addListFilter: function(filter, key, list) {
      filter.filter[key] = list;
      Filters.update({'_id': filter._id},
        {$set: {filter: {'key': key,
          'val': list}}}
        );
    },
    appendListFilter: function(filter, key, list) {
      filter.filter.push({key: val});
      Filters.update({'_id': filter._id},
        {$push: {filter: {'key': key,
          'val': val}}}
        );
    },
    removeFromListFilter: function(filter, key, member) {
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
    performQuery: function(filter) {
      return ideas.find({selector: filter.filter, 
        sort: filter.sort});
    }
  };
};

FilterFactory = FilterFactoryInit();
