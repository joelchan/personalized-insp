Notifications = new Meteor.Collection("notifications"); //collection for messaging from facilitators to ideators

NotificationTypes = {
	DIRECTIONS: {val: -1, title: "Directions"},
	SEND_EXAMPLES: {val: 0, title: "You've been sent examples"},
	CHANGE_PROMPT: {val: 1, title: "You've been sent a message"},
	SEND_THEME: {val: 2, title: "You've been sent a theme"},
	REQUEST_HELP: {val: 3, title: "Please help me out"},
	CHAT_MESSAGE: {val: 4, title: "You've been sent a message"}
}

Object.freeze(NotificationTypes);


Notification = function(sender, recipient){
	/******************************************************************
   * Notification definition with parameters for sending data across 
   * users 
   *
   * @params
   *    sender - userID of user sending notifications
   *    recipient - userID of user receiving notification
   * @fields
   *	time - time of creation
   *	type - a NotifiacationTypes object containing message and value
   *	
   *****************************************************************/
	this.sender = sender;
	this.recipient = recipient; //imagine both will be some kind of id
	this.time = new Date();
	this.type;
	this.handled = false;
}

directions = new Notification('ideagens','all');
directions._id = 'directions';
directions.type = NotificationTypes.DIRECTIONS;

//priming = new Notification('ideagens','all');
//priming._id = 'priming';
//priming.type = NotificationTypes.PRIMING;

sendExamplesNotify = function(sender, recipient, examples){
	var notification = new Notification(sender, recipient);
	notification.type = NotificationTypes.SEND_EXAMPLES;
	notification.examples = examples;
	Notifications.insert(notification);
	EventLogger.logSendExamples(notification);
	checkIfHelped(recipient);
}

changePromptNotify = function(sender, recipient, prompt){
	var notification = new Notification(sender, recipient);
	notification.type = NotificationTypes.CHANGE_PROMPT;
	notification.prompt = prompt;
	Notifications.insert(notification);
	EventLogger.logChangePrompt(notification);
	checkIfHelped(recipient);
}

sendThemeNotify = function(sender, recipient, clusterID){
	var notification = new Notification(sender, recipient);
	notification.type = NotificationTypes.SEND_THEME;
	notification.theme = clusterID;
	Notifications.insert(notification);
	EventLogger.logSendTheme(notification);
	checkIfHelped(recipient);
}

requestHelpNotify = function(sender, recipient){
	var notification = new Notification(sender, recipient);
	notification.type = NotificationTypes.REQUEST_HELP;
	notification.message = "Help Requested";
	Notifications.insert(notification);
	EventLogger.logRequestHelp(notification);
}

chatNotify = function(sender, recipient, message){
	var notification = new Notification(sender, recipient);
	notification.message = message;
	notification.type = NotificationTypes.CHAT_MESSAGE;
	Notifications.insert(notification);
}

checkIfHelped = function(recipient){
	var needHelp = Notifications.find({sender: recipient, handled: false});
	needHelp.forEach(function(note){
		Notifications.update({_id: note._id},
			{$set: {handled: true}
		});
	});
}

