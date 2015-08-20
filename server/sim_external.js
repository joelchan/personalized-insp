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

Meteor.methods({
    topN: function(method, word, topic) {
        return SimExternal.topN(method, word, topic);
    },
});