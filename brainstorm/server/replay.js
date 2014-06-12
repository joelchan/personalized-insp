/********************************************************************
* Code to stream a data set into the ideas database according to
* timestamp
********************************************************************/

Meteor.startup(function() {
  var allIdeas = Ideas.find();
  console.log("total idea count: " + allIdeas.count());


});

function compareEvent(a, b) {
    /****************************************************************
    * Compares 2 objects with a time field
    ****************************************************************/
    if (a.time > b.time) {
      return 1;
    } else if (a.time < b.time) {
      return -1;
    } else {
      return 0;
    }
};

Event = function () {
    //Starttime of an event
    this.starttime;
    //Time event takes place from start time
    this.dtime
}
