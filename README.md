# rapido
A project for graphically designing restful apis

## Database configurations
### If you wish to configure local database

sudo -u postgres createdb rapido
sudo -u postgres createuser rapidoadmin

sudo -u postgres psql
alter user rapidoadmin with encrypted password 'rapidopass';
grant all privileges on database rapido to rapidoadmin;

sudo service postgresql restart

psql -d rapido -f rapido-db/init.sql
