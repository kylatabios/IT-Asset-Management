USE master;
GO

CREATE LOGIN assetadmin
WITH PASSWORD = 'AssetAdmin@12345';
GO

USE ITAssetManagement;
GO

CREATE USER assetadmin FOR LOGIN assetadmin;
GO

ALTER ROLE db_owner ADD MEMBER assetadmin;
GO