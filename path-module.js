const path=require('path')
console.log(path.sep)  //  \
const filepath=path.join('smaple','sample2','tect.txt')
console.log(filepath)  //  smaple\sample2\tect.txt
const base=path.basename(filepath)
console.log(base) //  tect.txt
// for absolute path 
const absolute=path.resolve(__dirname,'smaple','sample2','tect.txt')
console.log(absolute) // c:\Users\Rishith\OneDrive\Documents\Nodejs\smaple\sample2\tect.txt