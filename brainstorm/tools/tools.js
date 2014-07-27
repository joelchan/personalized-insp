// Configure logger for Tools
var logger = new Logger('Tools:Tools');
// Comment out to use global logging level
Logger.setLevel('Tools:Tools', 'info');


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

//from http://stackoverflow.com/questions/10984030/get-meteor-collection-by-name
//Returns meteor collection based on string name. Only works in client(?)
getCollection = function (name) {
  //console.log(Meteor.connection._mongo_livedata_collections["ideas"]);
  return Meteor.connection._mongo_livedata_collections[name];
  // for (var globalObject in global) {
  //     if (global[globalObject] instanceof Meteor.Collection) {
  //         if (globalObject === string) {
  //             return (global[globalObject]);
  //             break;
  //         };        
  //     }
  // }
  // return undefined; // if none of the collections match
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

isInList = function(member, list, field) {
  if (!(list instanceof Array)) {
    logger.trace("Checking in cursor list for member: " + JSON.stringify(member));
    list = list.fetch();
  } else {
    logger.trace("Checking in array list for member: " + JSON.stringify(member));
  }
  for (var i=0; i< list.length; i++) {
    if (field) {
      if (list[i][field] == member[field]) {
        return true;
      }
    } else {
      if (list[i] == member) {
        return true;
      }
    }
  }
  return false;
};

getValsFromField = function(objs, field) {
  /******************************************************************
   * Get the val from a specified field from a list of mongo objects
   * @params:
   *    objs - either an array of mongodb documents, or a cursor 
   *        to a list of mongodb documents
   *****************************************************************/
  vals = []
  objs.forEach(function(obj) {
    logger.debug(obj[field]);
    vals.push(obj[field]);
  });
  return vals;
};

getIDs = function(objs) {
  /******************************************************************
   * Get the _id's of a list of mongo objects
   * @params:
   *    objs - either an array of mongodb documents, or a cursor 
   *        to a list of mongodb documents
   *****************************************************************/
  ids = []
  objs.forEach(function(obj) {
    ids.push(obj._id);
  });
  return ids;
};
