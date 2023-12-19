const http=require("http")

// req--represents incoming request , res--is the response
// web servers will be listening to our request   see localhost 5500 in chrome

const server=http.createServer((req,res)=>{
    //console.log(req)
    res.write("Welcome to the browser")
    res.end()
})
server.listen(5000)