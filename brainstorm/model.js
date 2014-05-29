// Setup a collection to contain all ideas

//Prompt constructor function
Prompt = function (question, status, users){
	this.question = question;
	this.status = status;
	this.users = [users];
}

Prompts = new Meteor.Collection("prompts");
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");
Names = new Meteor.Collection("names");

