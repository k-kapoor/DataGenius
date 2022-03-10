from flask import json, jsonify
import requests, pytest
from requests import cookies
from werkzeug.security import generate_password_hash, check_password_hash
url = "http://localhost:5000/"

# Used for testing email and confEmail, ensuring that they match
user_invalid_confEmail = {
    "email": "testEmail@gmail.com",
    "confEmail": "Email@gmail.com",
    "name": "testNameFail",
    "password": "testPassword",
    "confPassword": "testPassword",
}

# Used for testing password and confPassword, ensuring that they match

user_invalid_confPassword = {
    "email": "testEmail@gmail.com",
    "confEmail": "testEmail@gmail.com",
    "name": "testNameFail",
    "password": "testPassword",
    "confPassword": "Password",
}

# Used for testing invalid email format
user_invalid_email = {
    "email": "gmail.com",
    "confEmail": "gmail.com",
    "name": "testNameFail",
    "password": "testPassword",
    "confPassword": "testPassword",
}

# Used for testing duplicate names
user_invalid_dup_name = {
    "email": "testEmail696@gmail.com",
    "confEmail": "testEmail696@gmail.com",
    "name": "Chad",
    "password": "testPassword",
    "confPassword": "testPassword",
}

# Used for testing duplicate emails
user_invalid_dup_email = {
    "email": "Chad@gmail.com",
    "confEmail": "Chad@gmail.com",
    "name": "testName",
    "password": "testPassword",
    "confPassword": "testPassword",
}

# Login examples

user_login_badName = {
    "name": "badName",
    "password": "testPassword",
    "rememberMe": False
}
user_login_badPassword = {
    "name": "testName",
    "password": "badPassword",
    "rememberMe": False
}


user_payload = {
    "email": "Chad@gmail.com",
    "confEmail": "Chad@gmail.com",
    "name": "Chad",
    "password": "testPassword",
    "confPassword": "testPassword",
    "bio": "Hello, I am Chad",
    'rememberMe': True,
}

user_payload_2 = {
    "email": "GigaChad@gmail.com",
    "confEmail": "GigaChad@gmail.com",
    "name": "Gigachad",
    "password": "testPassword",
    "confPassword": "testPassword",
    "bio": "Hello, I am Gigachad",
    'rememberMe': True,
}

# Update Examples
update_bio_valid = {
    "type": "Bio",
    "content": "Hello, I am Chad"
}

update_bio_invalid_long = {
    "type": "Bio",
    "content": "AczaorHPuatSZerpxkoOBxGPvibamPDoFcWiBXYWDRuuArennwMsKNXXZYtodytRPZLDEitYuTvohZPkAuzcXPegAwsFaeBRLvJqdhhfVqaTisGqLcFUESQQzhEwjVMEwLmzHuOQgjmljIcgBhVTiupPokSEeOZjdCjYRdhpwBqvsATjJgxhytnAhYFWjqKkPTNeWGxcXJOvTbrxOHnQUAEczuvWMTiulglYETJnBepClSrbyCZQszjVNDFsIrGDXmHbiPudhqqPYANOEHdYSjVkSWbvspHLbIBXonYLJdfHWVryUSaVxnSGdXUohOsyrAjtgFwjSkHuPfxJjbxMALzOorNxpEJdbcaErVeFVvrBTVSXOEcFbgLfpPEEbzBWuFmofVtCnqLiXrhpWUuotPxpsxLSilDDeZDHlKaRXNhMJFScoIthsJBSczVnpQyIyBgXQjGqVQbHEJyjLvuukDmJLIkLTAMCRMYWyItKzUnjBCXpiyeGLEqYJzwUdumMblPUZFJUwrSdJrMvLBbdTnRpviYFrerZSciRkAjqqHbaXriedqrmgiqEqWYzUZDCVHWrOfsWqmnmXYSpiqLQVPNooGjcNJDDsBXivrKxbxhxTZFuQaeDnbbScelGEvtjpvwcbThBeXfeSobUCjZcAayAHSxiTYgnGNnatCWvaLmNbafgKGFvxraUjecosumeGnOFKxyBXzUFmFwyWxxuHXOUwMEHtrfvFVqttFIFmZkQuOLcbKxGbVIBSkmAmldvMBuDMPuVUZbJpvWZjHawvTQxpzHjuIOdOGExZgmITteAZmaCMAHzZveEXUMNayInZDXiqOFnwDnfECpssQwAqJmJxUQlaShtfdxsLXzxMZcYbJxzSofdFfnkdGMfacIzzUkNqufTAafPsRjgGRGBdZzWWlZYAUfjVrqGTgPDVXGDtsAzcpiTTAiPJVtQACMTfDEZYHRtwQYGaEqIkVGpmxWrUETAcQKFgbGkzxtBe"
}

