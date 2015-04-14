#!/usr/bin/env python

# Author: Steven Dang stevencdang.com

# Requires pymongo
# from sets import Set
# from pymongo import MongoClient
# from pymongo.errors import DuplicateKeyError
from os import path
# import sys
import file_manager
# from db_params import *
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
    if filt is not None:
        instances = []
        leafs = {}
        for i in raw_ideas:
             if filt(i):
                instances.append(Node(promptID, graphID, 'forest_idea',
                    {'parentID': i.id, 'content': i.content, 
                    'is_clustered': True}))
                # Create idea nodes as they are encountered
                if i.nodeID not in leafs:
                    leafs[i.nodeID] = Node(promptID, graphID, 'forest_leaf',
                            {_id: i.nodeID, label: '', idea_node_ids: []})

        instanceIDs = db.insert("nodes", instances)
        instance_dict = {}
        for ID, i in zip(instanceIDs, instances):
            i._id = ID
            instance_dict[ID] = i
        leafs_list = leafs.values()
        leafIDs = db.insert("nodes", leafs)
        # Create edges or branches for the ree
        
        edges = []
        for node in idea_nodes:
            edges.append(Edge(promptID, node.parent, node.id,
            {type: 'parent_child'}))
                    
            

            
    else:
        insert_ideas = [Node(promptID, graphID, 'forest_idea',
            {'ideaID': i.id, 'content': i.content, 'is_clustered': True}) \
            for i in ideas (i)]
    

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
  ideas, edges = read_raw_data()

