const express = require('express');
const app = express();
const db = require(__dirname + '/config/db');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const config = require(__dirname + '/config');
const got = require('got');

const APP_NAME = config["APP_NAME"] || "Hello World";
const TABLE_NAME = config["TABLE_NAME"] || "android_hello_world";
const APP_STRING = config["APP_STRING"] || "hello_world_";

var cache = {};

app.use('/', express.static(__dirname + '/public/'));

/*
    The Home Page
 */
app.get('/', async (req, res) => {
    if (!("downloads" in cache) && !await retrieve()) {
        error(res); return;
    }

    let file = __dirname + '/public/assets/apk/' + APP_STRING + cache["version-name"] + '.apk';

    if (!fs.existsSync(file)) {
        res.status(500).send('Sorry, the application was not found on the server. Please contact <a href="http://therealsuji.tk">@therealsujitk</a> if this issue persists.');
        return;
    }

    let size = fs.statSync(file).size;      // Getting the size in Bytes
    size /= 1000 * 1000;                    // Converting Bytes to Megabytes
    size = Math.round(size * 10) / 10       // Rounding to the first decimal
    size += " MB";                          // Adding an MB postfix
    
    let index = fs.readFileSync(__dirname + '/index.html').toString();
    index = index.replace(/\$name\$/g, APP_NAME);
    index = index.replace('$downloads$', cache["downloads"]);
    index = index.replace('$size$', size);
    index = index.replace('$updated$', cache["updated"]);
    index = index.replace('$version$', cache["version-name"]);
    
    res.status(200).send(index);
});

/*
    The page that sends the application to the client and updates the database
 */
app.get('/download', async (req, res) => {
    if (!("version-name" in cache)) {
        const table = await db.query("SELECT value FROM " + TABLE_NAME + " WHERE id = 'version-name'");

        if (table[0] == undefined) {
            error(res); return;
        }

        cache["version-name"] = table[0]['value'];
    }

    let file = __dirname + '/public/assets/apk/' + APP_STRING + cache["version-name"] + '.apk';

    let filename = path.basename(file);
    let mimetype = mime.getType(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    let filestream = fs.createReadStream(file);
    filestream.pipe(res);

    // Incrementing the number of downloads
    await db.query("UPDATE " + TABLE_NAME + " SET value = value + 1 WHERE id = 'downloads'");
});

/*
    Page to return a JSON object of the app data
 */
app.get('/about.json', async (req, res) => {
    const table = await db.query("SELECT value FROM " + TABLE_NAME + " WHERE id = 'version-code'");

    if (table[0] == undefined) {
        error(res); return;
    }

    if ((!("version-code" in cache) || cache["version-code"] != table[0]["value"]) && !await retrieve()) {
        error(res); return;
    }

    var about = {
        "name": APP_NAME,
        "version-name": cache["version-name"],
        "version-code": parseInt(cache["version-code"]),
        "last-updated": cache["updated"]
    };

    res.status(200).json(about);
});

/*
    Display a version badge for the application
 */
app.get('/version.svg*', async (req, res) => {
    if (!("version-name" in cache)) {
        const table = await db.query("SELECT value FROM " + TABLE_NAME + " WHERE id = 'version-name'");

        if (table[0] == undefined) {
            error(res); return;
        }

        cache["version-name"] = table[0]['value'];
    }

    let color = 'blue';
    let style = 'flat';
    let versionName = cache["version-name"].replace(/-/g, '--');

    let preReleases = [
        'unstable',
        'alpha', 'a',
        'beta', 'b',
        'dev',
        'rc'
    ];

    for (let i = 0; i < preReleases.length; ++i) {
        if (versionName.toLowerCase().includes(preReleases[i])) {
            color = 'orange';
            break;
        }
    }

    let query = req.query;

    if ("style" in query) {
        style = query["style"];
    }

    let url = 'http://img.shields.io/badge/release-' + versionName + '-' + color + "?style=" + style;

    try {
		const response = await got(url);
        res.setHeader('Content-type', 'image/svg+xml');
		res.status(200).send(response.body);
	} catch (error) {
        res.status(500).send('Internal Server Error. Please contact <a href="http://therealsuji.tk">@therealsujitk</a> if this issue persists.<br>');
	}
});

/*
    Display a downloads badge for the application
 */
app.get('/downloads.svg*', async (req, res) => {
    if (!("downloads" in cache)) {
        const table = await db.query("SELECT value FROM " + TABLE_NAME + " WHERE id = 'downloads'");

        if (table[0] == undefined) {
            error(res); return;
        }

        cache["downloads"] = table[0]['value'];
    }

    let color = 'brightgreen';
    let style = 'flat';

    if (cache["downloads"] < 1000) {
        color = 'green';
    }

    let query = req.query;

    if ("style" in query) {
        style = query["style"];
    }

    let url = 'http://img.shields.io/badge/downloads-' + cache["downloads"] + '-' + color + "?style=" + style;

    try {
		const response = await got(url);
        res.setHeader('Content-type', 'image/svg+xml');
		res.status(200).send(response.body);
	} catch (error) {
        res.status(500).send('Internal Server EInternal Server Errorrror. Please contact <a href="http://therealsuji.tk">@therealsujitk</a> if this issue persists.<br>');
	}
});

/*
    404 - Page not found
 */
app.get('/*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

/*
    Function to retrieve all data from the database
 */
async function retrieve() {
    const table = await db.query("SELECT * FROM " + TABLE_NAME);

    if (table[0] == undefined) {
        return false;
    }
        
    for (let i = 0; i < table.length; ++i) {
        if (table[i]['id'] == 'downloads') {
            cache["downloads"] = table[i]['value'];
        } else if (table[i]['id'] == 'updated') {
            cache["updated"] = table[i]['value'];
        } else if (table[i]['id'] == 'version-name') {
            cache["version-name"] = table[i]['value'];
        } else if (table[i]['id'] == 'version-code') {
            cache["version-code"] = table[i]['value'];
        }
    }

    return true;
}

/*
    Function to respond with a database error
 */
function error (res) {
    res.status(500).send('Sorry, we could not connect to the database. Please contact <a href="http://therealsuji.tk">@therealsujitk</a> if this issue persists.');
}

module.exports = app;
