from datetime import timedelta
from flask import Blueprint, json, jsonify, make_response, request
from flask.ctx import AppContext
from flask_login.utils import _get_user, decode_cookie, login_required, confirm_login
from werkzeug.datastructures import _callback_property
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db, login_manager
from flask_login import login_user, logout_user, utils, current_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm.attributes import flag_modified
import re

auth = Blueprint('auth', __name__)


# Helper functions

# Checks for valid email strings, code used is from https://www.geeksforgeeks.org/check-if-email-address-valid-or-not-in-python/
def check_email(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if re.fullmatch(regex, email):
        return True
    else:
        return False


@auth.route('/login', methods=['POST'])
def login_post():


        # Sees if any "name" was sent with the request (I.E. the user tried to login directly)
    try:
        request.json["name"]
        if current_user.is_authenticated is True:
            return make_response(jsonify(msg="You are already logged in. Please log out before using a different account."), 404)
    except:
        print("Meh")

    cookie = request.cookies.get("remember_token")
    if cookie is not None:
        returning_user_id = decode_cookie(cookie)
        if returning_user_id is not None:
            user = login_manager._load_user_from_remember_cookie(cookie)
            # If user is not found, return a response with the user's name
            try: 
                user.name
                if user.name is None:
                    return make_response(jsonify(msg=(user.name + " does not exist, please create an account")), 404)
                else:
                    if login_user(user, remember=False):
                        return make_response(jsonify(user.serialize()), 200)
            except:
                # Only likely to run when a cookie remains from a previous session after restarting the server
                # To fix, you have to go and manually delete the cookies in your browser 
                return make_response(jsonify("This cookie contains an account no longer in the system", 404))
    # Sees if any "name" was sent with the request (I.E. the user tried to login directly)
    try:
        request.json["name"]
    except:
        return make_response(jsonify(msg="No cookies/failed login attempt"), 401)

    data = request.json
    name = data["name"]
    password = data["password"]
    rememberMe = data["rememberMe"]

    user = User.get_user(name)

    # Check if the user actually exists,
    # as well as checks the user-supplied password, hashes it,
    # and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        return make_response(jsonify(msg="Name or password is incorrect"), 401)
    # If a user is logged in already, make them log out before proceeding
    if rememberMe:
        login_user(user, remember=True, duration=timedelta(days=14))
        return make_response(jsonify(user.serialize()), 200)
    elif rememberMe == False:
        login_user(user, remember=True, duration=timedelta(minutes=30))
        return make_response(jsonify(user.serialize()), 200)
    else:
        return make_response(jsonify(msg="Login failed"), 401)


@auth.route('/signup', methods=['POST'])
def signup_post():
    data = request.json
    email = data["email"]
    confEmail = data["confEmail"]
    name = data["name"]
    password = data["password"]
    confPassword = data["confPassword"]
    
    if current_user.is_authenticated:
        return make_response(jsonify(msg="You are already logged in. Please log out before using a different account."), 404)

    # Checks if the email and confEmail are the same
    if email != confEmail:
        return make_response(jsonify(msg="Email and confirm email do not match"), 401)
    # Checks if the password and confPassword are the same
    if password != confPassword:
        return make_response(jsonify(msg="Password and confirm password do not match"), 401)

    # Checks if the email was valid
    if check_email(email) is False:
        return make_response(jsonify(msg="Invalid email format was entered"), 400)

    # If this returns a user, then the email already exists in database
    user = User.query.filter_by(email=email).first()
    if user:
        return make_response(jsonify(msg="Email is already in use"), 409)

    # If this returns a user, then the user already exists in database
    user = User.query.filter_by(name=name).first()
    if user:
        return make_response(jsonify(msg="User already exists"), 409)

    new_user = User(email=email, name=name, bio="Toggle the switch below to edit your bio, then click the button next to it to save! To change your avatar, paste the link in the box above and click \"Update Avatar\"", password=generate_password_hash(password, method='sha256'), curCoins=0,
                    avatar="https://i.kym-cdn.com/photos/images/facebook/000/640/866/e59.png")

    db.session.add(new_user)
    db.session.commit()

    resp = make_response(jsonify(new_user.serialize()))
    return resp


@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    # The commented out code will only work if the "@login_required" tag fails
    if current_user.is_authenticated is False:
        return make_response(jsonify(msg="No user is logged in"), 401)
    logout_user()
    return make_response(jsonify(msg="User has been logged out"), 200)


@auth.route('/getAllUsers', methods=['GET'])
def getAllUsers():
    users = User.query.order_by(User.curCoins).all()
    list = []
    count = 0

    for user in users:
        count += 1
        list.append(user.serialize())
    
    list.reverse()

    resp = make_response(jsonify(list=list, count=count), 200)

    return resp

@auth.route('/users/<username>', methods=['PUT', 'DELETE', 'GET'])
def users(username):
    user = User.get_user(username)
    # Checks if the user exists
    if user is None:
        return make_response(jsonify(msg="User does not exist"), 404)

    # GET a user's information
    if request.method == "GET":
        # Returns the name, bio, avatar, and curation coins
        return make_response(jsonify(name=user.name, bio=user.bio, avatar=user.avatar, curCoins=user.curCoins), 200)

    # Checks if the current user is logged in
    if not current_user.is_authenticated:
        return make_response(jsonify(msg="You must be logged in to perform this action"), 401)
    data = request.json
    # User from the cookie
    userCookie = login_manager._load_user_from_remember_cookie(request.cookies.get("remember_token"))
    # Verifies the user is trying to modify their own data
    if user is userCookie:

        # DELETE a user
        if request.method == "DELETE":
            logout_user()
            User.query.filter(User.name == username).delete()
            db.session.query(User).filter(User.name == username).delete
            db.session.commit()
            # Checks if the user was successfully deleted, by looking the user up
            if User.query.filter_by(name=username).first() is None:
                resp = make_response(jsonify(msg="User has been deleted"), 200)
                # Deletes the "remember_token" cookie
                resp.set_cookie('remember_token', '', expires=0)
                return resp
            else:
                return make_response(jsonify(msg="User was not deleted"), 400)

        # PUT (updates) a user's information
        if request.method == "PUT":
            # Checks if the name of the data to be updated is specified
            try:
                type = data["type"]
                content = data["content"]
            except:
                return make_response(jsonify(msg="Please specify the name of the data you wish to modify."), 400)
            type = data["type"]
            content = data["content"]
            # Response for success
            resp_success = make_response(jsonify(msg=(type + " has been successfully updated!")), 200)
            # Response for failure
            resp_failure = make_response(jsonify(msg=(type + " has exceeded the character limit")), 413)
            # Checks for Bio
            if type == "Bio":
                # Checks length of bio
                if len(content) <= 1000:
                    db.session.query(User).filter(User.name == user.name).update({'bio': content})
                    db.session.commit()
                    return resp_success
                else:
                    return resp_failure
            # Checks for Avatar
            elif type == "Avatar":
                # Checks length of Avatar URL
                if len(content) <= 1000:
                    db.session.query(User).filter(User.name == user.name).update({'avatar': content})
                    db.session.commit()
                    return resp_success
                else:
                    return resp_failure
            elif type == "Coins":
                db.session.query(User).filter(User.name == user.name).update({'curCoins': content})
                db.session.commit()
                return resp_success
            # If no data of the associated type was found, return an error
            else:
                return make_response(jsonify(msg=(type + " is not a valid data field")), 400)
    else:
        return make_response(jsonify(msg="You can only edit your own data. Please refresh the page and try again"), 403)