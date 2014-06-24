import pymongo, nltk, sys
from pymongo import MongoClient
from nltk.stem.snowball import SnowballStemmer

passWord = sys.argv[1]

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

#### read in the data, which will be an array of dictionaries ####
client = MongoClient("mongodb://experimenter:%s@kahana.mongohq.com:10075/IdeaGens" %(passWord))
db = client["IdeaGens"]
data = []
for idea in db.ideas.find():
	rowDict = {}
	rowDict["id"] = idea['_id']
	rowDict["content"] = idea['content']
	data.append(rowDict)
# texts = [d['content'].encode('utf-8','ignore').lower() for d in data]

#### tokenize ####
# split into sentences (PunktSentenceTokenizer)
stopWords = read_data("englishstopwords-jc.txt")
for d in data:
	
	text = d['content'].encode('utf-8','ignore')
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

#### cosines ####
"""
Output should be:
1) A networkx graph G, composed of N (a list of nodes), and E (a list of edges)
"""
