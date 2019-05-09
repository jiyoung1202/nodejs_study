var express = require('express');
var router = express.Router();
const jsontocsv = require('json2csv').parse;
const fs = require('fs');
const crypto = require('crypto');
const csv = require('csvtojson');


router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    var check;
    csv().fromFile('./public/csv/board.csv')
        .then(function (formData) {
            formData.forEach(function (form, index, array) {
                if (form.id == id) {
                    check = 1;
                    const data = {
                        'id': form.id,
                        'title': form.title,
                        'content': form.content
                    }
                    res.send(data);
                    console.log(data);
                }
            })
            if (check == undefined)
                console.log(err);
        })
});

router.post('/', function (req, res, next) {
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    const password = req.body.password;
    var salt;
    var hashedStr;
    if (!title || !content || !password || !id) {
        res.send("contents is required");
        console.log(err);
    } else {
        crypto.randomBytes(32, (err, buf) => {
            if (err) {
                console.log(err);
            } else {
                salt = buf.toString('base64');
                crypto.pbkdf2(password, salt, 10, 32, 'SHA512', (err, result) => {
                    if (err) {
                        res.send("fail");
                    } else {
                        hashedStr = result.toString('base64');
                    }
                });
            }
        });
        csv().fromFile('./public/csv/board.csv')
            .then(function (articleData) {
                const data = {
                    "id": id,
                    "title": title,
                    "content": content,
                    "createdTime": new Date().toISOString().slice(0, 10).replace(/-/g, ""),
                    "password": hashedStr,
                    "salt": salt
                };
                articleData.push(data);
                const csv = jsontocsv(articleData, {
                    fields: ["id", "title", "content", "createdTime", "password", "salt"]
                });
                fs.writeFileSync('./public/csv/board.csv', csv, {
                    encoding: 'utf8',
                    flag: 'w'
                });
                res.send("data is saved");
            });
    }
});

router.put('/', function (req, res, next) {
    const id = req.body.id;
    const password = req.body.password;
    const title = req.body.title;
    const content = req.body.content;
    var count = 0;
    csv().fromFile('./public/csv/board.csv')
        .then(function (formData) {
            formData.forEach(function (form, index, array) {
                if (form.id == id) {
                    count += 1;
                    crypto.pbkdf2(password, form.salt, 10, 32, 'SHA512', (err, result) => {
                        if (result.toString('base64') === form.password) {
                            if (title)
                                form.title = title;
                            if (content)
                                form.content = content;
                            const csv = jsontocsv(articleData, {
                                fields: ["id", "title", "content", "createdTime", "password", "salt"]
                            });
                            fs.writeFileSync('./public/csv/board.csv', csv, {encoding: 'utf8',flag: 'w'});
                            res.send("updated");
                        } else {
                            res.send("incorrect password");
                        }
                    });
                }
            });
            if (count == 0)
                res.send('no id or no data contains this id');
        })
        .catch(function (err) {
            console.error(err);
        });
});

router.delete('/', function (req, res, next) {
    const id = req.body.id;
    const password = req.body.password;
    var count = 0;
    csv().fromFile('./public/csv/board.csv')
        .then(function (formData) {
            formData.forEach(function (form, index, array) {
                if (form.id == id) {
                    count += 1;
                    crypto.pbkdf2(password, form.salt, 10, 32, 'SHA512', (err, result) => {
                        if (result.toString('base64') === article.password) {
                            formData.splice(index, 1);
                            const csvData = jsontocsv(formData, {
                                fields: ["id", "title", "content", "createdTime", "password", "salt"]
                            });
                            fs.writeFileSync('./public/csv/board.csv', csvData, {encoding: 'utf8',flag: 'w'});
                            res.send("deleted");
                        } else {
                            res.send("wrong password");
                        }
                    })
                }
            })
            if (count == 0)
                res.send('no data contains this id');
        })
        .catch(function (err) {
            console.error(err);
        });
});

module.exports = router;
