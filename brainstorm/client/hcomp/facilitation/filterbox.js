Template.HcompFilterbox.rendered = function(){
	//Create isInCluster filter
	// console.log("rendering");
	Session.set("searchQuery","");

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
		// return MyUsers.find({type: "Experiment Participant"});
		return MyUsers.find({type: "Ideator"});
		// return MyUsers.find({_id: 
		// 	{$in: getIDs(Session.get("currentIdeators"))}
		// });
	},
	ideas : function(){
		
		filteredIdeas = getFilteredIdeas();
		// console.log("Filtered ideas: ");
		// console.log(filteredIdeas);
		return filteredIdeas;
		// var filteredIdeas = FilterManager.performQuery("Ideas Filter", 
		//   Session.get("currentUser"), 	
		//   "ideas").fetch();

		// // apply search query, if it exists
		// var query = Session.get("searchQuery");
		// var queriedIdeas = [];
		// if (query != "") {
		// 	queryArr = stringToWords(query);
		// 	filteredIdeas.forEach(function(idea){
		// 		// console.log(idea);
		// 		if (searchQueryMatch(idea,queryArr)) {
		// 			// console.log("Matched query");
		// 			queriedIdeas.push(idea);
		// 		} else {
		// 			// console.log("Not matching");
		// 			// filteredIdeas.splice(filteredIdeas.indexOf(idea),1);
		// 		}
		// 	});
		// 	// create an array from the query
			
		// } else {
		// 	queriedIdeas = filteredIdeas.slice();
		// }

		// var sortedIdeas = queriedIdeas.sort(function(a,b) { return b.time - a.time});
		// // console.log(sortedIdeas);
		// return sortedIdeas;
		// return cursor;
	},
	currentClusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	},

	numIdeas : function() {
		// var filteredIdeas = FilterManager.performQuery("Ideas Filter", 
		//   Session.get("currentUser"), 	
		//   "ideas").fetch();

		// // apply search query, if it exists
		// var query = Session.get("searchQuery");
		// var queriedIdeas = [];
		// if (query != "") {
		// 	queryArr = stringToWords(query);
		// 	filteredIdeas.forEach(function(idea){
		// 		// console.log(idea);
		// 		if (searchQueryMatch(idea,queryArr)) {
		// 			// console.log("Matched query");
		// 			queriedIdeas.push(idea);
		// 		} else {
		// 			// console.log("Not matching");
		// 			// filteredIdeas.splice(filteredIdeas.indexOf(idea),1);
		// 		}
		// 	});
		// 	// create an array from the query
			
		// } else {
		// 	queriedIdeas = filteredIdeas.slice();
		// }

		// var sortedIdeas = queriedIdeas.sort(function(a,b) { return b.time - a.time});
		// // console.log(sortedIdeas);
		// return sortedIdeas.length;
		return getFilteredIdeas().length;
	}
});

Template.HcompFilterBoxIdeaItem.helpers({
	gameChangerStatus: function() {
		return this.isGamechanger;
	}
});

