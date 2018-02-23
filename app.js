// Main server thread , getting all request come to server , pass all throw mideltware ----
const express = require('express')
const app = express()
const port = 3000

// Loging mid
app.use((request, response, next) => {
  console.log(request.headers)
  next()
})

// check the request comming source IP
app.use((request, response, next) => {
  console.log("IP : "+request.connection.remoteAddress)
  next()
})

// check the DB stat to decide where we can run or not
app.use((request, response, next) => {
  let db = false // let it false until we run the DB
  next()
})

app.get('/', (request, response) => {
  response.json({
    server: "runing",
    db:"false",
    msg:"Database offline , wait activation",
    err_code:"DBx01"
  })
})

// err handler
app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err)
  response.status(500).send('Something broke!')
})

app.listen(process.env.PORT || port);
