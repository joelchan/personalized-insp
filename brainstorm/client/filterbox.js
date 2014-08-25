var filterBoxIdeaFilter = "Ideas Filter"; 

Template.filterbox.rendered = function(){
	//Create isInCluster filter
	// console.log("rendering");
	FilterManager.create(filterBoxIdeaFilter,
	    Session.get("currentUser"),
	    "ideas",
	    "clusterIDs",
	    []
	);
	Session.set("currentIdeators", []);
	console.log("Current ideators: ");
	Session.get("currentIdeators").forEach(function(i) {
		console.log(i._id);
	});
	Session.set("currentSynthesizers", []);
	Session.set("groupIdeasFilter",[])
	//Setup filters for users and filter update listener
	updateFilterBoxFilters();

	//Update filters every 5 seconds
	Meteor.setInterval(updateFilterBoxFilters, 5000);
}
var filterName;
Template.filterbox.helpers({
	setFilterName : function(name){
		filterName = name + "IdeasFilter";
		console.log(filterName);
		//doesn't work
	},
	participants : function(){
		// return MyUsers.find({type: "Experiment Participant"});
		return MyUsers.find({type: "Ideator"});
		// return MyUsers.find({_id: 
		// 	{$in: getIDs(Session.get("currentIdeators"))}
		// });
	},
	ideas : function(){
		// return Ideas.find();
		// var cursor = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas");
		var filteredIdeas = FilterManager.performQuery(filterBoxIdeaFilter, 
		  Session.get("currentUser"), 
		  "ideas").fetch();
		// return filteredIdeas;
		// var filteredIdeas = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas").fetch();
		// sort the array
		var sortedIdeas = filteredIdeas.sort(function(a,b) { return b.time - a.time});
		// return the sorted array
		// console.log("FilterBoxHelper says there are " + filteredIdeas.count() + " ideas");
		return sortedIdeas;
		// return cursor;
	},
	currentClusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	},
});

Template.FilterBoxIdeaItem.helpers({
	gameChangerStatus: function() {
		return this.isGamechanger;
	}
});

Template.activefilters.helpers({
	getMappedFilters : function(){
		var mappedFilts = FilterManager.createMappedFilterList("Ideas Filter", Session.get("currentUser"), "ideas", "mappedFilters");
		mappedFilts = $.map(mappedFilts, function(val, key){
			var obj = {};
			obj[key] = val;
			return obj;
		});
		//console.log(mappedFilts);
		return mappedFilts;
	},

	isFilter: function(){
		return (FilterManager.getFilterList("Ideas Filter", Session.get("currentUser"), "ideas").count() > 0);
	},

	users : function(){
		return this.users;
	},

	clusters: function(){
		return this.clusters;
	},

	inClusterFilter : function(){
		return this.hasOwnProperty('inCluster');
	},

	inCluster : function(){
		return $.parseJSON(this.inCluster);
	},

	time : function(){
		return this.time;
	},

	begin : function(){
		return moment(this.time.begin).fromNow();
	},
	end : function(){
		return moment(this.time.end).fromNow();
	}
});

