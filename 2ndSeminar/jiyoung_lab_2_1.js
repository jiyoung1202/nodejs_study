const http = require('http');
const url = require('url');//url모듈 가져옴
const querystring = require('querystring');
const crypto = require('crypto')

const server = http.createServer((request,response)=> {
    //console.log(request);
    //크립토 모듈받아서 randombyte받아서 salt생성  toString이용하여 인코딩 해주어야함.
    //base64해서 salt값에 넣어야한다. 
    //String은 helloworld
    const urlParsed = url.parse(request.url);
    const queryParsed = querystring.parse(urlParsed.query);
    const str = queryParsed.str;
    // console.log(queryParsed);
    console.log(str);

    crypto.randomBytes(32,(err, buf) => {
        if(err){
            console.log(err);
        }else{
            const salt = buf.toString('base64');
            console.log('salt : ${salt}');
            console.log(salt);
            crypto.pbkdf2(str,salt,10,32,'SHA12', (err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    const hashedStr = result.toString('base64');
                    console.log()
                }
            })
        }
    })


}).listen(3000,()=>{
    console.log("3000포트로 서버가 열렸습니다.");
});