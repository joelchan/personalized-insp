import pymongo, json
from pymongo.errors import DuplicateKeyError
import mongohq
import pandas as pd
from os import mkdir, listdir, path
from datetime import datetime
import dateutil.parser

# collections to ignore
default_collections = [
    'system.indexes',
    'system.users',
]


def date_handler(obj):
        return obj.isoformat() if hasattr(obj, 'isoformat') else obj


def write_json_to_file(data='', dir_name='data', file_name='default'):
    print "writing to directory: " + dir_name
    if not path.exists(dir_name):
        mkdir(dir_name, 0774)
    # Create file path
    file_path = path.join(dir_name, file_name + '.json')
    print "writing to: " + file_path
    # Write data to file
    resultsFile = open(file_path,'w')
    resultsFile.write(
        json.dumps(data, indent=2, default=date_handler)
    )
    resultsFile.close()


def dump_db(dir_name='data', db_params=mongohq.ideagenstest):
    # set up the connnection
    db = mongohq.get_db(db_params)
    allCollections =  [col for col in db.collection_names() if col not in default_collections]
    print "list of collections: "
    for col in allCollections:
        print "collection name: " + col
        docs = db[col].find()
        data = [doc for doc in docs]
        write_json_to_file(data, dir_name, col)


def decode_json_file(file_path):
    json_file = open(file_path, 'r')
    decode_data = json.load(json_file)
    # Handle isodate
    if 'time' in decode_data[0]:
        print "data has time field"
        try:
            datetime_data = dateutil.parser.parse(decode_data[0]['time'])
        except:
            print "Couldn't convert to datetime"
            pass
        else:
            print "converted to datetime object"
            for doc in decode_data:
                doc['time'] = dateutil.parser.parse(doc['time'])
    return decode_data


def restore_db(dir_name='data', db_params=mongohq.ideagenstest):
    files = listdir(dir_name)
    col_names = [file.split('.json')[0] for file in files]
    db = mongohq.get_db(db_params)
    existing_cols = db.collection_names()
    for file_name in files:
        file_path = path.join(dir_name, file_name)
        col = file_name.split('.json')[0]
        print "writing to data to collection " + col + \
            " in db: " + db_params['dbName']
        if col != 'users':
            data = decode_json_file(file_path)
            if col not in existing_cols:
                print "creating collection: " + col
                db.create_collection(col)
            else:
                print "inserting into existing collection"
            try:
                db[col].insert(data, continue_on_error=True)
            except DuplicateKeyError:
                print "Attempted insert of document with duplicate key"
            else:
                print "success"
        else:
            print "not writing users to db"

def clear_db(db_params=mongohq.ideagenstest):
    db = mongohq.get_db(db_params)
    cols = db.collection_names()
    clear_cols = [col for col in cols if col not in default_collections]
    for col in clear_cols:
        # Remove all docs from collection
        db[col].remove()
    


if __name__ == '__main__':
    dump_db('data/chi1', mongohq.chi1)
    restore_db('data/chi1', mongohq.ideagenstest)
    clear_db(mongohq.chi1)




