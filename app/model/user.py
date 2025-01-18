class User:
    def __init__(self, userid, username, password):
        self.userid = userid
        self.username = username
        self.password = password

    def __str__(self):
        return f'User({self.userid}, {self.username})'
