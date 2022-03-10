from . import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)  # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(64), nullable=False, unique=True)
    bio = db.Column(db.String(1000))
    avatar = db.Column(db.String(1000))
    # The curation points associated with a user
    curCoins = db.Column(db.Integer)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'password': self.password,
            'name': self.name,
            'bio': self.bio,
            'avatar': self.avatar,
            'curCoins': self.curCoins
        }

    def get_id(self):
        return self.id

    def get_user_flask(userid):
        # check to see if I need to decode userid first
        user = User.query.get(userid)
        return user

    def get_user(name):
        user = User.query.filter_by(name=name).first()
        return user


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    dateUploaded = db.Column(db.DateTime(False), nullable=False)
    dateCurated = db.Column(db.DateTime(False))
    userUploaded = db.Column(db.Text, nullable=False)
    userCurated = db.Column(db.Text)
    curation = db.Column(db.Text())
    comments = db.Column(db.Text())

    def serialize(self):
        return {
            'dateUploaded': self.dateUploaded,
            'dateCurated': self.dateCurated,
            'name': self.name,
            'tags': self.curation,
            'id': self.id,
            'uploader': self.userUploaded,
            'curatedBy': self.userCurated
        }

    def get_data(name):
        return Data.query.filter_by(name=name).first()

    def curate(curation):
        return Data.query.filter_by(name=curation).first()
        # update curation here