Template.filterbox.events({

	'click .filter-drop-button' :function(){
		$('.filter-dropdown').each(function(i){
			$(this).slideUp()
		});

		console.log($(event.target));
		var $menu;
		if($(event.target).hasClass('parts-filters')){
			$menu = $('.select-parts-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		} else if($(event.target).hasClass('themed-filters')){
			$menu = $('.select-themed-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		} else if($(event.target).hasClass('memberOf-filters')){
			$menu = $('.select-memberOf-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		}  else if($(event.target).hasClass('time-filters')){
			$menu = $('.select-time-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		}
	},

	'click .filter-dropdown > div.apply-filter > button' : function(){
		$(event.target).parents('.filter-dropdown').slideUp();
	},

	'click .select-parts-filters > div.apply-filter > button.apply' :function(){
		var options = $('.select-parts-filters').find('.select-participants option:selected');
		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "userID", id);
		    return id;
		});

		console.log(ids);

	},

	'click .select-themed-filters > div.apply-filter > button.apply' :function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");

		var selected = $(".filter-list input[type='radio']:checked");
			if (selected.length > 0) {
			    selectedVal = $.parseJSON(selected.val());
			}

		if (selectedVal !== "neither") {
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster", selectedVal);
		};
	},

	'click .select-memberOf-filters > div.apply-filter > button.apply' : function(){
		var options = $('.select-themes option:selected');
		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "clusters", id);
		    return id;
		});
	},

	'click .select-time-filters > div.apply-filter > button.apply' :function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", 'time');

		var $menu = $(event.target).parents('.select-time-filters');

		var startDur= parseInt($menu.find("select.select-start option:selected").text());
		var endDur= parseInt($menu.find("select.select-end option:selected").text());
		console.log("startDur: " + startDur);
		console.log("endDur: " + endDur);
		// var start = moment(Date.now()).subtract('minutes', startDur)._d;
		// var end = moment(Date.now()).subtract('minutes', endDur)._d;
		var start = moment(Date.now()).subtract('minutes', startDur).valueOf();
		var end = moment(Date.now()).subtract('minutes', endDur).valueOf();
		console.log("start: " + start);
		console.log("end: " + end);
		// console.log(start.unix());
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', start, 'lt');
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', end, 'gt');
	},


	'click .gamechange-filter' : function(){
		var $icon = $('.gamechange-filter').children('i');
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "isGamechanger");		

		if($icon.hasClass('fa-star-o')){
			$icon.switchClass('fa-star-o', 'fa-star');
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "isGamechanger", true);
		} else if($icon.hasClass('fa-star')){
			$icon.switchClass('fa-star', 'fa-star-o');
		}
	},
});

Template.activefilters.events({
	'click .reset-filters' : function(){
		//console.log("resetting filters");
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas", Session.get("groupIdeasFilter"));
	},

	'click .cancel-user': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "userID", this._id);
	},

	'click .cancel-cluster': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "clusters", this._id);
	},

	'click .cancel-themed': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");
	},

	'click .cancel-time': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "time");
	},
});

updateFilterBoxFilters = function() {
  /***************************************************************
    * Check group ideators and update user filters
    **************************************************************/
  var group = Groups.findOne({_id: Session.get("currentGroup")._id});
  // logger.trace("Updating filters for group: " + group);
  var ideators = GroupManager.getUsersInRole(group, 'Ideator');
  // logger.trace("current group has ideators: " + 
  //     JSON.stringify(ideators));
  var prev = Session.get("currentIdeators");
  var prevGroupIdeaFilters = Session.get("groupIdeasFilter");
  // logger.trace("current ideators stored in session are: " + 
  //     JSON.stringify(prev));
  var newUsers = [];
  var update = false;
  ideators.forEach(function(user) {
    if (!isInList(user, prev, '_id')) {
      // logger.trace("Found new ideator: " + 
      //   JSON.stringify(user));
      newUsers.push(user);
      update = true;
    }
  });
  var prevCluster = Session.get("currentSynthesizers");
  // logger.trace("current synthesizers stored in session are: " + 
  //     JSON.stringify(prevCluster));
  var newClusterers = [];
  var clusterers = GroupManager.getUsersInRole(group, 'Synthesizer'); 
  clusterers.forEach(function(user) {
    if (!isInList(user, prevCluster, '_id')) {
      // logger.trace("Found new clusterer: " + 
      //   JSON.stringify(user));
      newClusterers.push(user);
      update = true;
    }
  });

  if (update) {
    // logger.trace("Updating session variable and filter");
    //Create filter for user
    newUsers.forEach(function(user) {
      // logger.debug("Creating new filter for ideator user: " + user.name);
      var newFilter = FilterManager.create(filterBoxIdeaFilter,
          Session.get("currentUser"),
          "ideas",
          "userID",
          user._id
      );
      prev.push(user);
      prevGroupIdeaFilters.push(newFilter);
    });
    newClusterers.forEach(function(user) {
      // logger.debug("Creating new filter for cluster user: " + user.name);
      var newFilter = FilterManager.create(clusterFilterName,
          Session.get("currentUser"),
          "clusters",
          "userID",
          user._id
      );
      prevCluster.push(user);
    });
    // logger.debug("Setting list of ideators: " + 
    //     JSON.stringify(prev));
    Session.set("currentIdeators", prev);
    Session.set("groupIdeasFilter",prevGroupIdeaFilters);
    // logger.debug("Setting list of synthesizers: " + 
    //     JSON.stringify(prevCluster));
    Session.set("currentSynthesizers", prevCluster);
 }
};
