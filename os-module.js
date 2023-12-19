const os=require("os")
// info about current user
const use=os.userInfo()
console.log(use)
// method returns system uptime in seconds
console.log(`uptime is ${os.uptime()}`)
const currentos={
    name:os.type(),
    release:os.release(),
    totalmem:os.totalmem(),
    freemem:os.freemem(),
}
console.log(currentos)