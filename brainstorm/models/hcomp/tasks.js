// Configure logger for Tools
var logger = new Logger('Models:Tasks');
// Comment out to use global logging level
Logger.setLevel('Models:Tasks', 'trace');
//Logger.setLevel('Models:Tasks, 'debug');
//Logger.setLevel('Models:Tasks', 'info');
//Logger.setLevel('Models:Tasks', 'warn');

Tasks = new Meteor.Collection("tasks");

Task = function (user, prompt, group, desc, type, priority, num) {
  /*****************************************************************
   * Constructor for Ideation Tasks
   * **************************************************************/
  //Author & prompt info
  this.promptID = prompt._id;
  this.authorID = user._id;
  this.groupID = group._id;
  //Written directions of the task
  this.desc = desc;
  //Set type and type specific fields
  this.type = type;
  //switch(type) {
    //case "time":
      //break;
    //case "quantity":
      //break;
    //default:
      //break;
  //}
  //Set the priority of the task
  this.priority = priority;
  //Graph container of the Task. Allows for Task = theme
  this.ideaNode;
  //Q&A to clarify the task 
  this.comments = [];
  //Creation time of the task
  this.time = new Date().getTime();
  //List of users assigned to this task
  this.assignments = [];
  //Number of people who may accept this task
  this.num = num;
  //List of Ideas for inspiration
  this.attachments = [];

};
