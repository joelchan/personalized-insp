getRandomElement = function (array) {
    /****************************************************************
    * get a random element in a given array
    ****************************************************************/
	  var myRand = Math.floor(Math.random()*1024);
    //Divide range of 1024 evenly between number of condidions
    var interval = Math.floor(1024/array.length); 
    for (var i=0; i<array.length; i++) {
      if ((myRand >= interval * i) && (myRand < interval * (i + 1))) {
        return array[i];
      } 
    }
    //If exiting without a return, then myRand was in the small rounding
    // error margin at the top of the range
    return array[array.length - 1];
};

//Generates random alphanumeric string id
makeID = function(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

getTime = function(t){
  var time = moment(t);
  time = time.fromNow();
  return time;
};

getIndex = function(list, member) {
  for (var i=0; i<list.length; i++) {
    if (list[i] == member) {
      return i
    }
  }
}

removeMember = function(list, member) {
  var index = getIndex(list, member);
  list.splice(index, 1);
  return list;
};

FilterFactory = (function () {
  return {
    create: function(name, user, collection) {
      var newFilter = new Filter(name, user, collection);
      newFilter._id = Filters.insert(newFilter);
      return newFilter;
    },
    buildFilter: function(filter) {
      //Build query
      var querySelector = {}
      for (var i=0; i<filter.filter.length) {
        querySelector[filter.filter[i].key] = filter.filter[i].val
       
      }
        querySelector = {_id: {$in: clusterIdeas}, 
              isGamechanger: {$in: filters.gamchanger}
              });
      //Build sort
      var sortParams = {}
      for (var i=0; i<filter.sort.length) {
      }
      //Perform query with sort on desired colection
      var ideas = Ideas.find(querySelector).sort(sortParams);
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
      Filters.update({'_id': filter._id},
        {$pull: {filter: 
          'val': val}}}
        );
      //////////// Unfinished /////////////////
    },
    performQuery: function(filter) {
      return ideas.find({selector: filter.filter, 
        sort: filter.sort});
    }
  };
}());
