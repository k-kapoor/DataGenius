from flask import json, jsonify
from flask.scaffold import F
import requests, pytest, datetime, pandas, os
from requests import cookies
from pandas import json_normalize

from werkzeug.security import generate_password_hash, check_password_hash

url = "http://localhost:5000/"


basePath =os.path.join(os.path.dirname(__file__), "../../..")
print (basePath)

# Login examples

user_payload = {
    "email": "Chad@gmail.com",
    "confEmail": "Chad@gmail.com",
    "name": "Chad",
    "password": "testPassword",
    "confPassword": "testPassword",
    "rememberMe" : True
}

user_payload_2 = {
    "email": "GigaChad@gmail.com",
    "confEmail": "GigaChad@gmail.com",
    "name": "Gigachad",
    "password": "testPassword",
    "confPassword": "testPassword",
    "rememberMe" : True
}

user_payload_3 = {
    "email": "bigdata@gmail.com",
    "confEmail": "bigdata@gmail.com",
    "name": "BigData",
    "password": "testPassword",
    "confPassword": "testPassword",
    "rememberMe" : True
}

data_payload_1_uncurated = {
    'dateUploaded': datetime.datetime.now().day,
    'dateCurated': "Null",
    'name': "Dox",
    'tags': "Null",
    'uploader': user_payload_3["name"],
    'curatedBy': "Null"
}

example_1 = {
    'name': "example_1.csv",
    'file': "api/tests/example_datasets/example_1.csv"
}

example_2 = {
    'name': "example_2.csv",
    'file': 'api/tests/example_datasets/example_2.csv'
}

invalid_format_example = {
    'name': 'bob',
    'file': ''
}

invalid_example_long_name = {
    'name': 'longNameThatShouldBeInvalidAndHopefullyIsNotAcceptedByTheSystemOrElseIWillBeSad.csv',
    'file': 'api/tests/example_datasets/longNameThatShouldBeInvalidAndHopefullyIsNotAcceptedByTheSystemOrElseIWillBeSad.csv'
}

valid_tags = {
    'curation' : "Random, Awesome, Wonderful"
}

def signup(user, jar):
    return requests.post(url + 'signup', json=user, cookies=jar)

def login(user, jar):
    return requests.post(url + 'login', json=user, cookies=jar)

def logout(user, jar):
    return requests.post(url + "logout", json=user, cookies=jar)

def deleteuser(user, jar):
    return requests.delete(url + 'users/' + user["name"], json=user, cookies=jar)

def getUser(user_name):
    return requests.get(url + 'users/' + user_name)

def uploadData(fileName, fileData, jar):
    return requests.post(url + 'data/' + fileName, files=dict(file = fileData), cookies=jar)

def getData(filename, jar):
    return requests.get(url + 'data/' + filename, cookies=jar)

def deleteData(filename, jar):
    return requests.delete(url + 'data/' + filename, cookies=jar)

def updateTags(filename, tags, jar):
    return requests.put(url + 'data/' + filename, json=tags, cookies=jar)

def getAllData(jar):
    return requests.get(url + 'data/all', cookies=jar)

def deleteAllData(jar):
    return requests.delete(url + 'data/all', cookies=jar)

def getMetaData(filename, jar):
    return requests.get(url + 'metadata/' + filename, cookies=jar)

# Runs before each test
# Creates a user from user_payload_3 and logs them in.
# Next, it then deletes all datasets stored in the system (excluding those in "example_datasets").
# Finally, it logs out the user, and then resets all users.
@pytest.fixture(autouse=True)
def resetTest():
    jar = createLoggedInUser()
    createValidUsers()
    # Code after yield is for cleanup
    yield
    logout(user_payload_3, jar)
    deleteAllData(jar)
    resetUsers()



def resetUsers():
    # Clears the "user_payload" valid user
    response = login(user_payload, None)
    jar = response.cookies
    deleteuser(user_payload, jar)

    # Clears the "user_payload_2" valid user
    response = login(user_payload_2, None)
    jar = response.cookies
    deleteuser(user_payload_2, jar)

    response = login(user_payload_3, None)
    jar = response.cookies
    deleteuser(user_payload_3, jar)

def createValidUsers():
    # Signs up "user_payload"
    signup(user_payload, None)

    # Signs up "user_payload_2"
    signup(user_payload_2, None)

    # Signs up "user_payload_3"
    signup(user_payload_3, None)

