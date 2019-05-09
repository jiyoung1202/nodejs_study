var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req,res)=>{
    // res.status(200).send.
    //localhost:3000/training/info/?name=이지영
    //body={name:"이지영", age:23}
    const name = req.query.name;
    const age = req.query.age;

    console.log(name);
    console.log(age);

    // const rrr = function(){
    //     return new Promise(res, rej) => {

    //     }
    // }
    // rrr().then(성공시,실패시)
    // const promiseGetcsv = (param) =>{
    //     return new Promise((resolve, reject))
    // }

});

router.post('/', (req, res)=>{
    // const name = req.body.name;
    // const age =req.body.age;
    // const univ = req.body.univ;
    // const dept = req.body.dept;


    console.log(req.body);

    console.log(req.body.name);

    // const random = await crypto.randomBytes
    //base64로 변환해야함...






    // console.log(name);
    // console.log(age);
    // console.log(univ);
    // console.log(dept);
    //localhost:3000/training/info
    //자신의 이름, 학교, 학과, 나이정보저장

});
module.exports = router;