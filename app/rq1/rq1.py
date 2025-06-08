"""
author: @guu8hc
"""

#pylint: disable=line-too-long

from flask import render_template, jsonify

from app.model import model_rq1, packages
from app.settings import get_settings

from . import rq1_bp

@rq1_bp.route('/')
def rq12_endpoint():
    """
    endpoint for rq1
    """
    return render_template('rq1/rq1.html')

@rq1_bp.route('/data')
def rq12_data_endpoint():
    """
    endpoint to get data for rq1
    """
    settings = get_settings()
    return jsonify({'packages': packages, 'headers': model_rq1.get_headers(), 'data': model_rq1.get_all_items(), 'settings': settings})

@rq1_bp.route('/data/<package>', methods=['GET'])
def rq12_data_package_endpoint(package):
    """
    endpoint to get data for a specific package
    :param package: name of the package
    """
    if package == 'Alle':
        return jsonify({'packages': packages, 'headers': model_rq1.get_headers(), 'data': model_rq1.get_all_items()})
    return jsonify({'packages': packages, 'headers': model_rq1.get_headers(), 'data': model_rq1.get_entry_by_project(package)})

@rq1_bp.route('/v2')
def rq1v2_endpoint():
    """
    endpoint for rq1
    """
    return render_template('rq1/v2.html')
