Notifications = new Meteor.Collection("notifications"); //collection for messaging from facilitators to ideators

var Types = {
	SEND_EXMAPLES: {val: 0, desc: "Send exmaples to ideators"},
	CHANGE_PROMPT: {val: 0, desc: "Change ideator"},
}

Object.freeze(Types);


Notification = function(sender, recipient){
	this.sender = sender;
	this.recipient = recipient; //imagine both will be some kind of id
	this.time = new Date();
	this.type;
}

/*Directions = new Notification("ideagens", "all");
Directions.content = */

sendExamplesNotify = function(sender, recipient, exmaples){
	notificaiton = new Notification(sender, recipient);
	notificaiton.type = Types.SEND_EXMAPLES;
	notificaiton.exmaples = exmaples;
	Notifications.insert(notificaiton);
}

changePromptNotify = function(sender, recipient, prompt){
	notificaiton = new Notification(sender, recipient);
	notificaiton.type = Types.CHANGE_PROMPT;
	notificaiton.prompt = prompt;
	Notifications.insert(notificaiton);
}