# Requires pymongo
from sets import Set
from pymongo import MongoClient


########## MongoHQ databases ##############
# Need to modify this so that the user and password are stored separately
ideagenstest = {'url': "kahana.mongohq.com",
                'port': 10056,
                'dbName': 'IdeaGensTest',
                'user': 'sandbox',
                'pswd': 'protolab1'
                }
# user and paswd are incorrect (do not want to commit secure info
ideagens = {'url': "kahana.mongohq.com",
            'port': 10075,
            'dbName': 'IdeaGens',
            'user': 'experimenter',
            'pswd': '1#dJ3VYSf8Sn5iE9'
            }

chi1 = {'url': "kahana.mongohq.com",
        'port': 10010,
        'dbName': 'CHI1',
        'user': 'proto1',
        'pswd': 'lTwI9iiTm7'
        }

# Info for connecting to a local instance of meteor's mongo.
# Meteor must be running to connect
local_meteor = {'url': "localhost",
                'port': 3001,
                'dbName': 'meteor',
                'user': 'meteor',
                'pswd': 'meteor',
}


local_meteor = {'url': "localhost",
                'port': 3001,
                'dbName': 'meteor',
                'user': '',
                'pswd': '',
}


def get_db (db=None):
  """
  Returns a handle to an open connection to the mongo db

  """
  if db is None:
      db = ideagenstest
  return get_mongodb(db['url'],
                     db['port'],
                     db['dbName'],
                     db['user'],
                     db['pswd'])


def get_uniq_part (db):
  parts = db.participants.find()
  users = Set()
  # Get set of unique usernames in list of participants
  for part in parts:
    if (part.has_key('user')):
      user = part['user']
      if user != '':
        users.add(user['name'])
  # Perform operations on each username
  # print len(users)
  # for user in users:
      # print user
  return users

def add_excl_parts(db, usernames):
  """
  Add a list of excluded participants based on a set of usernames.
  Can't base on user_id because there are duplicate user_id's with
  the same user name

  """
  desc = "Replicating the effect " + \
          "of priming with common vs rare ideas in individual " + \
          "brainstorming with revised interface"
  exp_id= 'tN33ATDiCukWfj5G7'
  # exps = db.experiments.find()
  exp = db.experiments.find_one({'_id': exp_id})

  db.experiments.update({'_id': exp_id},
      {'$set': {'excludeUsers': list(usernames), 'description': desc}})
  # exp['excludeUsers'] = list(usernames)
  exp = db.experiments.find_one({'_id': exp_id})
  print exp['excludeUsers']
  print exp['description']



def get_mongodb(dbUrl, dbPort, dbName, dbUser=None, dbPswd=None):
  """
  takes db parameters and returns a connected db object usign those
  parameters

  """
  if ((dbUser == None) and (dbPswd == None)):
    dbURI = "mongodb://" + dbUrl + ":" + \
        str(dbPort) + "/" + dbName
  elif ((dbUser == "") and (dbPswd == "")):
    dbURI = "mongodb://" + dbUrl + ":" + \
        str(dbPort) + "/" + dbName
  else:
    dbURI = "mongodb://" + dbUser + ":" + dbPswd + "@" + dbUrl + ":" + \
        str(dbPort) + "/" + dbName
  client = MongoClient(dbURI)
  return client[dbName]


if __name__ == '__main__':
  db = get_db(chi1)
  allCollections = db.collection_names()
  print "list of collections: "
  for col in allCollections:
    print col


