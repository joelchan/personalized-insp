#!/usr/bin/env python

# Author: Steven Dang stevencdang.com

import mongohq
from sets import Set
import logging
import datetime

logging.basicConfig(format='%(levelname)s:%(message)s',
                    level=logging.DEBUG)


def list_to_dict(docs):
    """
    Convert a list of mongo documents with an _id field to a dictionary
    indexed by the _id field

    """
    return Dict([(doc['_id'], doc) for doc in docs])

def get_ids(docs):
    """
    Grab _id field from set of docs and return a list

    """
    return [doc['_id'] for doc in docs]

class Edge:
    """
    Graph Edge as defined by Ideagens

    """
    def __init__(self, promptID, sourceID, targetID, data=None):
        self.promptID = promptID
        self.sourceID = sourceID
        self.targetID = targetID
        if data is not None:
            for key in data.keys():
                setattr(self, key, data[key])

    def __str__(self):
        result = "Edge with: "
        attrs = self.__dict__
        for key in attrs.keys():
            result += str(key) + ": " + str(attrs[key]) + " "
        return result


class Node:
    """
    Graph Node as defined by Ideagens

    """
    def __init__(self, graphID, promptID, data_type, data=None):
        self.graphID = graphID
        self.promptID = promptID
        self.type = data_type
        if data is not None:
            for key in data.keys():
                # print "Setting attribute: " + str(key) + " with " + str(data[key])
                setattr(self, key, data[key])

    def __str__(self):
        result = "Node with: "
        attrs = self.__dict__
        for key in attrs.keys():
            result += str(key) + ": " + str(attrs[key]) + " "
        return result

class Idea:
    """
    Idea as defined by Ideagens
    Add a field "previousID" to tie it to the ideas to its previous db

    """
    def __init__(self, content, previousID, user, prompt, data=None):
        self.time = datetime.datetime.now()
        self.content = content
        self.previousID = previousID
        self.userID = user['_id']
        self.userName = user['name']
        self.prompt = prompt
        self.promptID = prompt['_id']
        self.isGamechanger = False
        self.readIDs = []
        self.votes = [];
        self.inCluster = False
        self.clusterIDs = []
        self.zoomSpace = []
        if data is not None:
            for key in data.keys():
                # print "Setting attribute: " + str(key) + " with " + str(data[key])
                setattr(self, key, data[key])

    def __str__(self):
        result = "Idea with: "
        attrs = self.__dict__
        for key in attrs.keys():
            result += str(key) + ": " + str(attrs[key]) + " "
        return result

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, item):
        self.__dict__[key] = item

class User:
    """
    User as defined by Ideagens

    """
    def __init__(self, name, role, data=None):
        self.name = name
        self.type = role
        if data is not None:
            for key in data.keys():
                # print "Setting attribute: " + str(key) + " with " + str(data[key])
                setattr(self, key, data[key])

    def __str__(self):
        result = "User with: "
        attrs = self.__dict__
        for key in attrs.keys():
            result += str(key) + ": " + str(attrs[key]) + " "
        return result

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, item):
        self.__dict__[key] = item

class Prompt:
    """
    Prompt as defined by Ideagens

    """
    def __init__(self, question, user, title, data=None):
        self.question = question
        self.title = title
        self.time = datetime.datetime.now()
        self.userIDs = [user['_id']]
        self.groupIDs = [] # might need groups?
        self.template = None # don't use this for now, but we might have to if it breaks
        if data is not None:
            for key in data.keys():
                # print "Setting attribute: " + str(key) + " with " + str(data[key])
                setattr(self, key, data[key])

    def __str__(self):
        result = "Prompt with: "
        attrs = self.__dict__
        for key in attrs.keys():
            result += str(key) + ": " + str(attrs[key]) + " "
        return result

    def __getitem__(self, key):
        return self.__dict__[key]

    def __setitem__(self, key, item):
        self.__dict__[key] = item

class ExpSynthSubset:
    """
    ExpSynthSubset as defined by Ideagens

    """
    def __init__(self, ideaIDs, cond, exp, description, data=None):
        self.users = []
        self.ideaIDs = ideaIDs
        self.condID = cond['_id']
        self.condName = cond['description']
        self.expID = exp['_id']
        self.description = description
        if data is not None:
            for key in data.keys():
                # print "Setting attribute: " + str(key) + " with " + str(data[key])
                setattr(self, key, data[key])

class Db_Manager:
    """
    A class for performing typical data processing operations on
    the ideagens database

    """
    def __init__(self, db_params=mongohq.ideagens):
        """
        Constructor to instantiate references to Ideagens instance
        and its corresponding database

        """
        self.db_params = db_params
        self.db = mongohq.get_db(db_params)

    def set_db(self, db_params=mongohq.ideagenstest):
        """
        Set the db where ideagens data sits

        """
        self.db = mongohq.get_db(db_params)

    def get_prompts(self):
        logging.debug("Get all prompts")
        return self.db['prompts'].find()

    def get_users_in_prompt(self, prompt):
        logging.debug("Get users in prompt")
        ids = prompt['groupIDs']
        groupIDs = Set(ids)
        logging.debug("Found " + str(len(groupIDs)) + " groups with this prompt")
        # Getting all users for the prompt ignoring duplicates across groups
        user_ids = Set([])
        users = []
        for groupID in groupIDs:
            group = self.db['groups'].find({'_id': groupID})[0]
            for user in group['users']:
                if (user['_id'] not in user_ids):
                    user_ids.add(user['_id'])
                    users.append(user)

        logging.info("got " + str(len(users)) + " users in this prompt")
        return users

    def get_ideas_for_user(self, user, prompt):
        logging.debug("Get ideas for user in prompt")
        return self.db['ideas'].find({'userID': user['_id'],
                                     'promptID': prompt['_id']
                                     })

    def get_login_times(self, users):
        logging.debug("Getting login times for users")
        events = []
        for user in users:
            login_events = self.db['events'].find({
                'userID': user['_id'],
                'description': "User logged into experiment"
            })
            logging.debug("looking at user " + user['name'])
            logging.debug(login_events.count())
            events.extend(login_events)
        return events


if __name__ == '__main__':
    # clear_db(mongohq.ideagenstest)
    # dump_db('data/chi1', mongohq.chi1)
    # restore_db('data/chi3_raw', mongohq.ideagenstest)
    db = Db_Manager(mongohq.ideagens)
