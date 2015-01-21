(function(){// Generic Filters for dynamic UI filtering
//    -- currently only supports comparison filters
Filters = new Meteor.Collection("filters");

// Configure logger for Filters
var logger = new Logger('Models:Filter');
// Comment out to use global logging level
Logger.setLevel('Models:Filter', 'trace');
//Logger.setLevel('Models:Filter', 'debug');
// Logger.setLevel('Models:Filter', 'info');
//Logger.setLevel('Models:Filter', 'warn');

Filter = function (name, user, collection, field, val, op) {
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
    this.op = "eq";
  }
};




})();
