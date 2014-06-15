//Setup data structures for support content display
Screens = new Meteor.Collection("screens");

Screen = function(name, desc, url) {
  this.name = name;
  this.desc = desc;
  this.url = url;
}


