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
        } else if (table[i]['id'] == 'size') {
            size = table[i]['value'];
        } else if (table[i]['id'] == 'updated') {
            updated = table[i]['value'];
        } else if (table[i]['id'] == 'version-name') {
            versionName = table[i]['value'];
        }
    }
    
    res.status(200).render('index.ejs', {
        downloads: downloads,
        version: versionName,
        updated: updated,
        size: size
    });
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
    Page for the app to check for the latest version
 */
app.get('/latest', async(req, res) => {
    const table = await db.query(escape`SELECT value FROM android_hello_world WHERE id = 'version-code'`);
    var versionCode = table[0]['value'];

    res.status(200).send('<span id="hello-world-vc">' + versionCode + '</span>');
});

/*
    404 - Page not found
 */
app.get('/*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

module.exports = app;
