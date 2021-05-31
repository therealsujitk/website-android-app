# Hello World

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=website-android-app) ![License](https://img.shields.io/badge/license-MIT-blue)

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

### Usage

This application can be deployed to [Vercel](http://vercel.com) by clicking the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftherealsujitk%2Fwebsite-android-app)

### Badge

To display a badge containing the latest version name, use the following:

![Release](https://img.shields.io/badge/dynamic/json?color=blue&label=release&query=version-name&url=http://website-android-app.vercel.app/about.json)

```sh
![Release](https://img.shields.io/badge/dynamic/json?color=blue&label=release&query=version-name&url={DOWNLOAD_PAGE}/about.json)
```

Replace `{DOWNLOAD_PAGE}` with the url to your download page.

**Note:** The route [`http://localhost/about.json`](http://localhost/about.json) can be used to check if the client is using the latest version of the app.
