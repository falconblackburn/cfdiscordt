FROM falcon1738/rootthebox-app:latest

# Copy your database
COPY ./rootthebox.db /opt/rtb/files/rootthebox.db

# Create FINAL working startup script
RUN cat > /start.sh << 'SCRIPT_EOF'
#!/bin/bash

echo "=========================================="
echo "CREATING ADMIN USER"
echo "=========================================="

# Create admin user with correct database structure
python3 -c "
import sqlite3
import hashlib
from datetime import datetime

conn = sqlite3.connect('/opt/rtb/files/rootthebox.db')
cursor = conn.cursor()

# Check if admin exists using _handle column
cursor.execute('SELECT * FROM user WHERE _handle=\"admin\"')
if not cursor.fetchone():
    print('Creating admin user...')
    password_hash = hashlib.sha256('admin123'.encode()).hexdigest()
    
    # Insert admin user with correct columns
    cursor.execute('''
        INSERT INTO user (
            created, _handle, _name, _email, password, 
            _locked, logins, money, algorithm
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        datetime.now(),  # created
        'admin',         # _handle
        'Admin User',    # _name  
        'admin@example.com',  # _email
        password_hash,   # password
        False,           # _locked
        0,               # logins
        0,               # money
        'sha256'         # algorithm
    ))
    
    conn.commit()
    print('✅ ADMIN CREATED: admin / admin123')
else:
    print('✅ ADMIN ALREADY EXISTS')

conn.close()
"

echo "=========================================="
echo "STARTING ROOTTHEBOX"
echo "=========================================="

cd /opt/rtb
exec python3 rootthebox.py
SCRIPT_EOF

RUN chmod +x /start.sh
ENTRYPOINT ["/bin/bash", "/start.sh"]
