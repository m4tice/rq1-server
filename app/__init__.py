from flask import Flask

def create_app():
    app = Flask(__name__)
    app.debug = True

    from .development import development_bp
    app.register_blueprint(development_bp, url_prefix='/development')

    from .rq1 import rq1_bp
    app.register_blueprint(rq1_bp, url_prefix='/rq1')

    return app