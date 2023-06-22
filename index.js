const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
var app = express()
var cors = require('cors')
const port = "i-notebook-api.vercel.app"


app.use(cors())
app.use(express.json())

//available routes
app.use('/api/auth', require("./routes/auth"))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