update_bio_valid_long = {
    "type": "Bio",
    "content": "AczaorHPuatSZerpxkoOBxGPvibamPDoFcWiBXYWDRuuArennwMsKNXXZYtodytRPZLDEitYuTvohZPkAuzcXPegAwsFaeBRLvJqdhhfVqaTisGqLcFUESQQzhEwjVMEwLmzHuOQgjmljIcgBhVTiupPokSEeOZjdCjYRdhpwBqvsATjJgxhytnAhYFWjqKkPTNeWGxcXJOvTbrxOHnQUAEczuvWMTiulglYETJnBepClSrbyCZQszjVNDFsIrGDXmHbiPudhqqPYANOEHdYSjVkSWbvspHLbIBXonYLJdfHWVryUSaVxnSGdXUohOsyrAjtgFwjSkHuPfxJjbxMALzOorNxpEJdbcaErVeFVvrBTVSXOEcFbgLfpPEEbzBWuFmofVtCnqLiXrhpWUuotPxpsxLSilDDeZDHlKaRXNhMJFScoIthsJBSczVnpQyIyBgXQjGqVQbHEJyjLvuukDmJLIkLTAMCRMYWyItKzUnjBCXpiyeGLEqYJzwUdumMblPUZFJUwrSdJrMvLBbdTnRpviYFrerZSciRkAjqqHbaXriedqrmgiqEqWYzUZDCVHWrOfsWqmnmXYSpiqLQVPNooGjcNJDDsBXivrKxbxhxTZFuQaeDnbbScelGEvtjpvwcbThBeXfeSobUCjZcAayAHSxiTYgnGNnatCWvaLmNbafgKGFvxraUjecosumeGnOFKxyBXzUFmFwyWxxuHXOUwMEHtrfvFVqttFIFmZkQuOLcbKxGbVIBSkmAmldvMBuDMPuVUZbJpvWZjHawvTQxpzHjuIOdOGExZgmITteAZmaCMAHzZveEXUMNayInZDXiqOFnwDnfECpssQwAqJmJxUQlaShtfdxsLXzxMZcYbJxzSofdFfnkdGMfacIzzUkNqufTAafPsRjgGRGBdZzWWlZYAUfjVrqGTgPDVXGDtsAzcpiTTAiPJVtQACMTfDEZYHRtwQYGaEqIkVGpmxWrUETAcQKFgbGkzxtB"
}

update_avatar_valid = {
    "type": "Avatar",
    "content": "https://duckduckgo.com/i/99775e07.png"
}

update_avatar_invalid = {
    "type": "Avatar",
    "content": "AczaorHPuatSZerpxkoOBxGPvibamPDoFcWiBXYWDRuuArennwMsKNXXZYtodytRPZLDEitYuTvohZPkAuzcXPegAwsFaeBRLvJqdhhfVqaTisGqLcFUESQQzhEwjVMEwLmzHuOQgjmljIcgBhVTiupPokSEeOZjdCjYRdhpwBqvsATjJgxhytnAhYFWjqKkPTNeWGxcXJOvTbrxOHnQUAEczuvWMTiulglYETJnBepClSrbyCZQszjVNDFsIrGDXmHbiPudhqqPYANOEHdYSjVkSWbvspHLbIBXonYLJdfHWVryUSaVxnSGdXUohOsyrAjtgFwjSkHuPfxJjbxMALzOorNxpEJdbcaErVeFVvrBTVSXOEcFbgLfpPEEbzBWuFmofVtCnqLiXrhpWUuotPxpsxLSilDDeZDHlKaRXNhMJFScoIthsJBSczVnpQyIyBgXQjGqVQbHEJyjLvuukDmJLIkLTAMCRMYWyItKzUnjBCXpiyeGLEqYJzwUdumMblPUZFJUwrSdJrMvLBbdTnRpviYFrerZSciRkAjqqHbaXriedqrmgiqEqWYzUZDCVHWrOfsWqmnmXYSpiqLQVPNooGjcNJDDsBXivrKxbxhxTZFuQaeDnbbScelGEvtjpvwcbThBeXfeSobUCjZcAayAHSxiTYgnGNnatCWvaLmNbafgKGFvxraUjecosumeGnOFKxyBXzUFmFwyWxxuHXOUwMEHtrfvFVqttFIFmZkQuOLcbKxGbVIBSkmAmldvMBuDMPuVUZbJpvWZjHawvTQxpzHjuIOdOGExZgmITteAZmaCMAHzZveEXUMNayInZDXiqOFnwDnfECpssQwAqJmJxUQlaShtfdxsLXzxMZcYbJxzSofdFfnkdGMfacIzzUkNqufTAafPsRjgGRGBdZzWWlZYAUfjVrqGTgPDVXGDtsAzcpiTTAiPJVtQACMTfDEZYHRtwQYGaEqIkVGpmxWrUETAcQKFgbGkzxtBe"
}

