from flask import Blueprint

development_bp = Blueprint('development', __name__, template_folder='templates', static_folder='static')

from . import development
