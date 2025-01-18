import sqlite3
import csv

db = 'rq1.db'
csv_file = 'rq1.csv'
table_name = 'RQ1Issues'

# Connect to the SQLite database
conn = sqlite3.connect(db)
cursor = conn.cursor()

# Fetch all data from the table
cursor.execute(f'SELECT * FROM {table_name}')
rows = cursor.fetchall()

# Get column names
column_names = [description[0] for description in cursor.description]

# Write data to CSV file
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(column_names)  # Write column headers
    writer.writerows(rows)  # Write data rows

# Close the database connection
conn.close()