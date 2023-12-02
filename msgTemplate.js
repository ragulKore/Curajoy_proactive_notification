const  msgTemplate=(questionData,username)=>{
const unAnsquestionArr=Object.keys(questionData)
let unAnsquestionMsg=''
for(let i=0;i<unAnsquestionArr.length;i++){
    if(i==unAnsquestionArr.length-1){
        unAnsquestionMsg=unAnsquestionMsg+`${unAnsquestionArr[i]}`
    }
    else{
        unAnsquestionMsg=unAnsquestionMsg+`${unAnsquestionArr[i]},`
    }
    
}
console.log(unAnsquestionMsg)
return `Hello ${username}! 🌟 It seems like you missed some questions in the ${unAnsquestionMsg} form. Your input is valuable, and we'd love to hear your thoughts. Take a moment to revisit the form and share your insights. Thanks a bunch! 🚀`
}
module.exports={msgTemplate}