from flask import render_template, jsonify

from . import rq1_bp

from app.model import model_rq1, packages


@rq1_bp.route('/')
def rq12_endpoint():
    return render_template('rq1/rq1.html')

@rq1_bp.route('/data')
def rq12_data_endpoint():
    return jsonify({'packages': packages, 'headers': model_rq1.get_headers(), 'data': model_rq1.get_all_items()})

@rq1_bp.route('/data/<package>', methods=['GET'])
def rq12_data_package_endpoint(package):
    if package == 'Alle':
        return jsonify({'packages': packages, 'headers': model_rq1.get_headers(), 'data': model_rq1.get_all_items()})
    return jsonify({'packages': packages, 'headers': model_rq1.get_headers(), 'data': model_rq1.get_entry_by_project(package)})