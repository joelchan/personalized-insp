var logger = new Logger('Server:SimExternal');
// Comment out to use global logging level
Logger.setLevel('Server:SimExternal', 'trace');
//Logger.setLevel('Server:SimExternal', 'debug');
// Logger.setLevel('Server:SimExternal', 'info');
//Logger.setLevel('Server:SimExternal', 'warn');

SimExternal = {};

SimExternal.topN = function(method, word, topic) {
    logger.trace("Retrieving top N matches for " + topic + ": " + word + " using " + method);
    var url = "http://wordsim.iis-dev.seas.harvard.edu/" + method + "/top15/" + topic;
    logger.trace(url)
    var response = Meteor.http.post(
        url,
        {data: {word: {'id': 'foo', 'text': word}}}
    );
    logger.trace("Result: " + JSON.stringify(response.content));
    return response;
}

SimExternal.simToQuery = function(target, words) {
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

SimExternal.simSet = function(word, topic, operation, alt) {
    logger.trace("Retrieving similarity matches for " + topic + ": " + word);
    var url;
    if (alt) {
        url = "http://wordsim.iis-dev.seas.harvard.edu/GloVe/simSet/" + topic;
        // url = "http://127.0.0.1:5000/GloVe/simSet/" + topic;        
    } else {
        url = "http://wordsim2.iis-dev.seas.harvard.edu/GloVe/simSet/" + topic;
    }
    
    logger.trace(url)
    var response = Meteor.http.post(
        url,
        {data: {word: {'id': 'foo', 'text': word},
                operation: operation}}
    );
    logger.trace("Result: " + JSON.stringify(response.content));
    return response;
}

SimExternal.lsaRanks = function(ideas) {
    var url = "http://sim-api.herokuapp.com/LSArank"
    var response = Meteor.http.post(
        url,
        {data: {ideas: ideas
                }
        }
    );
    return response.data.rankings;
}

Meteor.methods({
    topN: function(method, word, topic) {
        return SimExternal.topN(method, word, topic);
    },
    simToQuery: function(target, words) {
        return SimExternal.simToQuery(target, words);
    },
    simSet: function(word, topic, operation, alt) {
        return SimExternal.simSet(word, topic, operation, alt);
    },
    lsaRanks: function(ideas) {
        return SimExternal.lsaRanks(ideas);
    }
});