#!/usr/bin/env python

# Author: Steven Dang stevencdang.com

# Requires pymongo
# from sets import Set
# from pymongo import MongoClient
# from pymongo.errors import DuplicateKeyError
from os import path
# import sys
import file_manager
from db_params import *
from mongohq import Data_Utility
import logging
from ideagens import Node, Edge


DATA_PATH = path.abspath("data")

RAW_FILES = {
    'ideas': 'Mike_Terry_instance.csv',
    'tree': 'MikeTerry_trees.csv'
    }

def read_raw_data():
    """
    Read in the raw data from the mike terry csv files

    """
    global DATA_PATH, RAW_FILES
    # Read raw data in
    file_path = path.join(DATA_PATH, RAW_FILES['ideas'])
    ideas = file_manager.import_from_csv(file_path, Idea)
    file_path = path.join(DATA_PATH, RAW_FILES['tree'])
    nodes = file_manager.import_from_csv(file_path, TreeNode)
    return ideas, nodes


def insert_to_db(db, promptID, graphID, raw_ideas, idea_nodes, filt=None):
    """
    Insert raw ideas and idea nodes into a given db with associated 
    prompt and graph IDs as well as the edge data in the graph

    """
    # Parse data into ideagens structs
    instances = []
    leafs = {}
    for i in raw_ideas:
        instances.append(Node(promptID, graphID, 'forest_idea',
            {'parentID': i.nodeID, 'content': i.content, 
            'is_clustered': True}))
        # Create idea nodes as they are encountered
        if i.nodeID not in leafs:
            leafs[i.nodeID] = Node(promptID, graphID, 'forest_leaf',
                    {'_id': i.nodeID, 'label': '', 
                    'idea_node_ids': []})
    # print "instances: \n" 
    # for i in instances:
        # print i
    # print "leaves:"
    # for l in leafs:
        # print l  

    instanceIDs = db.insert("nodes", instances)
    instance_dict = {}
    for ID, i in zip(instanceIDs, instances):
        i._id = ID
        instance_dict[ID] = i
    # print "instances after insert:"
    # for l in instances:
        # print l
        # print l._id
    leafs_list = leafs.values()
    # print "leafs list:" 
    # for l in leafs_list:
        # print l
    leafIDs = db.insert("nodes", leafs_list)
    # print "leafs list after insert:"
    # for l in leafs_list:
        # print l
        # print l._id
    
    # Create edges connecting idea nodes in the forest
    branches = [Edge(promptID, node.parent, node.id,
                {'type': 'parent_child'})
                for node in idea_nodes]

    # Create edges connecting idea intances to nodes
    clusters = [Edge(promptID, idea.parentID, idea._id,
                {'type': 'same_idea'})
                for idea in instances]
    
    db.insert("edges", branches) 
    db.insert("edges", clusters)
            
    

class Idea:
    """
    Simple container for idea data from csv
    
    """
    def __init__(self, data):
        self.content = data['answer']
        self.prompt = data['question']
        self.promptID = data['question_code']
        self.nodeID = data['idea']

    def __str__(self):
        return "NodeID: " + self.nodeID + \
            "\nprompt: " + self.prompt + "\nidea: " + self.content

class TreeNode:
    """
    Simple container for tree leaf with node metadata and edge data 
    linking ideas

    """
    def __init__(self, data):
        self.id = data['idea']
        self.label = data['idea_label']
        self.parent = data['parent']

    def __str__(self):
        return "Node ID: " + self.id + \
            "\nParentID: " + self.parent + \
            "\nNode Label: " + self.label

if __name__ == '__main__':
  print "importing Mike Terry's data forest data"
  db = Data_Utility('data/mikeTerry', ALL_DBs['ideagensscd'])
  db.clear_db()
  promptID = 1
  graphID = 1
  ideas, nodes = read_raw_data()
  insert_to_db(db, promptID, graphID, ideas, nodes)


