# Requires pymongo
import pymongo

from pymongo import MongoClient


########## MongoHQ databases ##############
# Need to modify this so that the user and password are stored separately
ideagensUrl = "kahana.mongohq.com"
ideagensPort = 10075
ideagensDBName = 'IdeaGens'
ideagenstestPort = 10058
ideagenstestDBName = 'IdeaGensTest'

client = MongoClient(ideagensUrl, ideagenstestPort)
# db = client[ideagenstestDBName]
db = client.IdeaGensTest
success = db.authenticate('sandbox', 'protolab1')

print success


