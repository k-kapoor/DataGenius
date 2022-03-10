from flask_login.utils import login_required
import pandas, os, datetime
from flask import request, make_response, Blueprint, jsonify
from . import db, login_manager
from .models import Data

dataset = Blueprint('dataset', __name__)

@dataset.route('/data/<name>', methods=['GET', 'DELETE', 'POST', 'PUT'])
@login_required
def datasetData(name):
    # Checks the remember token to see who uploaded it
    try:
        user = login_manager._load_user_from_remember_cookie(request.cookies.get("remember_token"))
    except:
        return make_response(jsonify(msg="Please login again in order to upload a dataset"), 401)

    # Used for uploading datasets
    if request.method == 'POST':
        # Checks if a file was sent
        try:
            file = request.files['file']
        except:
            return make_response(jsonify(msg="No file was sent"), 400)

        df = ""
        name=""
        # Checks if the file has a name
        try:
            name=file.filename
            # Checks for slashes in the file name
            if '/' in name:
                return make_response(jsonify(msg="You can not include a '/' character in the name"), 400)
            # Checks if the file name is too long
            if len(name) > 64:
                return make_response(jsonify(msg="The File name is too long"), 403)
        except:
            return make_response(jsonify(msg="No File name was provided"), 413)

        # Checks if the file is in a valid format
        try:
            df = pandas.read_csv(file)
            prevData = Data.get_data(name)  # handle name conflicts
            # Checks if a file already exists with that name
            if prevData:
                return make_response(jsonify(msg="There is already a file with this name. Please rename your file and try again"), 409)
        except:
            return make_response(jsonify(msg="Couldn't read the csv file"), 400)

        # save dataset and upload object to DB
        df.to_csv(os.getenv("DATADIR") + name)
        data = Data(name=name, dateUploaded=datetime.datetime.now(), userUploaded=user.name)
        db.session.add(data)
        db.session.commit()
        return make_response(jsonify(msg=file.filename + " is uploaded"), 200)

    # The following code requires the dataset to be uploaded
    # Checks if a dataset with the name exists in the system and has data
    try:
        data = Data.get_data(name)
        if data is None:
            return make_response(jsonify(msg="Dataset " + name + " doesn't exist"), 404)
    except:
        return make_response(jsonify(msg="There was an error retrieving the dataset"), 400)

    # Gets a dataset's data
    if request.method == 'GET':
        df = pandas.read_csv(os.path.join(os.getenv("DATADIR"), name), index_col=[1])
        return make_response(df.to_json(orient="split"), 200)
    
    # Deletes a dataset
    if request.method == 'DELETE':
        data = Data.get_data(name)
        db.session.query(Data).filter(Data.name == data.name).delete()
        db.session.commit()
        
        file = os.path.join(os.getenv("DATADIR"), name)
        if os.path.exists(file):
            os.remove(file)
            return make_response(jsonify(msg="Deleted " + name), 200)
        else:
            return make_response(jsonify(msg="Invalid file path"), 400)

    # Adds tags to the dataset, as well as who curated the dataset and when
    # NOTE currently tags are stored as one string, they should be put into a separate table in the future
    # Only the frontend limits the user to 5 tags, the backend doesn't. This should be changed when tables are implemented
    if request.method == 'PUT':
        data = Data.get_data(name)
        req = request.json

        newTags = req["curation"]
        
        db.session.query(Data).filter(Data.name == data.name).update({Data.curation: newTags, Data.userCurated: user.name, Data.dateCurated: datetime.datetime.now()})
        db.session.commit()
        return make_response(jsonify(msg="The dataset has been curated!"), 200)

@dataset.route('/data/all', methods=['GET', 'DELETE'])
@login_required
def all():
    if request.method == 'GET':
        data = Data.query.order_by(Data.id).all()
        list = []
        count = 0

        for a in data:
            count += 1
            list.append(a.serialize())

        resp = make_response(jsonify(list=list), 200)

        return resp

    # Deletes all of the Datasets
    if request.method == 'DELETE':
        data = Data.query.all()
        # Goes through and gets each dataset file in the system
        for a in data:
            file = os.getenv("DATADIR") + a.name
            if os.path.exists(file):
                db.session.query(Data).filter(Data.name == a.name).delete()
                db.session.commit()
                os.remove(file)
            else:
                return make_response(jsonify(msg="Invalid file path"), 400)
        return make_response(jsonify(msg="Deleted all datasets"), 200)

# Handles retrieving metadata from a dataset
@dataset.route('/metadata/<name>', methods=['GET'])
@login_required
def get_dataset_metadata(name):
    data = Data.query.filter_by(name=name).first()

    item = []

    if data is None:
        return make_response(jsonify(msg="Dataset " + name + " does not exist."), 404)
    
    item.append(data.serialize())

    return make_response(jsonify(item=item), 200)