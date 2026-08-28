SELECT
    name,
    is_disabled,
    default_database_name
FROM master.sys.sql_logins
WHERE name = 'assetadmin';