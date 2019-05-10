var express = require('express');
var router = express.Router();
const jsontocsv = require('json2csv').parse;
const fs = require('fs');
const crypto = require('crypto');
const csv = require('csvtojson');

//게시물 고유 id가 id인 글을 불러온다.
//parameter
router.get('/:id', async (req, res) => {
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


//게시물을 저장함.
//게시물 고유 id, 게시물제목, 게시물내용, 게시물작성시간, 게시물 비밀번호, 솔트값
// 저장시 같은 제목 글 있으면 실패 메세지 반환
//body에 data 담음.
router.post('/', async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    const password = req.body.password;
    var salt;
    var hashedStr;
    if (!title || !content || !password || !id) {
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
            .then(function (formData) {
                const data = {
                    "id": id,
                    "title": title,
                    "content": content,
                    "createdTime": new Date().toISOString().slice(0, 10).replace(/-/g, ""),
                    "password": hashedStr,
                    "salt": salt
                };
                formData.push(data);
                const csv = jsontocsv(formData, {
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


//게시물을 수정함.
//게시물 고유 id와 같은 수정된 값으로 다시 저장함.(게시물 작성시간까지 같이 수정)
router.put('/', async (req, res) => {
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
                            const csv = jsontocsv(formData, {
                                fields: ["id", "title", "content", "createdTime", "password", "salt"]
                            });
                            fs.writeFileSync('./public/csv/board.csv', csv, {encoding: 'utf8',flag: 'w'});
                            console.log('updated');
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

//게시물을 삭제.
//게시물 고유 id와 같은 게시물을 삭제함
router.delete('/', async (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    var count = 0;
    csv().fromFile('./public/csv/board.csv')
        .then(function (formData) {
            formData.forEach(function (form, index, array) {
                if (form.id == id) {
                    count += 1;
                    crypto.pbkdf2(password, form.salt, 10, 32, 'SHA512', (err, result) => {
                        if (result.toString('base64') === form.password) {
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
                res.send('error');
        })
        .catch(function (err) {
            console.error(err);
        });
});

module.exports = router;
