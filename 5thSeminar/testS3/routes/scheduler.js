var express = require('express');
var router = express.Router();

const moment = require('moment');
const cron = require('node-cron');

cron.schedule('*/1 * * * *', () => {
    console.log("1분마다 실행");
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
    console.log(`신입생 OT 이후 ${moment().diff(moment('2019-03-23'),"days")}일 지남`);//기준시간으로부터 몇일이 지났는지 알려줌..
})

cron.schedule('*/10 * * * *', () => {
    console.log('10분마다 실행');
    console.log(`30일 후 날짜 => ${moment().add(30,"days").format("YYYY년 MM월 D일")}`)
})

module.exports = router;