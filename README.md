# Hello World

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=website-android-app) ![License](https://img.shields.io/badge/license-MIT-blue)

This Node.js application is a download page for your android application.

### Preview

![Screenshot](https://i.imgur.com/mcWuac2.png)

### Requirements

- Node.js 10+
- MySQL 5.2+
- Application file names should be of the form
  ```
  {APP_STRING}{VERSION_NAME}.apk
  ```
- Environment variables
    ```sh
    MYSQL_HOST=localhost
    MYSQL_USER=root
    MYSQL_PASSWORD=
    MYSQL_DATABASE=my_apps
    TABLE_NAME=android_hello_world
    APP_STRING=hello_world_
    APP_NAME=Hello World
    ```
    **Note:** The **`APP_STRING`** for the file `hello_world_v1.0.0.apk` is `hello_world_`.
- SQL table to store data related to your android application
    ```sql
    CREATE TABLE android_hello_world (
        id VARCHAR(30) PRIMARY KEY,
        value VARCHAR(30) NOT NULL
    );
    ```
- Some pre-requisite data
    ```sql
    INSERT INTO android_hello_world (id, value) VALUES('downloads', '0');
    INSERT INTO android_hello_world (id, value) VALUES('updated', '27 February 2021');
    INSERT INTO android_hello_world (id, value) VALUES('version-code', '1');
    INSERT INTO android_hello_world (id, value) VALUES('version-name', 'v1.0.0');
    ```

### Usage

This application can be deployed to [Vercel](http://vercel.com) by clicking the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftherealsujitk%2Fwebsite-android-app)

### App Info

The route `/about.json` will return an object containing the app details.

```json
{
    "name": "Hello World",
    "version-name": "v1.0.0",
    "version-code": 1,
    "last-updated": "27 February 2021"
}
```

### Badges

Badges to display the latest release and the number of downloads.

![Release](http://website-android-app.vercel.app/release.svg) ![Downloads](http://website-android-app.vercel.app/downloads.svg)

#### HTML

```html
<img src="http://website-android-app.vercel.app/release.svg" alt="Release" />
```

```html
<img src="http://website-android-app.vercel.app/downloads.svg" alt="Downloads" />
```

#### Markdown

```markdown
![Release](http://website-android-app.vercel.app/release.svg)
```

```markdown
![Downloads](http://website-android-app.vercel.app/downloads.svg)
```

#### Parameters

- **`?style=`** - The style of the badge. Available styles: **`flat`** (Default), **`flat-square`**, **`plastic`** & **`for-the-badge`**.
