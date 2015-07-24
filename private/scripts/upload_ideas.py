# import numpy as np
# from random import randint
import pandas as pd
# import math, os, csv, json, nlp
from ideagens import Idea, User, Prompt, list_to_dict
import db_params
import mongohq
from bson.objectid import ObjectId
import sys, os

"""
This script uploads ideas from a file into a specified ideagens db, 
creating dummy prompt and user to associate with the ideas

Usage:
python upload_ideas.py <db_name> <file_name>

db_name must match one of the db_param keys in db_params.py
file_name must match a valid csv file with ideas in /private/scripts/data
"""


"""
Read in the data
Let's expect a csv with cols:
1) id
2) content
"""
filename = sys.argv[2]
data_path = os.path.join("/Users/jchan/Projects/CrowdIdeation/private/scripts/data/", filename)
print data_path
ideas = pd.read_csv(data_path)
print ideas[:5]

"""
Create db connection
"""
db_name = sys.argv[1]
db = mongohq.get_db(db_params.ALL_DBs[db_name])
db_util = mongohq.Data_Utility('data', db_params.ALL_DBs[db_name])

"""
Make and upload dummy user
"""
user = User("Joel", "Brainstorm user", 
                {'_id': str(ObjectId())})
userIDs = db_util.insert("myUsers", [user])
# print userIDs
# print result
# userIDs = [p for p in result]
# print userIDs
# userID_obj = userIDs[0]
# userID_str = str(userID_obj)
# db['myUsers'].update({"_id": userID_obj}, {"$set": {"_id": userID_str}})
user = db['myUsers'].find_one({"_id": userIDs[0]})
# user['_id'] = str(userIDs[0])
# print newUser
# print userIDs
# user._id = "dummy"
print "New user that was created: " + str(user)

"""
Make and upload dummy prompt
"""
question = "Dummy"
title = filename.replace(".csv","")
prompt = Prompt(question, user, title,
                {'_id': str(ObjectId())})
promptIDs = db_util.insert("prompts", [prompt])
# # print result
# promptIDs = [p for p in result]
# # print promptIDs
# prompt['_id'] = str(promptIDs[0])
# prompt._id = "dummy"
# print prompt
prompt = db.prompts.find_one({"_id": promptIDs[0]})
print "New prompt that was created: " + str(prompt)

"""
Make and upload all ideas
"""

idea_objects = [Idea(row['content'], row['previous_id'],
                user, prompt, {'_id': str(ObjectId())}) for index, row in ideas.iterrows()]
idea_ids = db_util.insert('ideas', idea_objects)
print "%d ideas successfully inserted" %(len(idea_ids))
print "First 10 ideas: "
for i in idea_ids:
    new_i = db.ideas.find_one({'_id': i})
    print new_i