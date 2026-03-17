# Initialize all databases for DECP microservices
# This script creates all PostgreSQL and MongoDB databases

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DECP Database Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# PostgreSQL Configuration
$PG_HOST = "localhost"
$PG_PORT = 5433
$PG_USER = "decp_user"
$PG_PASSWORD = "decp_password"
$PG_ADMIN_USER = "postgres"

# MongoDB Configuration
$MONGO_HOST = "localhost"
$MONGO_PORT = 27018
$MONGO_USER = "root"
$MONGO_PASSWORD = "rootpassword"
$MONGO_AUTH_DB = "admin"

# PostgreSQL databases
$PG_DATABASES = @(
    "decp_user_db",
    "decp_job_db",
    "decp_event_db",
    "decp_research_db",
    "decp_mentorship_db",
    "decp_analytics_db"
)

# MongoDB databases
$MONGO_DATABASES = @(
    "decp_posts",
    "decp_messaging",
    "decp_notifications"
)

# ====== POSTGRESQL SETUP ======
Write-Host "`n>>> Creating PostgreSQL Databases..." -ForegroundColor Yellow

foreach ($db in $PG_DATABASES) {
    Write-Host "  Creating database: $db" -ForegroundColor Gray
    
    $createDbScript = @"
CREATE DATABASE "$db" OWNER "$PG_USER" ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
GRANT ALL PRIVILEGES ON DATABASE "$db" TO "$PG_USER";
"@
    
    try {
        $createDbScript | docker exec -i decp-postgres psql -U $PG_ADMIN_USER -h localhost 2>&1 | Out-Null
        Write-Host "    [OK] Database '$db' created/verified" -ForegroundColor Green
    }
    catch {
        Write-Host "    [WARN] Error creating database '$db': $_" -ForegroundColor Yellow
    }
}

# ====== MONGODB SETUP ======
Write-Host "`n>>> Creating MongoDB Databases..." -ForegroundColor Yellow

foreach ($db in $MONGO_DATABASES) {
    Write-Host "  Creating database: $db" -ForegroundColor Gray
    
    # MongoDB requires at least one collection to create a database
    # We'll create a system.indexes collection placeholder
    $mongoCmd = @"
use $db
db.createCollection('system.indexes')
db.system.indexes.deleteMany({})
"@
    
    try {
        $mongoCmd | docker exec -i decp-mongodb mongosh --host localhost --port 27017 -u $MONGO_USER -p $MONGO_PASSWORD --authenticationDatabase $MONGO_AUTH_DB 2>&1 | Out-Null
        Write-Host "    [OK] Database '$db' created/verified" -ForegroundColor Green
    }
    catch {
        Write-Host "    [WARN] Error creating MongoDB database '$db': $_" -ForegroundColor Yellow
    }
}

# ====== VERIFICATION ======
Write-Host "`n>>> Verifying Databases..." -ForegroundColor Yellow

# Verify PostgreSQL
Write-Host "`n  PostgreSQL Databases:" -ForegroundColor Cyan
try {
    $pgDbList = @"
SELECT datname FROM pg_database WHERE datname LIKE 'decp_%' ORDER BY datname;
"@
    $pgDbList | docker exec -i decp-postgres psql -U $PG_ADMIN_USER -h localhost | Select-String "decp_"
}
catch {
    Write-Host "    Error verifying PostgreSQL databases: $_" -ForegroundColor Red
}

# Verify MongoDB
Write-Host "`n  MongoDB Databases:" -ForegroundColor Cyan
try {
    $mongoDbList = "show dbs"
    $mongoDbList | docker exec -i decp-mongodb mongosh --host localhost --port 27017 -u $MONGO_USER -p $MONGO_PASSWORD --authenticationDatabase $MONGO_AUTH_DB | Select-String "decp_"
}
catch {
    Write-Host "    Error verifying MongoDB databases: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Database Initialization Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Rebuild services: mvnw clean package -DskipTests" -ForegroundColor Gray
Write-Host "  2. Restart services: task run" -ForegroundColor Gray
