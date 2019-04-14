const http = require('http');
const request = require('request');
const fs = require('fs');
const json2csv = require('json2csv');



const server = http.createServer((req,res)=> {
    const option = {
        url: "http://15.164.75.18:3000/homework/2nd",
        method:"GET"
    };//서버 request 요청 작성

    request(option, (err,response,body)=>{
        console.log(body);
        const data = JSON.parse(body).data;
        console.log(data);

        //json을 csv로 변환
        const resultCsv = json2csv.parse({
            data : data,
            fields:["time"]
        });

        fs.writeFile('info.csv', resultCsv, (err)=> {
            if(err){
                console.log(err);
            }else{
                res.write("file save complete");
                res.end();

            }
        })
    })

}).listen(3000,()=>{
    console.log("3000포트로 서버가 열렸습니다.");
});