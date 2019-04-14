const moduleArr=[7, 2, "Hello World", 11, "node", "server", 8, 1];

for(var i =0; i<moduleArr.length; i++){
    if(moduleArr[i]%2==0){const even = require('./0423_module.js/index.js');
    const myeven = even(moduleArr[i]);
    console.log(myeven.square());
}

}