"""
Resources
"""

from .model import DBModel


# RQ1 data
DATABASE_RQ1 = 'app/model/_out/rq1.db'
model_rq1 = DBModel(DATABASE_RQ1)
model_rq1.DEBUG = True

packages = ['Alle',
            'ComServices',
            'ComVeh',
            'ComCo',
            'ComStd',
            'ComDrv',
            'ComDia',
            'ComPtc',
            'CAN',
            'FlexRay',
            'Ethernet',
            'LIN',
            'SENT']

# User data
USER_DB = 'app/model/_out/user.db'
model_user = DBModel(USER_DB)
model_user.DEBUG = True
