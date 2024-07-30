
//建立本機伺服器 local server 
const express = require('express')
const app = express()
const port = 3000



//建立靜態routing
app.use(express.static('public'));


//建立動態routing
app.get('/', (req, res) => {
  res.send('Hello its a restaurant page!')
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  res.send(`This is the restaurant ${id} details`)
})

app.get('/restaurant', (req, res) => {
  const keyword = req.query.keyword
  res.send(`This is ${keyword} search result`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



