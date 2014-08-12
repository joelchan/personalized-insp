// Configure logger for Tools
var logger = new Logger('Tools:Tools');
// Comment out to use global logging level
Logger.setLevel('Tools:Tools', 'trace');
//Logger.setLevel('Tools:Tools', 'debug');
//Logger.setLevel('Tools:Tools', 'info');
//Logger.setLevel('Tools:Tools', 'warn');

trimFromString = function(target, substring) {
  logger.debug("triming " + substring + " from target: " + target);
  var split = target.split(substring);
  var result = "";
  split.forEach(function(str) {
    result += str;
    logger.debug("after trim got: " + result);
  });
  return result;

}

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


/**
 * Returns a random number between min and max
 */
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max
 */
getRandomInt = function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  if (Meteor.isServer) {
    return MyCollections[name];
  } else {
    return Meteor.connection._mongo_livedata_collections[name];
  }
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

isInList = function(member, list, field, compare) {
  /******************************************************************
   * Check if a given object is in the list
   * @params
   *    member - the object to compare
   *    list - the list that shoudl contain the object
   *    field - (optional) a subfield of the member and list objects
   *        on which to compare
   *    compare - (optional) comparison function to use
   *****************************************************************/
  if (!(list instanceof Array)) {
    logger.trace("Checking in cursor list for member: " + 
        JSON.stringify(member));
    //Not sure why forEach is not working with cursors
    list = list.fetch();
  } else {
    logger.trace("Checking in array list for member: " + 
        JSON.stringify(member));
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

getUserSelection = function(userRadioValue) {
  /******************************************************************
   * Get the user _id's to send facilitator action to
   * @params:
   *    userRadioValue - value from user selection radio button
   *****************************************************************/
   var recipients = []
   if(userRadioValue === "allUsers") {
    selectedRecipients = MyUsers.find({type: "Ideator"}).fetch();
    selectedRecipients.forEach(function(r) {
      recipients.push(r._id);
    });
    return recipients;
   } else {
    return [userRadioValue];
   }
}

binByField = function(objs, field, op) {
  /******************************************************************
   * Sorts the objects into a list of lists using a given comparison
   * operator(equals if unspecified)
   * @Params
   *    objs - an array or cursor of objects to sort
   *    field - the field of each object to sort by
   *    op - a function to compare the field value to existing objects
   *        already indexed (currently ignored
   * @Return
   *    an object with a fields paramter which contains an array of 
   *    field names that the object has storing sorted objects
   *****************************************************************/
  logger.trace("Binning by field: " + field);
  var results = {fields: []};
  objs.forEach(function(obj) {
    logger.trace("Object is: " + JSON.stringify(obj));
    logger.trace("Object has value: " + 
        JSON.stringify(obj[field]));
    logger.trace("results fields is: " + 
        JSON.stringify(results.fields));
    if (isInList(obj[field], results.fields)) {
      logger.trace("Pushing result into list");
      results[obj[field]].push(obj);
    } else {
      logger.trace("Pushing result into list");
      results['fields'].push(obj[field]);
      results[obj[field]] = [obj];
    }
  });
  return results;
};

hasForEach = function(obj) {
  var result = (isInList('forEach', _.functions(obj)) ||
    (obj instanceof Array));
  return result;
};

dates = {
  convert: function(d) {
  // Converts the date in d to a date-object. The input can be:
  //   a date object: returned without modification
  //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
  //   a number     : Interpreted as number of milliseconds
  //                  since 1 Jan 1970 (a timestamp) 
  //   a string     : Any format supported by the javascript engine, like
  //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
  //  an object     : Interpreted as an object with year, month and date
  //                  attributes.  **NOTE** month is 0-11.
  return (
      d.constructor === Date ? d :
      d.constructor === Array ? new Date(d[0],d[1],d[2]) :
      d.constructor === Number ? new Date(d) :
      d.constructor === String ? new Date(d) :
      typeof d === "object" ? new Date(d.year,d.month,d.date) :
      NaN
    );
  },
  compare: function(a,b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(a=this.convert(a).valueOf()) &&
      isFinite(b=this.convert(b).valueOf()) ?
      (a>b)-(a<b) :
      NaN
    );
  },
  inRange:function(d,start,end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(d=this.convert(d).valueOf()) &&
      isFinite(start=this.convert(start).valueOf()) &&
      isFinite(end=this.convert(end).valueOf()) ?
      start <= d && d <= end :
      NaN
    );
  }
};
