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
    retrieveInsp: function(filterName, query, queryType, N, reason, different, partner) {
      FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
      FilterManager.create(filterName, Session.get("currentUser"), 
        "weddingInspirations", "previous_id", "################");
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
                logger.trace("Initial set of matches are: " + JSON.stringify(diffMatches));
                Session.set(filterName, diffMatches);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                // sample one
                var sample = diffMatches[0];
                matches.push(sample)
                logger.trace("Retrieved and creating filter for " + JSON.stringify(sample));
                FilterManager.create(filterName, Session.get("currentUser"), 
                          "weddingInspirations", "previous_id", sample.id);
                // get the remaining ones nearby
                Meteor.call('topN', "GloVe", sample.text, queryType, function(err, res) {
                    logger.trace("Retrieving the ones nearby");
                    var data = JSON.parse(res.content);
                    var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
                    var i = 0
                    var sampledIDs = [sample.id]
                    while (matches.length < N) {
                        var insp = simMatches[i];
                        if (!isInList(insp.id, sampledIDs)) {
                            matches.push(insp);
                            sampledIDs.push(insp.id);
                            FilterManager.create(filterName, Session.get("currentUser"), 
                              "weddingInspirations", "previous_id", insp.id);
                        }
                        i += 1;
                    }
                    logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                    EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                    $(selector).hide();
                });
                
                // var i = 0;
                // var sampledWords = [];
                // while (matches.length < N) {
                //     var insp = diffMatches[i];
                //     if (!isInList(insp.text, sampledWords)) {
                //         matches.push(insp);
                //         sampledWords.push(insp.text);
                //         FilterManager.create(filterName, Session.get("currentUser"), 
                //           "weddingInspirations", "previous_id", insp.id);
                //     }
                //     i += 1;
                // }
                // var slicedData = diffMatches.slice(0, N);
                // slicedData.forEach(function(insp) {
                //     matches.push(insp);
                //     FilterManager.create(filterName, Session.get("currentUser"), 
                //       "weddingInspirations", "previous_id", insp.id);
                // });
                // return matchIDs;
            } else {
                logger.trace("No results: trying to retrieve from partner...")
                Meteor.call('topN', "GloVe", partner, queryType, function(err, res) {
                    var data = JSON.parse(res.content);
                    var diffMatches = data.different.sort(function(a, b){ return a.similarity-b.similarity });
                    if (diffMatches.length > 0) {
                        logger.trace("Matches are: " + JSON.stringify(diffMatches));
                        Session.set(filterName, diffMatches);
                        FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                        var sample = diffMatches[0];
                        matches.push(sample)
                        logger.trace("Retrieved and creating filter for " + JSON.stringify(sample));
                        FilterManager.create(filterName, Session.get("currentUser"), 
                                  "weddingInspirations", "previous_id", sample.id);
                        // get the remaining ones nearby
                        Meteor.call('topN', "GloVe", sample.text, queryType, function(err, res) {
                            logger.trace("Retrieving the ones nearby");
                            var data = JSON.parse(res.content);
                            var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
                            var i = 0
                            var sampledIDs = [sample.id]
                            while (matches.length < N) {
                                var insp = simMatches[i];
                                if (!isInList(insp.id, sampledIDs)) {
                                    matches.push(insp);
                                    sampledIDs.push(insp.id);
                                    FilterManager.create(filterName, Session.get("currentUser"), 
                                      "weddingInspirations", "previous_id", insp.id);
                                }
                                i += 1;
                            }
                            logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                            EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                            $(selector).hide();
                        });
                    } else {
                        logger.trace("No matches found! Showing nothing.");
                        Session.set(filterName, []);
                        FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                        FilterManager.create(filterName, Session.get("currentUser"), 
                          "weddingInspirations", "previous_id", "################");
                        EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                        $(selector).show();
                   }
                });
            }
        // similar
        } else {
            var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
            if (simMatches.length > 0) {
                logger.trace("Matches are: " + JSON.stringify(simMatches));
                Session.set(filterName, simMatches);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                var sample = simMatches[0];
                matches.push(sample)
                logger.trace("Retrieved and creating filter for " + JSON.stringify(sample));
                FilterManager.create(filterName, Session.get("currentUser"), 
                          "weddingInspirations", "previous_id", sample.id);
                // get the remaining ones nearby
                Meteor.call('topN', "GloVe", sample.text, queryType, function(err, res) {
                    logger.trace("Retrieving the ones nearby");
                    var data = JSON.parse(res.content);
                    var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
                    var i = 0
                    var sampledIDs = [sample.id]
                    while (matches.length < N) {
                        var insp = simMatches[i];
                        if (!isInList(insp.id, sampledIDs)) {
                            matches.push(insp);
                            sampledIDs.push(insp.id);
                            FilterManager.create(filterName, Session.get("currentUser"), 
                              "weddingInspirations", "previous_id", insp.id);
                        }
                        i += 1;
                    }
                    logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                    EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                    $(selector).hide();
                });
                // var offSet = 3;
                // var slicedData = simMatches.slice(offSet,offSet+N);
                // slicedData.forEach(function(insp) {
                //     matches.push(insp);
                //     FilterManager.create(filterName, Session.get("currentUser"), 
                //       "weddingInspirations", "previous_id", insp.id);
                // });
                // logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                // // return matchIDs;
                // EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                // $(selector).hide();
            } else {
                logger.trace("No results: trying to retrieve from partner...")
                Meteor.call('topN', "GloVe", partner, queryType, function(err, res) {
                    var data = JSON.parse(res.content);
                    var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
                    if (simMatches.length > 0) {
                        logger.trace("Matches are: " + JSON.stringify(simMatches));
                        Session.set(filterName, simMatches);
                        FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                        var sample = simMatches[0];
                        matches.push(sample)
                        logger.trace("Retrieved and creating filter for " + JSON.stringify(sample));
                        FilterManager.create(filterName, Session.get("currentUser"), 
                                  "weddingInspirations", "previous_id", sample.id);
                        // get the remaining ones nearby
                        Meteor.call('topN', "GloVe", sample.text, queryType, function(err, res) {
                            logger.trace("Retrieving the ones nearby");
                            var data = JSON.parse(res.content);
                            var simMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
                            var i = 0
                            var sampledIDs = [sample.id]
                            while (matches.length < N) {
                                var insp = simMatches[i];
                                if (!isInList(insp.id, sampledIDs)) {
                                    matches.push(insp);
                                    sampledIDs.push(insp.id);
                                    FilterManager.create(filterName, Session.get("currentUser"), 
                                      "weddingInspirations", "previous_id", insp.id);
                                }
                                i += 1;
                            }
                            logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                            EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                            $(selector).hide();
                        });
                        // FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                        // var i = 0;
                        // var sampledWords = [];
                        // while (matches.length < N) {
                        //     var insp = simMatches[i];
                        //     if ((insp.similarity < 0.5) && (!isInList(insp.text, sampledWords))) {
                        //         matches.push(insp);
                        //         sampledWords.push(insp.text);
                        //         FilterManager.create(filterName, Session.get("currentUser"), 
                        //           "weddingInspirations", "previous_id", insp.id);
                        //     }
                        //     i += 1;
                        // }
                        // logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
                        // EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                        // $(selector).hide();
                    } else {
                        logger.trace("No matches found! Showing nothing.");
                        Session.set(filterName, []);
                        FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                        FilterManager.create(filterName, Session.get("currentUser"), 
                          "weddingInspirations", "previous_id", "################");
                        EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                        $(selector).show();
                   }
                });
            }
        }
      });
    },
    assembleSet: function(query, queryType, matches) {
        // get the seed
        var seed = initialMatches[0]
        matches = WeddingInspManager.addMatch(matches, seed);
        // get the neighbors
        logger.trace("Call API to retrieve neighbors at " + Date.now());
        var data = JSON.parse(WeddingInspManager.topN("GloVe", query, queryType));
        logger.trace("Received neighbors from API at " + Date.now());
        var neighborPool = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
        // first neighbor
        var firstNeighbor = neighborPool[0];
        matches = WeddingInspManager.addMatch(matches, firstNeighbor);
        var matchPool = []
        // second neighbor
        for (i=1; i<26; i++) {
            var nextNeighbor = neighborPool[i]
            logger.trace("Call API to compare " + nextNeighbor['text'] + " with " + seed['text'] + " at " + Date.now());
            var toSeed = WeddingInspManager.gloveSim(nextNeighbor['text'], seed['text']);
            logger.trace("Received comparison data from API at " + Date.now());
            if (toSeed < 0.5) {
                matches = WeddingInspManager.addMatch(matches, nextNeighbor);
                break;
            } else {
                matchPool.push({"match": nextNeighbor, "sim": toSeed});
            }
        } 
        // fallback
        if (len(matches) < 3) {
            matchPool.sort(function(a, b) { return b.sim-a.sim });
            matches = WeddingInspManager.addMatch(matches, matchPool[0].match);
        }
        return matches;
    },
    initialSample: function(data, operation) {
        // grab the initial matches
        var initialMatches = [];
        if (operation == "different") {
            initialMatches = data.different.sort(function(a, b){ return a.similarity-b.similarity });
        } else {
            initialMatches = data.similar.sort(function(a, b){ return b.similarity-a.similarity });
        }
        return initialMatches;
    },
    addMatch: function(matches, toAdd) {
        matches.push(toAdd);
        FilterManager.create(filterName, Session.get("currentUser"), 
                        "weddingInspirations", "previous_id", toAdd.id);
    },
    getInspirations: function(filterName, query, queryType, N, reason, different, partner) {
        logger.trace("Calling getInspirations");
        FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
        FilterManager.create(filterName, Session.get("currentUser"), 
          "weddingInspirations", "previous_id", "################");
        logger.trace("Retrieving " + N + " new " + queryType + " for " + filterName + " with query: " + query);
        var selector = "#" + filterName + "-question";
        var matches = [];
        logger.trace("Initial call to API at " + Date.now());
        var data = JSON.parse(WeddingInspManager.topN("GloVe", query, queryType));
        logger.trace("Received initial set from API at " + Date.now());
        
        var initialMatches = initialSample(data, different);
        if (initialMatches.length > 0) {
            matches = WeddingInspManager.assembleSet(query, queryType, matches);
        } else {
            logger.trace("No results: trying to retrieve from partner...")
            var initialMatches = initialSample(data, different);
            if (initialMatches.length > 0) {
                matches = WeddingInspManager.assembleSet(query, queryType, matches);
            } else {
                logger.trace("No matches found! Showing nothing.");
                Session.set(filterName, []);
                FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
                FilterManager.create(filterName, Session.get("currentUser"), 
                  "weddingInspirations", "previous_id", "################");
                EventLogger.logInspirationRefresh(matches, query, filterName, reason);
                $(selector).show();
            }
            matches = WeddingInspManager.assembleSet(partner, queryType, matches);
        }
        return {"initialPool": initialMatches, "matches": matches};
    },
    averageSim: function(matches) {
        simSum = 0.0;
        matches.forEach(function(match) {
            simSum += match.similarity;
        });
        return simSum/matches.length;
    },
    topN: function(method, word, topic) {
        logger.trace("Retrieving top N matches for " + topic + ": " + word + " using " + method);
        var url = "http://wordsim.iis-dev.seas.harvard.edu/" + method + "/top15/" + topic;
        logger.trace(url)
        var response = HTTP.call("POST",
            url,
            {data: {word: {'id': 'foo', 'text': word}}}
        );
        logger.trace("Result: " + JSON.stringify(response.content));
        return response;
    },
    gloveSim: function(word1, word2) {
        logger.trace("Calculating similarity between " + word1 + " and " + word2);
        var url = "http://wordsim.iis-dev.seas.harvard.edu/GloVe/similarity";
        var response = HTTP.call("POST",
            url,
            {data: {words: [{'id': 'foo', 'text': target}, 
                            {'id': 'bar', 'text': word}]
                    }
            }
        );
        return response.data.similarity;
    },
    simToQuery: function(target, words) {
        logger.trace("Calculating similarity between " + target + " and " + JSON.stringify(words));
        var url = "http://wordsim.iis-dev.seas.harvard.edu/GloVe/similarity";
        var similarities = [];
        words.forEach(function(word) {
            var response = Meteor.http.post(
                url,
                {data: {words: [{'id': 'foo', 'text': target}, 
                                {'id': 'bar', 'text': word}]
                        }
                }
            );
            // var parsed = JSON.parse(response);
            logger.trace("Response: " + JSON.stringify(response));
            similarities.push({'target': target, 'word': word, 'similarity': response.data.similarity});
        });
        logger.trace("Similarites: " + JSON.stringify(similarities));
        return similarities;
    }
  };
}());