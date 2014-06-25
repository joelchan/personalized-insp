#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Author: Joel Chan joelchan.me

import pymongo, nltk, sys
import itertools as it
import numpy as np
from pymongo import MongoClient
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import wordnet as wn
from gensim import corpora, models, similarities, matutils
from operator import itemgetter

"""
Output should be:
A networkx graph G, composed of 
	N (a list of nodes), and 
	E (a list of edges)
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

def get_wordnet_pos(treebank_tag):
	"""
	helper method to convert treebank tags
	into wordnet pos tags for query expansion
	"""
	if treebank_tag.startswith('J'):
		return wn.ADJ
	elif treebank_tag.startswith('V'):
		return wn.VERB
	elif treebank_tag.startswith('N'):
		return wn.NOUN
	elif treebank_tag.startswith('R'):
		return wn.ADV
	else:
		return ''

def expand_text(pos_tokens):
	"""
	interface with wordnet to recursively add
	all synonyms and hypernyms for each token in input list of token-posTag tuples
	return expanded list of tokens that includes synonyms and hypernyms
	"""
	
	# first expand with synonyms
	synonyms = set()
	for item in pos_tokens:
		synsets = wn.synsets(item[0],get_wordnet_pos(item[1]))
		for synset in synsets:
			synonyms.add(synset)

	# start making the list of tokens to be output
	# initialize with lemmas of the synonyms
	bowTokens = set([t[0] for t in pos_tokens])
	for synonym in synonyms:
		for lemma in synonym.lemmas:
			bowTokens.add(lemma.name)

	# now recursively add hypernyms
	nextStack = set(synonyms) # initialize stack
	while(len(nextStack)):

		currentStack = set(nextStack)
		nextStack.clear()

		# get all hypernyms, put in nextStack
		for s in currentStack:
			for hypernym in s.hypernyms():
				nextStack.add(hypernym)

		# add lemmas from the current level of hypernyms to the master bag of tokens
		for hypernym in nextStack:
			for lemma in hypernym.lemmas:
				bowTokens.add(lemma.name)

	return sorted(list(bowTokens))

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
	
	# tokenize and pos tag words (TreeBank)
	pos_tokens = []
	for sentence in sentences:
		tokens = [token.lower() for token in nltk.word_tokenize(sentence)] #tokenize
		pos_tokens += nltk.pos_tag(tokens) #pos tag

	# remove stopwords
	pos_tokens = [t for t in pos_tokens if t[0] not in stopWords]
	
	# # stem it
	# stemmer = SnowballStemmer("english")
	# stems = [stemmer.stem(t).encode('utf-8','ignore') for t in tokens]

	# query expansion
	expandedTokens = expand_text(pos_tokens)

	# add the enriched bag of words as value to current d
	d['expandedBOW'] = ' '.join(expandedTokens)

################################
# cosines 
################################

# prepare dictionary
dictionary = corpora.Dictionary([d['expandedBOW'] for d in data])

# convert tokenized documents to a corpus of vectors
corpus = [dictionary.doc2bow(d['expandedBOW']) for d in data]

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

