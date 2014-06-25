#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Author: Joel Chan joelchan.me

import pymongo, nltk, sys
from pymongo import MongoClient
from nltk.stem.snowball import SnowballStemmer
from gensim import corpora, models, similarities, matutils
from operator import itemgetter
import itertools as it
import numpy as np

"""
Output should be:
1) A networkx graph G, composed of N (a list of nodes), and E (a list of edges)
"""

passWord = sys.argv[1]
THRESHOLD = 0.5

def read_data(filename):
	"""
	Read in data from a file and return a list with each element being one line from the file.
	Parameters:
	1) filename: name of file to be read from
	Note: the code now opens as a binary and replaces carriage return characters with newlines because python's read and readline functions don't play well with carriage returns.
	However, this will no longer be an issue with python 3.
	"""	
	with open(filename, "rb") as f:
		s = f.read().replace('\r\n', '\n').replace('\r', '\n')
		data = s.split('\n')
	return data

def expand_text(tokens):
	"""
	interface with wordnet to recursively add
	all synonyms and hypernyms for each token in input list of tokens
	return expanded list of tokens that includes synonyms and hypernyms
	"""
	expanded = []
	for t in tokens:
		# grab synonyms
		# grab hypernyms
	return expanded

# read data from mongoDB
client = MongoClient("mongodb://experimenter:%s@kahana.mongohq.com:10075/IdeaGens" %(passWord))
db = client["IdeaGens"]
data = []
for idea in db.ideas.find():
	rowDict = {}
	rowDict["id"] = idea['_id']
	rowDict["content"] = idea['content']
	data.append(rowDict)

#### tokenize ####
stopWords = read_data("englishstopwords-jc.txt")
for d in data:
	
	# read the text
	text = d['content'].encode('utf-8','ignore')
	
	# split into sentences (PunktSentenceTokenizer)
	sentences = nltk.sent_tokenize(text)
	
	# tokenize words (TreeBank)
	tokens = []
	for sentence in sentences:
		tokens += [token for token in nltk.word_tokenize(sentence)]
	
	# remove stopwords
	tokens = [t.lower() for t in tokens if t.lower() not in stopWords]
	
	# stem it
	stemmer = SnowballStemmer("english")
	stems = [stemmer.stem(t).encode('utf-8','ignore') for t in tokens]

	# query expansion
	expandedTokens = expand_text(stems)

	# add the enriched bag of words as value to current d
	d['bow'] = ' '.join(expandedTokens)

################################
# cosines 
################################

# prepare dictionary
dictionary = corpora.Dictionary([d['bow'] for d in data])

# convert tokenized documents to a corpus of vectors
corpus = [dictionary.doc2bow(d['bow']) for d in data]

# convert raw vectors to tfidf vectors
tfidf = models.TfidfModel(corpus) #initialize model
corpus_tfidf = tfidf[corpus] #apply tfidf model to whole corpus

# make lsa space, use max dimensions for now
lsi = models.LsiModel(corpus_tfidf, id2word=dictionary, num_topics=dim) #create the space

# output the matrix V so we can use it to get pairwise cosines
# https://github.com/piskvorky/gensim/wiki/Recipes-&-FAQ#q3-how-do-you-calculate-the-matrix-v-in-lsi-space
vMatrix = matutils.corpus2dense(lsi[corpus_tfidf],len(lsi.projection.s)).T / lsi.projection.s

# generate pairs
indices = [i for i in xrange(len(data))]
pairs = [p for p in it.combinations(indices,2)]
edges = []
for pair in pairs:
	node1 = data[pair['id']]
	node2 = data[pair['id']]
	sim = cosine(pair[0],pair[1],vMatrix)
	if sim > THRESHOLD:
		edges.append((node1,node2))

################################
# turn into networkx graph 
################################