update_invalid_type = {
    "type": "Soul",
    "content": "I am a robot, I have no soul. BEEP BOOP."
}

def signup(user, jar):
    return requests.post(url + 'signup', json=user, cookies=jar)

def login(user, jar):
    return requests.post(url + 'login', json=user, cookies=jar)

def logout(user, jar):
    return requests.post(url + 'logout', json=user, cookies=jar)

def deleteuser(user, jar):
    return requests.delete(url + 'users/' + user["name"], json=user, cookies=jar)

def getUser(user_name):
    return requests.get(url + 'users/' + user_name)

def updateUser(user_name, update, jar):
    return requests.put(url + 'users/' + user_name, json=update, cookies=jar)

def getCount():
    return requests.get(url + 'getCount')

def getAllUsers():
    return requests.get(url + 'getAllUsers')

def resetUsers():
    # Clears the "user_payload" valid user
    response = login(user_payload, None)
    jar = response.cookies
    response = deleteuser(user_payload, jar)

    # Clears the "user_payload_2" valid user
    response = login(user_payload_2, None)
    jar = response.cookies
    response = deleteuser(user_payload_2, jar)

def createValidUsers():
    # Signs up "user_payload"
    signup(user_payload, None)

    # Signs up "user_payload_2"
    signup(user_payload_2, None)

class TestSignup:
    # Run this before any other tests, as it also clears all of the valid users
    def test_signup_valid(self):
        resetUsers()
        response = signup(user_payload, None)
        assert response.status_code == 200

    def test_signup_mismatch_email(self):
        # test valid signup
        response =  signup(user_invalid_confEmail, None)
        assert response.json()["msg"] == "Email and confirm email do not match"
        assert response.status_code == 401

    def test_signup_mismatch_password(self):
        response = signup(user_invalid_confPassword, None)
        assert response.json()["msg"] == "Password and confirm password do not match"
        assert response.status_code == 401
    
    def test_signup_invalid_email(self):
        response = signup(user_invalid_email, None)
        assert response.json()["msg"] == "Invalid email format was entered"
        assert response.status_code == 400

    def test_signup_dup_name(self):
        createValidUsers()
        response = signup(user_invalid_dup_name, None)
        assert response.json()["msg"] == "User already exists"
        assert response.status_code == 409

    def test_signup_dup_email(self):
        createValidUsers()
        response = signup(user_invalid_dup_email, None)
        assert response.json()["msg"] == "Email is already in use"
        assert response.status_code == 409
    
    def test_signup_logged_in(self):
        createValidUsers()
        response = login(user_payload, None)
        jar = response.cookies
        assert response.status_code == 200
        response = signup(user_payload_2, jar)


class TestLogin:
    jar = ""
    def test_login_invalid_name(self):
        # test login with email that isn't connected to a user -- invalid functionality
        response = login(user_login_badName, None)
        assert response.json()["msg"] == "Name or password is incorrect"
        assert response.status_code == 401

    def test_login_invalid_password(self):
        # test login with a correct email->user but incorrect password -- invalid functionality
        response = login(user_login_badPassword, None)
        assert response.json()["msg"] == "Name or password is incorrect"
        assert response.status_code == 401

    # Test login with correct credentials -- valid functionality
    def test_login_valid(self):
        createValidUsers()
        response = login(user_payload, None)
        assert response.status_code == 200
    
    # Tests trying to log in while already logged in
    def test_login_already_logged_in(self):
        createValidUsers()
        response = login(user_payload, None)
        jar = response.cookies
        response = login(user_payload_2, jar)
        assert response.status_code == 404
        assert response.json()["msg"] == "You are already logged in. Please log out before using a different account."
 

class TestLogout:
    # test logout with logged in user
    def test_logout_valid(self):
        createValidUsers()
        response = login(user_payload, None)
        jar = response.cookies
        response = logout(user_payload, jar)
        jar = response.cookies
        assert response.status_code == 200

    # test logout with no logged in user 
    def test_logout_invalid(self):
        response = logout(user_payload, None)
        assert response.status_code == 401

