# Scalability Guide

## Dynamic Permissions
The permission system is designed to be database-driven.
- **Adding Permissions**: Insert new rows into `permissions` table. No code deploy required for backend enforcement.
- **Role Assignment**: Dynamic mapping allowing rapid creation of custom roles.

## Feature Flags
Use `system_settings` table to toggle features.