def createLoggedInUser():
    # Signs up "user_payload_3"
    signup(user_payload_3, None)

    response = login(user_payload_3, None)
    jar = response.cookies
    return jar


class TestUpload:
    # No file was uploaded
    def test_upload_no_file(self):
        jar = createLoggedInUser()
        response = uploadData(invalid_format_example["name"], None, jar)
        assert response.status_code == 400
        assert response.json()["msg"] == "No file was sent"

    def test_upload_success(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            response = uploadData(example_1["name"], f, jar)
        assert response.status_code == 200
        assert response.json()["msg"] == example_1["name"]  + " is uploaded"
    
    def test_upload_invalid_name(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, invalid_example_long_name["file"]), "rb") as f:
            response = uploadData(invalid_example_long_name["name"], f, jar)
        assert response.status_code == 403
        assert response.json()["msg"] == "The File name is too long"

    def test_upload_repeat_file(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            response = uploadData(example_1["name"], f, jar)
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            response = uploadData(example_1["name"], f, jar)
        assert response.status_code == 409
        assert response.json()["msg"] == "There is already a file with this name. Please rename your file and try again"

    def test_invalid_noAuth(self):
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            response = uploadData(example_1["name"], f, None)
        assert response.status_code == 401

class TestGet:
    # Tests getting "example_1.csv" without it being in the system
    def test_invalid_noFileNamed(self):
        jar = createLoggedInUser()
        response = getData(example_1["name"], jar)
        assert response.status_code == 404
        assert response.json()["msg"] == "Dataset " + example_1["name"]  + " doesn't exist"

    # TODO test if this assert actually works    
    def test_valid(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            uploadData(example_1["name"], f, jar)
        response = getData(example_1["name"], jar)
        assert response.status_code == 200
        df = pandas.read_csv(os.path.join(basePath, example_1["file"]))
        # Convert the response n a dataframe
        test = df.to_json(orient="split")
        # Very important, parses the json string to a dict
        test = json.loads(test)
        assert test["columns"] == response.json()["columns"]
        assert test["index"] == response.json()["index"]
        assert test["data"] == response.json()["data"]

class TestDelete:
    def test_invalid_noFileNamed(self):
        jar = createLoggedInUser()
        response = deleteData(example_1["name"], jar)
        assert response.status_code == 404
        assert response.json()["msg"] == "Dataset " + example_1["name"]  + " doesn't exist"
    
    def test_valid(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            uploadData(example_1["name"], f, jar)
        response = getData(example_1["name"], jar)
        assert response.status_code == 200

        response = deleteData(example_1["name"], jar)
        assert response.status_code == 200
        assert response.json()["msg"] == "Deleted " + example_1["name"] 

        response = getData(example_1["name"], jar)
        assert response.status_code == 404
        assert response.json()["msg"] == "Dataset " + example_1["name"]  + " doesn't exist"

class TestTags:
    def test_invalid_noFileNamed(self):
        jar = createLoggedInUser()
        response = updateTags(example_1["name"], valid_tags, jar)
        assert response.status_code == 404
        assert response.json()["msg"] == "Dataset " + example_1["name"]  + " doesn't exist"
    
    def test_valid(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            uploadData(example_1["name"], f, jar)
        response = updateTags(example_1["name"], valid_tags, jar)
        assert response.status_code == 200
        assert response.json()["msg"] == "The dataset has been curated!"

        # Checks for the author and day of curation
        # Relies on the Metadata endpoint
        response = getMetaData(example_1["name"], jar)
        assert response.status_code == 200
        assert response.json()["item"][0]["curatedBy"] == user_payload_3["name"] 

class TestGetAll:
    def test_GetAllData(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            uploadData(example_1["name"], f, jar)
        with open(os.path.join(basePath, example_2["file"]), "rb") as f:
            uploadData(example_2["name"], f, jar)
        response = getAllData(jar)
        assert response.status_code == 200
        assert response.json()["list"][0]["name"] == example_1["name"] 
        assert response.json()["list"][1]["name"] == example_2["name"] 

class TestMetaData:
    def test_valid(self):
        jar = createLoggedInUser()
        with open(os.path.join(basePath, example_1["file"]), "rb") as f:
            uploadData(example_1["name"], f, jar)
        response = getMetaData(example_1["name"], jar)
        assert response.status_code == 200
        assert response.json()["item"][0]["uploader"] == user_payload_3["name"]