Template.HcompActivefilters.helpers({
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
		// console.log(this);
		// console.log("Active filters for clusters: " + this.clusterIDs);
		// return this._id;
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

Template.HcompFilterbox.events({

	'click .cat-filter-opts-btn' : function(){
		// var options = $(event.currentTarget).find('option:selected');
		// console.log(options);
		option = $(event.currentTarget).val();
		console.log(option);
		// if ($(event.target).parent().hasClass('open')) {
		// 	console.log("closed");
		// 	var catOpt = $(event.target).children('[data-bind="label"]');
		// 	console.log(catOpt.innerHTML);
		// } else {
		// 	console.log("open");
		// }
	},

	'click .star-filter-opt-btn' : function(){
		// if (!$(event.target).parent().hasClass('open')) {
		// 	var starOpt = $(event.currentTarget).children('[data-bind="label"]').text();
		// 	console.log(starOpt);	
		// }
	},

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
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "clusterIDs", id);
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

	// 'mouseover .idea-item' : function(){
	// 	var id = $(event.target).attr("id");
	// 	// id = id.split("-")[1];
	// 	var thisIdea = Ideas.findOne({_id: id});
	// 	var thisIdeaAuthor = thisIdea.userName;
	// 	if (thisIdea.clusterIDs.length > 0) {
	// 		var thisIdeaTheme = Clusters.findOne({_id: thisIdea.clusterIDs[0]}).name;	
	// 	} else {
	// 		var thisIdeaTheme = "Not in a theme";
	// 	}
		
	// 	$('<span class="idea-tip"></span>')
	// 		.appendTo('body')
	// 		.css('top', (event.pageY- 10) + 'px')
	// 		.css('left', (event.pageX + 20) + 'px')
	// 		.fadeIn('slow');
	// 	$('<span></span>').text("Author: " + thisIdeaAuthor)
	// 		.appendTo('.idea-tip');
	// 	$('<br>')
	// 		.appendTo('.idea-tip');
	// 	$('<span></span>').text("Theme: " + thisIdeaTheme)
	// 		.appendTo('.idea-tip');
	// },

	// 'mouseout .idea-item' : function(){
	// 	$('.idea-tip').remove();
	// },

	// 'mousemove .idea-item' : function(){
	// 	$('.idea-tip')
	// 	.css('top', (event.pageY - 10) + 'px')
	// 	.css('left', (event.pageX + 20) + 'px');
	// },
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
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas");
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "prompt._id", Session.get("currentPrompt")._id);
		$('.misc-ideas-filter-btn').removeClass('btn-success');
		$('.starred-ideas-filter-btn').removeClass('btn-success');
		$('.all-ideas-filter-btn').addClass('btn-success');

		Session.set("searchQuery","");
		$('.search-apply-btn').removeClass('btn-success');
		$('#search-query').val("");
	},

	'click .misc-ideas-filter-btn' : function() {
		
		FilterManager.toggle("Ideas Filter", Session.get("currentUser"), "ideas", "clusterIDs", [], 'ne');
		
		$('.misc-ideas-filter-btn').toggleClass('btn-success');
		$('.all-ideas-filter-btn').removeClass('btn-success');

		// un-highlight the "everything" button if it's the last filter
		if (isLastFilter()) {
			console.log("Last filter");
			$('.all-ideas-filter-btn').addClass('btn-success');
		}
		
	},

	'click .starred-ideas-filter-btn' : function() {
		FilterManager.toggle("Ideas Filter", Session.get("currentUser"), "ideas", "isGamechanger", true);
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

Template.HcompActivefilters.events({
	'click .reset-filters' : function(){
		//console.log("resetting filters");
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas", Session.get("groupIdeasFilter"));
	},

	'click .cancel-user': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "userID", this._id);
	},

	'click .cancel-cluster': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "clusterIDs", this._id);
	},

	'click .cancel-themed': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");
	},

	'click .cancel-time': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "time");
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
	// words = stringToWords(idea.content);
	// words.forEach(function(word) {

	// });
	// console.log(match);
	return match;
}

stringToWords = function stringToWords(str) {
	arr = str.split(" ");
	arr.forEach(function(q) {
		q = q.trim();
	});
	return arr;
}

getFilteredIdeas = function getFilteredIdeas() {
	var filteredIdeas = FilterManager.performQuery("Ideas Filter", 
		  Session.get("currentUser"), 	
		  "ideas").fetch();

	// apply search query, if it exists
	var query = Session.get("searchQuery");
	var queriedIdeas = [];
	if (query != "") {
		queryArr = stringToWords(query);
		filteredIdeas.forEach(function(idea){
			// console.log(idea);
			if (searchQueryMatch(idea,queryArr)) {
				// console.log("Matched query");
				queriedIdeas.push(idea);
			} else {
				// console.log("Not matching");
				// filteredIdeas.splice(filteredIdeas.indexOf(idea),1);
			}
		});
		// create an array from the query
		
	} else {
		queriedIdeas = filteredIdeas.slice();
	}

	var sortedIdeas = queriedIdeas.sort(function(a,b) { return b.time - a.time});
	// console.log(sortedIdeas);
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