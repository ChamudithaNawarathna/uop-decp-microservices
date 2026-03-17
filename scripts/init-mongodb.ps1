# MongoDB Database Initialization Script for Windows
# This script creates the required databases for Messaging and Notification services

Write-Host "Creating MongoDB databases for DECP Microservices..." -ForegroundColor Yellow

# Create decp_messaging database
Write-Host "Creating decp_messaging database..." -ForegroundColor Cyan
$cmd = @'
db = db.getSiblingDB("decp_messaging");
db.conversations.insertOne({_id: "init_messaging", createdAt: new Date()});
print("Collection created");
'@

docker exec decp-mongodb mongosh `
  --username root `
  --password rootpassword `
  --authenticationDatabase admin `
  --eval $cmd 2>&1 | Select-String "Collection"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Created decp_messaging database successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  May need to retry - check MongoDB status" -ForegroundColor Yellow
}

# Create decp_notifications database
Write-Host "`nCreating decp_notifications database..." -ForegroundColor Cyan
$cmd2 = @'
db = db.getSiblingDB("decp_notifications");
db.notifications.insertOne({_id: "init_notifications", createdAt: new Date()});
print("Collection created");
'@

docker exec decp-mongodb mongosh `
  --username root `
  --password rootpassword `
  --authenticationDatabase admin `
  --eval $cmd2 2>&1 | Select-String "Collection"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Created decp_notifications database successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  May need to retry - check MongoDB status" -ForegroundColor Yellow
}

Write-Host "`n✨ MongoDB initialization complete!" -ForegroundColor Yellow
