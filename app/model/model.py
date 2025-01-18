"""
docstring
"""

import sqlite3
import random


class DBModel:
    """
    docstring
    """
    def __init__(self, db=None):
        """
        Constructor
        """
        self.db = db
        self.DEBUG = False

        if self.db is not None:
            self.connection = sqlite3.connect(self.db, check_same_thread=False)
            self.cursor = self.connection.cursor()

            query_existing_tables = 'SELECT name FROM sqlite_master WHERE type="table"'

            self.cursor.execute(query_existing_tables)
            self.table_name = str(self.cursor.fetchone()[0])

    # DEPRECATED
    # def setup_db(self, db):
    #     """
    #     set_db
    #     """
    #     self.db = db
    #     if self.db is not None:
    #         self.connection = sqlite3.connect('data.db')
    #         self.cursor = self.connection.cursor()

    #         query_existing_tables = 'SELECT name FROM sqlite_master WHERE type="table"'

    #         self.cursor.execute(query_existing_tables)
    #         self.table_name = str(self.cursor.fetchone()[0])

    def get_headers(self):
        """
        get headers alternative
        """
        query_headers = f'SELECT * FROM {self.table_name}'

        if self.DEBUG:
            print(f'[GUU8HC] Query: {query_headers}')

        self.cursor.execute(query_headers)
        headers = [description[0] for description in self.cursor.description]
        return headers

    # DEPRECATED
    # def get_headers(self):
    #     """
    #     (on-going) get headers
    #     """
    #     # query_headers = f'select group_concat(name, "|") from pragma_table_info("{self.table_name}")'
    #     query_headers = f'select name from pragma_table_info("{self.table_name}")'
    #     self.cursor.execute(query_headers)
    #     headers = self.cursor.fetchall()
    #     return headers

    def get_all_items(self):
        """
        get all data
        """
        query_select_all = f'SELECT * FROM {self.table_name}'

        if self.DEBUG:
            print(f'[GUU8HC] Query: {query_select_all}')

        self.cursor.execute(query_select_all)
        rows = self.cursor.fetchall()
        return rows

    def get_entry_by_id(self, id):
        """
        get data by name
        """
        # query_select_by_product_team = f'SELECT * FROM {self.table_name} WHERE Team like "%{team}%"'
        query_select_item_by_id = f'SELECT * FROM {self.table_name} WHERE shorttitle="{id}";'

        if self.DEBUG:
            print(f'[DEBUG] Query: {query_select_item_by_id}')

        self.cursor.execute(query_select_item_by_id)
        rows = self.cursor.fetchall()

        return random.choice(rows)
    
    def get_entry_by_header(self, header, value):
        """
        get data by name
        """
        query_select_item_by_header = f'SELECT * FROM {self.table_name} WHERE {header}="{value}"'

        if self.DEBUG:
            print(f'[DEBUG] Query: {query_select_item_by_header}')

        self.cursor.execute(query_select_item_by_header)
        item = self.cursor.fetchone()
        return item

    def get_entry_by_project(self, project):
        """
        get data by name
        """
        query_select_item_by_project = f'SELECT * FROM {self.table_name} WHERE project="{project}"'

        if self.DEBUG:
            print(f'[DEBUG] Query: {query_select_item_by_project}')

        self.cursor.execute(query_select_item_by_project)
        rows = self.cursor.fetchall()
        return rows
    
    def insert_entry(self, data):
        """
        insert data
        """
        query_insert_item = f'INSERT INTO {self.table_name} VALUES ({", ".join(["?"] * len(data))})'

        if self.DEBUG:
            print(f'[DEBUG] Query: {query_insert_item}', data)

        self.cursor.execute(query_insert_item, data)

        # Commit changes and close the connection
        self.connection.commit()
        # self.connection.close()

    def remove_entry_by_id(self, id_column, id):
        """
        remove data
        """
        query_delete_item_by_id = f'DELETE FROM {self.table_name} WHERE {id_column}="{id}"'

        if self.DEBUG:
            print(f'[DEBUG] Query: {query_delete_item_by_id}')

        self.cursor.execute(query_delete_item_by_id)

        # Commit changes and close the connection
        self.connection.commit()
        # self.connection.close()
