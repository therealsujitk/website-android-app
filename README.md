# Hello World

![Heroku](https://pyheroku-badge.herokuapp.com/?app=website-android-app) ![License](https://img.shields.io/badge/license-MIT-blue)

This Node.js application is a download page for your android application.

### Preview

![Screenshot](https://i.imgur.com/mcWuac2.png)

### Requirements

- Node.js 10+
- MySQL 5.2+
- Environment Variables to connect to your database:
    ```sh
    MYSQL_HOST=localhost
    MYSQL_USER=root
    MYSQL_PASSWORD=
    MYSQL_DATABASE=my_apps
    ```
- **1** SQL table to store some data related to your android application.
    ```sql
    CREATE TABLE android_hello_world (
        id VARCHAR(30) PRIMARY KEY,
        value VARCHAR(30) NOT NULL
    );
    ```
- Some pre-requisite data.
    ```sql
    INSERT INTO android_hello_world (id, value) VALUES('downloads', '0');
    INSERT INTO android_hello_world (id, value) VALUES('size', '2.8 MB');
    INSERT INTO android_hello_world (id, value) VALUES('updated', '27 February 2021');
    INSERT INTO android_hello_world (id, value) VALUES('version-code', '1');
    INSERT INTO android_hello_world (id, value) VALUES('version-name', 'v1.0.0');
    ```

### Dependencies

Install the necessary dependencies by running either of the commands below.

Using **npm**:
```sh
$ npm install
```

Using **yarn**:
```sh
$ yarn
```

### Usage

**Note:** Before running either of the commands below to start the server, install the necessary dependencies by running either of the commands above.

Using **npm**:
```sh
$ npm run start
```

Using **yarn**:
```sh
$ yarn run start
```

**Note:** The route [`http://localhost/latest`](http://localhost/latest) can be used to check if the clients is using the latest version of the app.
