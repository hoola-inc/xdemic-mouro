#### Xdemic Config for Mouro

```sh
PG_URL=https://api.elephantsql.com/console/fe066b29-15c4-4f84-ba92-562b30809edc/details?
INFURA_PROJECT_ID=02a558d6e1ad4770ac62cc73e623116a
HEROKU_URL=https://mouro.herokuapp.com/graphql

```

#### For Local Setup
Set ENV Var on Bash

```sh 
export INFURA_PROJECT_ID="value"
export PORT="value"
export PG_URL="value"  

```

For Infura project id goto https://infura.io

- create project
- click on view project 
- copy find project id 

For cloud postgres goto https://www.elephantsql.com/
- signIn using github or google account
- create db 
- click on db instance 
- goto details from left navbar 
- copy URL 

For first transaction 
- ``` cd to  dev-scripts ``` from project root 
- then execute ``` node create-newman-env.js ```
- now you will get object with all required data for first transaction