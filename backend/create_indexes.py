import sqlite3

# Connect to database
conn = sqlite3.connect('indohomz.db')
c = conn.cursor()

print("Creating performance indexes...")

# Properties indexes
c.execute('CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city)')
c.execute('CREATE INDEX IF NOT EXISTS idx_properties_is_available ON properties(is_available)')
c.execute('CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type)')
c.execute('CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at)')
c.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug)')
c.execute('CREATE INDEX IF NOT EXISTS idx_properties_city_available ON properties(city, is_available)')

# Leads indexes
c.execute('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)')
c.execute('CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id)')
c.execute('CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)')
c.execute('CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone)')
c.execute('CREATE INDEX IF NOT EXISTS idx_leads_property_status ON leads(property_id, status)')

# Bookings indexes
c.execute('CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id)')
c.execute('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)')
c.execute('CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at)')

conn.commit()
print("✅ All 13 performance indexes created successfully!")

# Verify indexes
c.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'")
indexes = c.fetchall()
print(f"\n📊 Total indexes: {len(indexes)}")
for idx in indexes:
    print(f"   - {idx[0]}")

conn.close()
print("\n🚀 Database optimized for Phase 3!")
