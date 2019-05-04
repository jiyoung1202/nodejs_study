const async = require('async');
//흐름제어를 위한 async 사용

const tasks = [
    function(callback) {
        setTimeout(() => {
            console.log('task1');
            callback(null, '1-1', '1-2');
            //콜백의 첫번째 인자는 error를 의미한다. 정상적으로 수행완료될경우
            //err를 null처리함.
        }, 200);
    },
    function(callback) {
        setTimeout(() => {
            console.log('task2');
            callback(null, '2-1');
        }, 100);
    }
]

//async.series는 각 콜백에서 넘긴 변수들이 마지막 완료되는 시점에서 리턴한다.
async.series(tasks, (err, results) => {
    console.log(results);
});

const tasks2 = [
    function(callback) {
        setTimeout(() => {
            console.log('task1');
            callback(null, 4, 27);
        }, 200);
    },
    function(num1, num2, callback) { //이전 함수에서 넘겨준 값을 받을 인자
        setTimeout(() => {
            console.log('task2');
            callback(null, num1 + num2);
        }, 100);
    },
    function(data, callback) {
        console.log(data);
    }
]

//aysnc.waterfall은 비동기 함수들을 순차적으로 실행하고
// 각작업의 결과를 다음작업으로 넘김
async.waterfall(tasks2, (err, result) => {
    console.log(result);
});

var timestamp = new Date().getTime();

//async.parallel은 여러개의 작업을 동시에 실행
async.parallel([
    function(callback) {
        setTimeout(function() {
            console.log('one');
            callback(null, 'one'); //one은 최종적으로 넘길값
        }, 2000);
    },
    function(callback) {
        setTimeout(function() {
            console.log('two');
            callback(new Error("Error!"), 'two');
        }, 1000);
    },
    function(callback) {
        setTimeout(function() {
            console.log('three');
            callback(null, 'three');
        }, 3000);
    }
], function(err, results) {
    console.log(results);
    console.log(new Date().getTime() - timestamp, 'ms');
});