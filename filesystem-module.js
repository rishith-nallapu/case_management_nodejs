// we can do it asynchronously non-blocking or synchronously blocking

// sync---- this is really complex as step by step executed
// we are going to destructure them outside of module
// craete two text files in sample2
// we write path and utf-8 encode  the node knows how to decode
// with writefilesync if file doesn't exist it will be created

// const{readFileSync,writeFileSync}=require('fs')

// const first=readFileSync('./sample/firsttest.txt','utf8')
// const second=readFileSync('./sample/secondtest.txt','utf8')
// console.log(first,second)

// writeFileSync('./sample/writingfile.text',`both written ${first}  ${second}`)


// Aync  
// const { readFile, writeFile } = require('fs')
// readFile('./sample/firsttest.txt', 'utf8', (err, result) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     const first = result
//     readFile('./sample/secondtest.txt', 'utf8', (err, result) => {
//         if (err) {
//             console.log(err)
//             return
//         }
//         const second = result
//         writeFile('./sample/writefile.text', `both written ${first}  ${second}`,(err,result)=>{
//             if (err) {
//                 console.log(err)
//                 return
//             }
//             console.log(result)       // we get output undefined but see file for information
//         })
//     })
// })








