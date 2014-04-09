Template.loginPage.names = function () {
    return Names.find();
};

Template.loginPage.events({
	'keyup input#name': function (evt) {
        newName = $('input#name').val().trim();
        $(document).ready(function(){
            $('#name').keypress(function(e){
              if(e.keyCode==13)
              $('#submitName').click();
            });
        });
    },

    'click button.submitIdea': function () {
            Names.insert({name: newName});
            newName = null;
            document.getElementById('Name').value = ""
    },
    'click button.nextPage': function () {
        //Not working state machine yet
        Session.set("currentState", "Page1");
    },
});