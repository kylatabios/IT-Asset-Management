USE master;

GO

CREATE LOGIN assetadmin
WITH PASSWORD = 'YOUR_DATABASE_PASSWORD';

GO

USE ITAssetManagement;

GO

CREATE USER assetadmin FOR LOGIN assetadmin;

GO  

ALTER ROLE db_owner ADD MEMBER assetadmin;

GO