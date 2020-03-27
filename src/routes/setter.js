let myArr = [];


let hmm = {
    set: () => {
        myArr.push(1);
        console.log(myArr, 'myArr')    
    }
}

let set = () => {
    myArr.push(1);
    console.log(myArr, 'myArr')    
}

module.exports = {hmm}