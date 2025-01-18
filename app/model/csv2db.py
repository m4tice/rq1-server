import os
import csv
import sqlite3


class CSV2DB:
    def __init__(self, csv_file, db, table_name):
        self.csv_file = csv_file
        self.db = db
        self.table_name = table_name
        self.DEBUG = True

        # Connect to the SQLite database
        self.conn = sqlite3.connect(os.path.join("_out", self.db))
        self.cursor = self.conn.cursor()

    def convert(self):        
        # Read data from CSV file
        with open(self.csv_file, mode='r') as file:
            reader = csv.reader(file)
            data = [row for row in reader]

        # Get column names from the first row
        column_names = data[0]

        # Create table
        query = f'DROP TABLE IF EXISTS {self.table_name}'

        if self.DEBUG:
            print("[DEBUG]" + query)

        self.cursor.execute(f'DROP TABLE IF EXISTS {self.table_name}')

        query = f'CREATE TABLE {self.table_name} ({column_names[0]} TEXT PRIMARY KEY, {", ".join(column_names[1:])})'

        if self.DEBUG:
            print("[DEBUG]" + query)
            
        self.cursor.execute(query)

        # Insert data into the table
        query = f'INSERT INTO {self.table_name} VALUES ({", ".join(["?"] * len(column_names))})'

        if self.DEBUG:
            print("[DEBUG]" + query)

        self.cursor.executemany(query, data[1:])

        # Commit changes and close the connection
        self.conn.commit()
        self.conn.close()


if __name__ == '__main__':
    # User setting
    INPUT_FILE_NAME = 'user.csv'

    # Convert CSV file to database
    INPUT_FILE = os.path.join('data', INPUT_FILE_NAME)
    if os.path.isfile(INPUT_FILE):
        print(f"Converting {INPUT_FILE} to database...")
        csv2db = CSV2DB(csv_file=INPUT_FILE, db='user.db', table_name='user')
        csv2db.DEBUG = False
        csv2db.convert()
    else:
        print(f"File not found: {INPUT_FILE}")