class TestDelete:
    def test_delete_other_user(self):
        createValidUsers()
        # Tests trying to delete a user other than yourself
        count1 = getAllUsers().json()["count"]
        response = login(user_payload, None)
        jar = response.cookies
        response = deleteuser(user_payload_2, jar)

        count2 = getAllUsers().json()["count"]
        assert response.status_code == 403
        assert response.json()["msg"] == "You can only edit your own data. Please refresh the page and try again"
        assert (count1) == (count2)

    # Tests trying to delete a user that doesn't exist
    def test_delete_invalid_user(self):
        createValidUsers()
        count1 = getAllUsers().json()["count"]
        response = login(user_payload, None)
        jar = response.cookies
        response = deleteuser(user_login_badName, jar)

        count2 = getAllUsers().json()["count"]
        assert response.status_code == 404
        assert (count1) == (count2)

    # Tests trying to delete a user while logged out
    def test_delete_logged_out(self):
        createValidUsers()
        count1 = getAllUsers().json()["count"]
        response = deleteuser(user_payload, None)

        count2 = getAllUsers().json()["count"]
        assert response.status_code == 401
        assert (count1) == (count2)

    # Tests deleting an account as intended
    def test_delete_valid(self):
        createValidUsers()
        count1 = getAllUsers().json()["count"]
        response = login(user_payload, None)
        jar = response.cookies
        response = deleteuser(user_payload, jar)

        count2 = getAllUsers().json()["count"]
        assert response.status_code == 200
        assert (count1) > (count2)

class TestGetUser:
    # Only tests if GetUser returns a valid username for the user it is getting
    def test_getUser_valid(self):
        createValidUsers()
        response = getUser(user_payload["name"])
        assert response.status_code == 200

        # The information returned from the response
        user = response.json()
        assert user["name"] == user_payload["name"]

class TestUpdateUser:

    # Tests if a bio 1000 characters long will be considered valid
    def test_updateUser_bio_valid_long(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], update_bio_valid_long, jar)
        assert response.status_code == 200
        assert response.json()["msg"] == update_bio_valid_long["type"] + " has been successfully updated!"
    
    # Tests to see if a bio will successfully update. Utilizes getUser to check 
    def test_updateUser_bio_valid(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], update_bio_valid, jar)
        assert response.status_code == 200
        assert response.json()["msg"] == update_bio_valid["type"] + " has been successfully updated!"
        
        assert getUser(user_payload["name"]).json()["bio"] == update_bio_valid["content"]
    
    # Tests if a bio longer than 1000 characters will be considered invalid
    def test_updateUser_bio_invalid(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], update_bio_invalid_long, jar)
        assert response.status_code == 413
        assert response.json()["msg"] == update_bio_invalid_long["type"]+ " has exceeded the character limit"
    
    # Tests to see if an avatar will successfully update. Utilizes getUser to check 
    def test_updateUser_avatar_valid(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], update_avatar_valid, jar)
        assert response.status_code == 200
        assert response.json()["msg"] == update_avatar_valid["type"] + " has been successfully updated!"

        assert getUser(user_payload["name"]).json()["avatar"] == update_avatar_valid["content"]
    
    # Tests if an avatar longer than 1000 characters will be considered invalid
    def test_updateUser_avatar_invalid(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], update_avatar_invalid, jar)
        assert response.status_code == 413
        assert response.json()["msg"] == update_avatar_invalid["type"]+ " has exceeded the character limit"

    # Tests if a request with no fields will be considered valid
    def test_updateUser_noFields(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], None, jar)
        assert response.status_code == 400
        response.json()["msg"] == "Please specify the name of the data you wish to modify."

    # Tests to see if a user can update data while logged in to the wrong account
    def test_updateUser_wrongCookies(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload_2["name"], update_bio_valid, jar)
        assert response.status_code == 403
        response.json()["msg"] == "You can only edit your own data"

    # Tests to see if a user can update a type of data that doesn't exist
    def test_updateUser_invalidType(self):
        createValidUsers()
        jar = login(user_payload, None).cookies
        response = updateUser(user_payload["name"], update_invalid_type, jar)
        assert response.status_code == 400
        assert response.json()["msg"] == update_invalid_type["type"]+ " is not a valid data field"

    def test_updateUser_notLoggedIn(self):
        createValidUsers()
        response = updateUser(user_payload["name"], update_bio_valid, None)
        assert response.status_code == 401

    
    




        
    

