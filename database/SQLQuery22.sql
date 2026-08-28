SELECT
    name,
    type_desc,
    is_disabled,
    default_database_name
FROM sys.sql_logins
WHERE name = 'assetadmin';