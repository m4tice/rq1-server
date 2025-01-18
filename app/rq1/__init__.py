from flask import Blueprint

rq1_bp = (Blueprint('rq1', __name__, template_folder='templates', static_folder='static'))

from . import rq1
