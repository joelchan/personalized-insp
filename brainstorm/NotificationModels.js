Notifications = new Meteor.Collection("notifications"); //collection for messaging from facilitators to ideators

var Types = {
	DIRECTIONS: {val: -1, title: "Directions"},
	SEND_EXMAPLES: {val: 0, title: "You've been sent examples"},
	CHANGE_PROMPT: {val: 1, title: "You're prompt has been changed"},
}

Object.freeze(Types);


Notification = function(sender, recipient){
	this.sender = sender;
	this.recipient = recipient; //imagine both will be some kind of id
	this.time = new Date();
	this.type;
	this.handled = false;
}

directions = new Notification('ideagens','all');
directions._id = 'directions';
directions.type = Types.DIRECTIONS;

sendExamplesNotify = function(sender, recipient, examples){
	notificaiton = new Notification(sender, recipient);
	notificaiton.type = Types.SEND_EXMAPLES;
	notificaiton.examples = examples;
	Notifications.insert(notificaiton);
}

changePromptNotify = function(sender, recipient, prompt){
	notificaiton = new Notification(sender, recipient);
	notificaiton.type = Types.CHANGE_PROMPT;
	notificaiton.prompt = prompt;
	Notifications.insert(notificaiton);
}