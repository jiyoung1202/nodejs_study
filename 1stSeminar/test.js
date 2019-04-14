var jiyoung = {
    name: "이지영",
    age: 23,
    school: "seoul women's university",
    major: "information security",
    number: "010-7520-3789",
    birthdayMonth: 12,
    birthdayDay: 02
}; //전역 으로 설정

var test = (object) => { //object 객체 만들어서 

    for (key in object) {
        console.log(key + ':' + object[key])
    }

}
test(jiyoung);

console.log(`제 생일은 ${jiyoung.birthdayMonth}월 ${jiyoung.birthdayDay}일입니다.`);

var array = new Array();
var number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function birthday() {
    for (var i = 0; i < number.length; i++) {
        if (number[i] == jiyoung.birthdayMonth) {
            console.log("제 생일은 " + (i + 1) + " 월 입니다.");
        }
    }
}

birthday();
