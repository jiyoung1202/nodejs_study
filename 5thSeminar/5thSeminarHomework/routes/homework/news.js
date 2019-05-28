var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
const util = require('../../modules/utils/utils');
const statusCode = require('../../modules/utils/statusCode');
const resMessage = require('../../modules/utils/responseMessage');
const moment = require('moment');
const upload = require('../../config/multer');


router.get('/news', async(req, res) => {
    const getNewsQuery = 'SELECT * FROM news ORDER BY news_time DESC';
    const getResult = await db.queryParam_None(getNewsQuery);
    if (!getResult) {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.SELECT_FAIL));
    } else {    
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SELECT_SUCCESS, getResult));
    }
});

router.get('/news/:idx', async(req, res) => {
    const getAllContentsQuery = 'SELECT * FROM contents WHERE contents.newsIdx = ?';
    const getResult = await db.queryParam_Parse(getAllContentsQuery, [req.params.idx] );
    let contents = [];
    getResult.forEach((rawContents, index, result) => {
        contents.push((rawContents));
    });
    if (!getResult) {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.CONTENTS_SELECT_FAIL));
    } else if(getResult.length == 0) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.CONTENTS_SELECT_SUCCESS, contents));
    }
});


router.post('/news', upload.array('imgs'), async(req, res) => {
    const writer = req.body.writer;
    const title = req.body.title;
    const imgs = req.files;
    const contents = req.body.contents;
    const cutContents = req.body.contents.split("/"); //이미지에 따른 내용을 '/'(슬래시)로 구분함
    const now = moment().format('YYYY-MM-DD hh:mm:ss');
    const insertNewsQuery = `INSERT INTO news (news_writer, news_title, news_thumb, news_time) VALUES (?, ?, ?, '${now}')`;
    const insertContentsQuery = 'INSERT INTO contents (content, content_Img, newsIdx) VALUES (?, ?, ?)';

    if(imgs.length==0 || !contents || !title || !writer)
    {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }
    else {
        const thumb = imgs[0].location; //첫번째 이미지를 썸네일로 설정
        if(cutContents.length != imgs.length) //이미지개수와 썸네일 개수 동일하게 설정
        {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        else{
            const insertTransaction = await db.Transaction(async(connection) => {
                const insertNewsResult = await connection.query(insertNewsQuery, [writer, title, thumb, now]);
                newsIdx = insertNewsResult.insertId
                for(i=0; i<imgs.length ;i++) {connection.query(insertContentsQuery, [cutContents[i], imgs[i].location, newsIdx]);}   
            });
            if (!insertTransaction) {
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEWS_INSERT_FAIL));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.NEWS_INSERT_SUCCESS));
            }
        }
    }
});

module.exports = router;
