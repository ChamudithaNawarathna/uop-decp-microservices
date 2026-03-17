-- Initialize all DECP PostgreSQL databases
-- This script runs automatically on first postgres container startup
-- Runs as POSTGRES_USER (decp_user), so no superuser needed

CREATE DATABASE decp_user_db;
CREATE DATABASE decp_job_db;
CREATE DATABASE decp_event_db;
CREATE DATABASE decp_research_db;
CREATE DATABASE decp_mentorship_db;
CREATE DATABASE decp_analytics_db;
