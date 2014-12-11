(function(){Template.SRScreen.helpers({
  formUrl: function() {
    return Meteor.absoluteUrl() + this.url;
  }
});

Template.ScreensReviewPage.helpers({
  screens: function() {
    return Screens.find();
  }
});


})();
