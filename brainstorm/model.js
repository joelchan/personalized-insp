// Setup a collection to contain all ideas

//Prompt constructor function
Prompt = function (newQuestion, status, user){
	this.newQuestion = newQuestion;
	this.status = status;
	this.user = user;
}

Prompts = new Meteor.Collection("prompts");
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");
Names = new Meteor.Collection("names");

