"""
author: @GUU8HC
"""

import hashlib

from app.model import model_user

class Authenticator:
    """
    authenticator class for user authentication and registration
    """
    def __init__(self):
        """
        constructor
        """
        self.model_user = model_user

    def authenticate(self, username, password):
        """
        authenticate user with username and password
        """
        user_data = self.model_user.get_entry_by_header("username", username)
        if user_data is not None:
            return self.get_hashed_value(password) == user_data[2]
        return False

    def register(self, data):
        """
        register a new user with userid, username, and password
        """
        userid, username, password = data
        hashed_password = self.get_hashed_value(password)

        if model_user.get_entry_by_header("username", username) is None:
            try:
                model_user.insert_entry([userid, username, hashed_password])
                return True

            except Exception as e:
                return False, str(e)

        return False, "User already exists"

    def get_hashed_value(self, password):
        """
        hash the password using SHA-256
        """
        return hashlib.sha256(password.encode()).hexdigest()
