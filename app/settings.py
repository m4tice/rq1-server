"""
author: @Goosemann
"""

# pylint: disable=line-too-long

DEBUG = True

# CSS
# BACKGROUND_URL = 'https://media.idownloadblog.com/wp-content/uploads/2021/06/macOS-Monterey-wallpaper-Dark-2048x2048.jpg'
BACKGROUND_URL = None

# Features
BILLED = True


def get_settings():
    """
    Get settings for the application.
    :return: settings dictionary
    """
    return {
        'DEBUG': DEBUG,
        'BACKGROUND_URL': BACKGROUND_URL,
        'BILLED': BILLED
    }
