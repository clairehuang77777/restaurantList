
//建立本機伺服器 local server 
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello its a restaurant page!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//建立routing

