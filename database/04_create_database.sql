SELECT 
    name,
    type_desc,
    is_disabled
FROM sys.server_principals
WHERE name = 'assetadmin';