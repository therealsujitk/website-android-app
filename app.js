const express = require('express');
const app = express();
const db = require(__dirname + '/config/db')
const escape = require('sql-template-strings');
const path = require('path');
const mime = require('mime');
const fs = require('fs');

app.use('/', express.static(__dirname + '/public/'));

/*
    The Home Page
 */
app.get('/', async (req, res) => {
    const table = await db.query(escape`SELECT * FROM android_hello_world`);
    var downloads, size, updated, versionName;
    
    for (var i = 0; i < table.length; ++i) {
        if (table[i]['id'] == 'downloads') {
            downloads = table[i]['value'];
        } else if (table[i]['id'] == 'updated') {
            updated = table[i]['value'];
        } else if (table[i]['id'] == 'version-name') {
            versionName = table[i]['value'];
        }
    }

    if (typeof versionName == undefined) {
        res.status(500).send('Sorry, we could not connect to the database. Please contact <a href="http://therealsuji.tk">@therealsujitk</a> if this issue persists.');
        return;
    }

    var file = __dirname + '/public/assets/apk/hello_world_' + versionName + '.apk';
    var size = fs.statSync(file).size;      // Getting the size in Bytes
    size /= 1000 * 1000;                    // Converting Bytes to Megabytes
    size = Math.round(size * 10) / 10       // Rounding to the first decimal
    size += " MB";                          // Adding an MB postfix
    
    var index = fs.readFileSync(__dirname + '/index.html').toString();
    index = index.replace('$downloads$', downloads);
    index = index.replace('$size$', size);
    index = index.replace('$updated$', updated);
    index = index.replace('$version$', versionName);
    
    res.status(200).send(index);
});

/*
    The page that sends the application to the client and updates the database
 */
app.get('/download', async(req, res) => {
    const table = await db.query(escape`SELECT value FROM android_hello_world WHERE id = 'version-name'`);
    var versionName = table[0]['value'];

    var file = __dirname + '/public/assets/apk/hello_world_' + versionName + '.apk';

    var filename = path.basename(file);
    var mimetype = mime.getType(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);

    await db.query(escape`UPDATE android_hello_world SET value = value + 1 WHERE id = 'downloads'`);
});

/*
    Page to return a JSON object of the app data
 */
app.get('/about.json', async(req, res) => {
    const table = await db.query(escape`SELECT * FROM android_hello_world`);
    var versionName, versionCode, updated;
    
    for (var i = 0; i < table.length; ++i) {
        if (table[i]['id'] == 'version-name') {
            versionName = table[i]['value'];
        } else if (table[i]['id'] == 'version-code') {
            versionCode = table[i]['value'];
        } else if (table[i]['id'] == 'updated') {
            updated = table[i]['value'];
        }
    }

    var about = {
        "name": "Hello World",
        "version-name": versionName,
        "version-code": parseInt(versionCode),
        "last-updated": updated
    };

    res.status(200).json(about);
});

/*
    404 - Page not found
 */
app.get('/*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

module.exports = app;
