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



