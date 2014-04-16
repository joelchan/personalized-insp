Template.JoinIdeasPage.ideas = function () {
    return Ideas.find();
};

Template.JoinIdeasPage.rendered = function() {
    $(".draggable").draggable();
    $(".droppable").droppable();
};

Template.JoinIdeasPage.events({
    'click button.nextPage': function () {
        Session.set("currentState", "LoginPage");
    },
});
