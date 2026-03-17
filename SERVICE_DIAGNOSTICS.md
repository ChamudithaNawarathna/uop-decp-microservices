# Service Diagnostics and Fixes

## Issue Analysis

### 1. Mentorship Service (8090) - 400 BadRequest ✅ IDENTIFIED

**Root Cause:** Missing required headers

- Endpoint `/api/mentorship/matches` requires header: `X-User-Id`
- Also requires: `X-User-Name`, `X-User-Role` for profile endpoints

**Solution:** Provide required headers in all requests

```bash
curl -H "X-User-Id: 1" http://localhost:8090/api/mentorship/matches
```

### 2. Messaging Service (8087) - 500 InternalServerError

**Root Cause:** MongoDB database `decp_messaging` does not exist

- Service tries to connect to: `mongodb://root:rootpassword@localhost:27018/decp_messaging?authSource=admin`
- This database was never initialized in MongoDB

**Solution:** Execute in MongoDB container:

```javascript
db = db.getSiblingDB("decp_messaging");
db.conversations.insertOne({ _id: "init", createdAt: ISODate() });

db = db.getSiblingDB("decp_notifications");
db.notifications.insertOne({ _id: "init", createdAt: ISODate() });
```

### 3. Notification Service (8088) - 400 BadRequest

**Root Cause:** Similar to Messaging - missing MongoDB databases OR missing request parameters

- Service tries to use: `mongodb://root:rootpassword@localhost:27018/decp_notifications?authSource=admin`
- Endpoint may also require specific query parameters

**Solution:** Initialize MongoDB database (same as Messaging Service)

## Environment Configuration Status

✅ POSTGRES Configuration: CORRECT

- HOST: localhost:5433
- USER: decp_user
- PASSWORD: decp_password
- DB: decp_db

✅ MONGODB Configuration: CORRECT (but databases missing)

- HOST: localhost:27018
- USER: root
- PASSWORD: rootpassword
- Missing DBs: decp_messaging, decp_notifications

✅ REDIS Configuration: CORRECT

- HOST: localhost (6379)

✅ RABBITMQ Configuration: CORRECT

- HOST: localhost (5672)
- USER: guest
- PASSWORD: guest

## How to Fix Each Service

### Fix 1: Mentorship Service (8090) - IMMEDIATE

**This is NOT a service error - it's a client/API usage issue**

Simply provide the required header when calling the endpoint:

```bash
# Use curl
curl -H "X-User-Id: 1" http://localhost:8090/api/mentorship/matches

# Or PowerShell
$headers = @{"X-User-Id"="1"}
Invoke-WebRequest -Uri "http://localhost:8090/api/mentorship/matches" -Headers $headers -Method Get
```

### Fix 2: Messaging Service (8087) - Setup Required

Currently returns 500 because MongoDB database doesn't exist.

**Option A - Create databases in MongoDB** (RECOMMENDED):

```bash
# Access MongoDB shell and create databases
docker-compose exec mongodb sh -c 'mongosh <<EOF
db.getSiblingDB("admin").auth("root", "rootpassword");
db = db.getSiblingDB("decp_messaging");
db.createCollection("conversations");
db = db.getSiblingDB("decp_notifications");
db.createCollection("notifications");
EOF'
```

**Option B - Update URI to use existing database** (QUICK FIX):
Edit `.env` and add:

```
MESSAGING_DB=decp_posts
NOTIFICATION_DB=decp_posts
```

Then update the corresponding `application.yml` files.

### Fix 3: Notification Service (8088) - Same as Messaging

Apply the same fix as Messaging Service (they both use MongoDB)

## Fix Verification Commands

### After Applying Fixes

```powershell
# Test Mentorship with required header
$headers = @{"X-User-Id"="1"}
Invoke-WebRequest -Uri "http://localhost:8090/api/mentorship/matches" -Headers $headers -Method Get

# Test Messaging (after DB creation)
Invoke-WebRequest -Uri "http://localhost:8087/api/conversations" -Method Get

# Test Notification (after DB creation)
Invoke-WebRequest -Uri "http://localhost:8088/api/notifications" -Method Get
```

## Status After Fixes Expected

- ✅ Mentorship: 200 OK (or 401 if auth needed)
- ✅ Messaging: 200 OK or 401 (depending on data)
- ✅ Notification: 200 OK or 401 (depending on data)
