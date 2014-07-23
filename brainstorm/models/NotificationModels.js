Notifications = new Meteor.Collection("notifications"); //collection for messaging from facilitators to ideators

var Types = {
	DIRECTIONS: {val: -1, title: "Directions"},
	SEND_EXAMPLES: {val: 0, title: "You've been sent examples"},
	CHANGE_PROMPT: {val: 1, title: "Your prompt has been changed"},
	SEND_THEME: {val: 2, title: "You've been sent a theme"},
	REQUEST_HELP: {val: 3, title: "Please help me out"},
	CHAT_MESSAGE: {val: 4, title: "You've been sent a message"}
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
	var notification = new Notification(sender, recipient);
	notification.type = Types.SEND_EXAMPLES;
	notification.examples = examples;
	Notifications.insert(notification);
	Logger.logSendExamples(notification);
}

changePromptNotify = function(sender, recipient, prompt){
	var notification = new Notification(sender, recipient);
	notification.type = Types.CHANGE_PROMPT;
	notification.prompt = prompt;
	Notifications.insert(notification);
	Logger.logChangePrompt(notification);
}

sendThemeNotify = function(sender, recipient, clusterID){
	var notification = new Notification(sender, recipient);
	notification.type = Types.SEND_THEME;
	notification.theme = clusterID;
	Notifications.insert(notification);
	Logger.logSendTheme(notification);
}

requestHelpNotify = function(sender, recipient){
	var notification = new Notification(sender, recipient);
	notification.type = Types.REQUEST_HELP;
	Notifications.insert(notification);
	Logger.logRequestHelp(notification);
}

chatNotify = function(sender, recipient, message){
	var notification = new Notification(sender, recipient);
	notification.message = message;
	notification.type = Types.CHAT_MESSAGE;
	Notifications.insert(notification);
}


