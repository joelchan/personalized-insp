// Configure logger for Filters
var logger = new Logger('Model:WeddingInspirations');
// Comment out to use global logging level
 Logger.setLevel('Model:WeddingInspirations', 'trace');
//Logger.setLevel('Model:WeddingInspirations', 'debug');
//Logger.setLevel('Model:WeddingInspirations', 'info');
//Logger.setLevel('Model:WeddingInspirations', 'warn');

WeddingInspirations = new Meteor.Collection("weddingInspirations");

WeddingInspiration = function(previous_id, content, type) {
    this.previous_id = previous_id;
    this.content = content;
    this.type = type;
}

WeddingInspManager = (function() {
  return {
    retrieveInsp: function(filterName, query, queryType, N, reason, different) {
      logger.trace("Retrieving " + N + " new " + queryType + " for " + filterName + " with query: " + query);
      var selector = "#" + filterName + "-question";
      Meteor.call('topN', "GloVe", query, queryType, function(err, res) {
        var data = JSON.parse(res.content);
        // var lastInsps = FilterManager.performQuery(filterName, Session.get("currentUser"), "weddingInspirations");
        var matches = [];
        if (different == "different") {
            // slicedData = data.different.sort(function(a, b){ return a.similarity-b.similarity }).slice(0,N);
            var diffMatches = data.different.sort(function(a, b){ return a.similarity-b.similarity });
            if (diffMatches.length > 0) {
                logger.trace("Matches are: " + JSON.stringify(diffMatches));
                Session.set(filterName, diffMatches);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                var i = 0;
                var sampledWords = [];
                while (matches.length < N) {
                    var insp = diffMatches[i];
                    if (!isInList(insp.text, sampledWords)) {
                        matches.push(insp);
                        sampledWords.push(insp.text);
                        FilterManager.create(filterName, Session.get("currentUser"), 
                          "weddingInspirations", "previous_id", insp.id);
                    }
                    i += 1;
                }
                // var slicedData = diffMatches.slice(0, N);
                // slicedData.forEach(function(insp) {
                //     matches.push(insp);
                //     FilterManager.create(filterName, Session.get("currentUser"), 
                //       "weddingInspirations", "previous_id", insp.id);
                // });
                logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                $(selector).hide();
                // return matchIDs;
            } else {
                logger.trace("No matches found! Showing nothing.");
                Session.set(filterName, []);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                FilterManager.create(filterName, Session.get("currentUser"), 
                  "weddingInspirations", "previous_id", "################");
                EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                $(selector).show();
            }
        } else {
            var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
            if (simMatches.length > 0) {
                logger.trace("Matches are: " + JSON.stringify(simMatches));
                Session.set(filterName, simMatches);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                var i = 0;
                var sampledWords = [];
                while (matches.length < N) {
                    var insp = simMatches[i];
                    if ((insp.similarity < 0.5) && (!isInList(insp.text, sampledWords))) {
                        matches.push(insp);
                        sampledWords.push(insp.text);
                        FilterManager.create(filterName, Session.get("currentUser"), 
                          "weddingInspirations", "previous_id", insp.id);
                    }
                    i += 1;
                }
                // var offSet = 3;
                // var slicedData = simMatches.slice(offSet,offSet+N);
                // slicedData.forEach(function(insp) {
                //     matches.push(insp);
                //     FilterManager.create(filterName, Session.get("currentUser"), 
                //       "weddingInspirations", "previous_id", insp.id);
                // });
                logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                // return matchIDs;
                EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                $(selector).hide();
            } else {
                logger.trace("No matches found! Showing nothing.");
                Session.set(filterName, []);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                FilterManager.create(filterName, Session.get("currentUser"), 
                  "weddingInspirations", "previous_id", "################");
                EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                $(selector).show();
            }
        }
      });
    },
    averageSim: function(matches) {
        simSum = 0.0;
        matches.forEach(function(match) {
            simSum += match.similarity;
        });
        return simSum/matches.length;
    }
  };
}());