#!/usr/bin/env python

# Author: Steven Dang stevencdang.com

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

fac_exp = {'url': "ds043981.mongolab.com",
        'port': 43981,
        'dbName': 'joelcprotolab',
        'user': 'joelc',
        'pswd': 'lnC00K=beta{5}'
        }

# Info for connecting to a local instance of meteor's mongo.
# Meteor must be running to connect
local_meteor = {'url': "localhost",
                'port': 3001,
                'dbName': 'meteor',
                'user': '',
                'pswd': '',
}

ALL_DBs = {'ideagens': ideagens,
             'ideagenstest': ideagenstest,
             'chi1': chi1,
             'fac_exp': fac_exp,
             'local': local_meteor
          }

