[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# AuctiX
Online auction platform
# Formating
Prettier is configured to format the staged files and commit. using husky pre-commit hook
to skip the formatting use the `git commit` with `-n` or `--no-verify` flag also add files to .prettierignore file to ignore the formatting



# Setup

## Backend setup

#### Pre-requisites
- Java 21
- Maven
- Docker

#### Running the backend

1. Change directory to backend
```shell
cd backend
```

2. Start the docker container for the database
```shell
docker compose up
```

3. Run the backend
```shell
./mvnw spring-boot:run 
```

#### Creating migrations for the database using Flyway

Flyway is used to manage the database migrations in AuctiX application.

The migrations are stored in the `backend/src/main/resources/db/migration` directory.

The migrations should be created in the following format:
```
V{version}__{description}.sql
```

Example: 
- `V1__create_user_table.sql`

    ```sql
    CREATE TABLE user (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    ```

 
- `V2__add_profile_pic_url_col_to_user_table.sql` 
    
    ```sql
    ALTER TABLE user
    ADD COLUMN profile_pic_url VARCHAR(255);
    ```


The migrations will be applied to the database when the application is started.
