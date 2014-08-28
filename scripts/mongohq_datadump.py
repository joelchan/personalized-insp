import pymongo, json
import pandas as pd
from pymongo import MongoClient

mongoClientAddress = "mongodb://proto1:lTwI9iiTm7@kahana.mongohq.com:10010/CHI1"
# client = MongoClient("mongodb://experimenter:%s@kahana.mongohq.com:10075/IdeaGens" %(passWord))
mongoDBName = "CHI1"

# set up the connnection
client = MongoClient(mongoClientAddress)
db = client[mongoDBName]

# define collections to dump
collectionsToDump = ["ideas",
                "clusters",
                "prompts",
                "groups",
                "myUsers",
                "events",
                "notifications"]

# just grab the ideas and clusters
clusters = {}
for cluster in db.clusters.find():
    clusters[cluster[u'_id']] = cluster[u'name']

ideas = []
for idea in db.ideas.find():
    rowDict = {}
    rowDict["idea"] = idea[u'content']
    if len(idea[u'clusterIDs']) > 0:
        clusterID = idea[u'clusterIDs'][0]
        rowDict["theme"] = clusters[clusterID]
    else:
        rowDict["theme"] = "No theme"
    rowDict["starred"] = idea[u'isGamechanger']
    ideas.append(rowDict)

ideasDF = pd.DataFrame(ideas)
ideasDF.to_csv("ideas.csv")

users = {}
for user in db.myUsers.find():
    users[user[u'_id']] = user[u'name']

notifications = []
for notification in db.notifications.find():
    rowDict = {}
    if u'message' in notification:
        rowDict["message"] = notification[u'message']
    elif u'examples' in notification:
        examples = [ex[u'content'] for ex in notification[u'examples']]
        examplesMessage = "Sent Examples: %s" %(', '.join(examples))
        examplesMessage[:-2]
        rowDict["message"] = examplesMessage
    elif u'theme' in notification:
        rowDict["message"] = "Sent theme: %s" %notification[u'theme']
    elif u'prompt' in notification:
        rowDict["message"] = "Sent message: %s" %notification[u'prompt']
    else:
        break
    # get author info
    # get time?
    notifications.append(rowDict)

notificationsDF = pd.DataFrame(notifications)
notificationsDF.to_csv("notifications.csv")

#### placeholder code for iterating over collections we want to dump ####
# for collection in collectionsToDump:
#     collectionItems = []
#     for item in db[collection].find():
#         collectionItems.append(item)
        #### placeholder code for dealing with weird datetime format stuff ####
        # rowDict = {}
        # for field in item:
        #   if field is not u'time':
        #       rowDict[field] = row[field]
        #   else:
        #       thisTime = parse(row[u'time'])
        #       rowDict[u'time'] = thisTime
        # data.append(rowDict)
    #### placeholder code for dumping to a JSON ####
    # resultsFileName = "%s.json" %collection
    # resultsFile = open(resultsFileName,'w')
    # resultsFile.write(json.dumps(collectionItems, indent=2))
    # resultsFile.close()


"""
#### Error messages relating to datetime parsing issues ####

In [24]: print json.dumps(events, indent=4)
---------------------------------------------------------------------------
TypeError                                 Traceback (most recent call last)
<ipython-input-24-09c21bb0a7f7> in <module>()
----> 1 print json.dumps(events, indent=4)

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/__init__.pyc in dumps(obj, skipkeys, ensure_ascii, check_circular, allow_nan, cls, indent, separators, encoding, default, sort_keys, **kw)
    248         check_circular=check_circular, allow_nan=allow_nan, indent=indent,
    249         separators=separators, encoding=encoding, default=default,
--> 250         sort_keys=sort_keys, **kw).encode(obj)
    251 
    252 

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/encoder.pyc in encode(self, o)
    207         chunks = self.iterencode(o, _one_shot=True)
    208         if not isinstance(chunks, (list, tuple)):
--> 209             chunks = list(chunks)
    210         return ''.join(chunks)
    211 

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/encoder.pyc in _iterencode(o, _current_indent_level)
    429             yield _floatstr(o)
    430         elif isinstance(o, (list, tuple)):
--> 431             for chunk in _iterencode_list(o, _current_indent_level):
    432                 yield chunk
    433         elif isinstance(o, dict):

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/encoder.pyc in _iterencode_list(lst, _current_indent_level)
    330                 else:
    331                     chunks = _iterencode(value, _current_indent_level)
--> 332                 for chunk in chunks:
    333                     yield chunk
    334         if newline_indent is not None:

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/encoder.pyc in _iterencode_dict(dct, _current_indent_level)
    406                 else:
    407                     chunks = _iterencode(value, _current_indent_level)
--> 408                 for chunk in chunks:
    409                     yield chunk
    410         if newline_indent is not None:

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/encoder.pyc in _iterencode(o, _current_indent_level)
    440                     raise ValueError("Circular reference detected")
    441                 markers[markerid] = o
--> 442             o = _default(o)
    443             for chunk in _iterencode(o, _current_indent_level):
    444                 yield chunk

/Users/jchan/anaconda/python.app/Contents/lib/python2.7/json/encoder.pyc in default(self, o)
    182 
    183         
--> 184         raise TypeError(repr(o) + " is not JSON serializable")
    185 
    186     def encode(self, o):

TypeError: datetime.datetime(2014, 8, 13, 5, 3, 20, 463000) is not JSON serializable

In [25]: events[0]
Out[25]: 
{u'_id': u'yczX4L44BiFSRTMCZ',
 u'description': u'User began role Ideator',
 u'role': u'Ideator',
 u'time': datetime.datetime(2014, 8, 13, 5, 3, 20, 463000),
 u'type': {u'_id': u'iHLSvfzrGKuZJqTH8',
  u'desc': u'User began role Ideator',
  u'fields': [u'role']},
 u'userID': u'THMSNSyuFRAuuAkNz',
 u'userName': u'Joel'}
"""