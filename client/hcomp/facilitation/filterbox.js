// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Filterbox');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Filterbox', 'trace');
// Logger.setLevel('Client:Hcomp:Filterbox', 'debug');
//Logger.setLevel('Client:Hcomp:Filterbox', 'info');
//Logger.setLevel('Client:Hcomp:Filterbox', 'warn');


Template.HcompFilterbox.rendered = function(){
	//Create isInCluster filter
	// console.log("rendering");
	Session.set("searchQuery","");
	// FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas");
	// logger.trace("Creating default ideas filter upon render");
	// createDefaultIdeasFilter("Ideas Filter");

	// FilterManager.reset("IdeaWordCloud Filter", Session.get("currentUser"), "ideas");
 //    logger.trace("Creating default filter for ideawordcloud filter");
 //    createDefaultIdeasFilter("IdeaWordCloud Filter");
	// Ideas.ensureIndex({ content: "text" }); // to enable text search
}

Template.HcompFilterBoxHeader.rendered = function(){
	$('.all-ideas-filter-btn').click();
}

var filterName;
Template.HcompFilterbox.helpers({
	setFilterName : function(name){
		filterName = name + "IdeasFilter";
		console.log(filterName);
		//doesn't work
	},
	participants : function(){
		return MyUsers.find({type: "Ideator"});
	},
	ideas : function(){
		filteredIdeas = getFilteredIdeas("Ideas Filter");
		return filteredIdeas;
	},
	currentClusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	},

	numIdeas : function() {
		return getFilteredIdeas("Ideas Filter").length;
	}
});

Template.HcompFilterBoxIdeaItem.rendered = function() {
  $(this.firstNode).draggable({containment: '.hcomp-dashboard',
    revert: true,
    zIndex: 50,
    helper: 'clone',
    appendTo: ".hcomp-dashboard",
    refreshPositions: true,
    start: function(e, ui) {
      logger.debug("Began dragging an idea");
      logger.trace(ui.helper[0]);
      var width = $(this).css('width');
      logger.trace(width);
      $(ui.helper[0]).css('width', width);
    },
  });

};
Template.HcompFilterBoxIdeaItem.helpers({
	gameChangerStatus: function() {
		return this.isGamechanger;
	},
  hasNotVoted: function() {
    if (isInList(Session.get("currentUser")._id, this.votes)) {
      logger.debug("User has already voted");
      return false;
    } else {
      logger.debug("User has not voted");
      return true;
    }
  },
  voteNum: function() {
    return this.votes.length;
  },
  hasVotes: function() {
  	if (this.votes.length > 0) {
  		return true
  	} else {
  		return false
  	}
  },
});

Template.HcompFilterBoxIdeaItem.events({
  'click .up-vote': function(e, elm) {
    if (!isInList(Session.get("currentUser")._id, this.votes)) {
      logger.debug("voting for idea");
      IdeaFactory.upVote(this, Session.get("currentUser"));
    } else {
      logger.debug("undo voting for idea");
      IdeaFactory.downVote(this, Session.get("currentUser"));
    }
  },

});

