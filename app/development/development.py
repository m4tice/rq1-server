from flask import render_template, jsonify

from . import development_bp
from app.authenticator import authenticator_instance

@development_bp.route('/login')
def login():
    return render_template('development/login.html')

@development_bp.route('/login/<username>/<password>', methods=['GET'])
def authenticate(username, password):
    result = authenticator_instance.authenticate(username, password)
    return jsonify({'result': result})

@development_bp.route('/register/<username>/<password>', methods=['GET'])
def register(username, password):
    data_package = [username, username, password]
    result = authenticator_instance.register(data_package)
    return jsonify({'result': result})