Template.HcompFilterBoxHeader.events({
	// apply new full-text search of idea content
	'click .search-apply-btn' : function(){
		var query = $('#search-query').val(); // grab query from text form
		Session.set("searchQuery",query);
		$('.search-apply-btn').toggleClass('btn-success');
		console.log("Created new query: " + Session.get("searchQuery"));

		if ($('.all-ideas-filter-btn').hasClass('btn-success')) {
			$('.all-ideas-filter-btn').removeClass('btn-success');	
		}
	},

	'keyup input' : function(e, target){
	    // logger.debug(e);
	    // logger.debug(target);
	    console.log("key pressed")
	    if(e.keyCode===13) {
	      console.log("enter pressed")
	      var btn = $('.search-apply-btn')
	      btn.click();
	    }
  	},

	// clear full-text search of idea content
	'click .search-remove-btn' : function(){
		Session.set("searchQuery","");
		$('.search-apply-btn').toggleClass('btn-success');
		$('#search-query').val("");

		// re-highlight the "everything" button if we're removing the last filter
		if (isLastFilter()) {
			console.log("Last filter");
			$('.all-ideas-filter-btn').addClass('btn-success');
		}
	},

	'click .all-ideas-filter-btn' : function() {
		// clear all filters
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas");
		
		// reinstate default filters
		createDefaultIdeasFilter("Ideas Filter");

		$('.misc-ideas-filter-btn').removeClass('btn-success');
		$('.starred-ideas-filter-btn').removeClass('btn-success');
		$('.all-ideas-filter-btn').addClass('btn-success');

		Session.set("searchQuery","");
		$('.search-apply-btn').removeClass('btn-success');
		$('#search-query').val("");
	},

	'click .misc-ideas-filter-btn' : function() {
		
		FilterManager.toggle("Ideas Filter", Session.get("currentUser"), "ideas", "clusterIDs", []);
		
		$('.misc-ideas-filter-btn').toggleClass('btn-success');
		$('.all-ideas-filter-btn').removeClass('btn-success');

		// un-highlight the "everything" button if it's the last filter
		if (isLastFilter()) {
			console.log("Last filter");
			$('.all-ideas-filter-btn').addClass('btn-success');
		}
		
	},

	'click .starred-ideas-filter-btn' : function() {
		// console.log("*******************Toggling votes filter*******************");
		FilterManager.toggle("Ideas Filter", Session.get("currentUser"), "ideas", "votes", [], 'ne');
		$('.starred-ideas-filter-btn').toggleClass('btn-success');
		
		// un-highlight the "everything" button
		if ($('.all-ideas-filter-btn').hasClass('btn-success')) {
			$('.all-ideas-filter-btn').removeClass('btn-success');	
		}

		// re-highlight the "everything" button if we're removing the last filter
		if (isLastFilter()) {
			console.log("Last filter");
			$('.all-ideas-filter-btn').addClass('btn-success');
		}
	},
});

searchQueryMatch = function searchQueryMatch(idea,queryArr) {
	// console.log("calling searchQueryMatch");
	var match = false;
	var ideaContent = idea.content;
	// queryArr.forEach(function(query){
	for (var i = 0; i < queryArr.length; i++) {
		// console.log("processing query array");
		re = new RegExp(queryArr[i],'i')
		// console.log(re);
		if (re.test(ideaContent)){
			match = true;
			break;
		}
	}
	return match;
}

stringToWords = function stringToWords(str) {
  if (str) {
	arr = str.split(" ");
	arr.forEach(function(q) {
		q = q.trim();
	});
	return arr;
  } else {
    return [];
  };
}

createDefaultIdeasFilter = function createDefaultIdeasFilter(ideasFilterName) {
	FilterManager.create(ideasFilterName, Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
	// add different default filter if we are on an experiment dashboard
	var exp = Session.get("currentExp");
	if (exp) {
		// get treatment participant userIDs
		logger.trace("On exp dashboard, filtering for treatment participants only");
		treatmentIDs = ExperimentManager.getUsersInCond(exp, "Treatment");
		logger.trace("Found userIDs for the treatment condition: " + JSON.stringify(treatmentIDs));
		// create filter based on those IDs
		treatmentIDs.forEach(function(tID) {
			FilterManager.create(ideasFilterName, Session.get("currentUser"), "ideas", "userID", tID);
		});
	}
}

getFilteredIdeas = function getFilteredIdeas(ideasFilterName) {
	logger.trace("Getting filtered ideas");
	var filteredIdeas = FilterManager.performQuery(ideasFilterName, 
		  Session.get("currentUser"), 	
		  "ideas").fetch();
	// logger.trace("Unsorted ideas: " + JSON.stringify(filteredIdeas));

	// apply search query, if it exists
	var query = Session.get("searchQuery");
	var queriedIdeas = [];
	if (query != "") {
		queryArr = stringToWords(query);
		filteredIdeas.forEach(function(idea){
			if (searchQueryMatch(idea,queryArr)) {
				queriedIdeas.push(idea);
			} else {
			}
		});
		
	} else {
		queriedIdeas = filteredIdeas.slice();
	}

	var sortedIdeas = queriedIdeas.sort(function(a,b) { return b.time - a.time});
	return sortedIdeas;
}

isLastFilter = function() {
	existingCatFilters = Filters.find({$and: [{name: "Ideas Filter"},
											  {user: Session.get("currentUser")}, 
											  {collection: "ideas"},
											  {field: {$ne: "prompt._id"}}] 
											}).fetch();
	return existingCatFilters.length === 0;
}
