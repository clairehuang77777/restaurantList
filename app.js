
//建立本機伺服器 local server 
const express = require('express')
const { engine } = require('express-handlebars');
const path = require('path');

//初始化express-handlebars
const app = express()
const port = 3000

//初始化express-handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views',  './views');




//建立靜態routing
app.use(express.static('public'));


//建立動態routing
//當輸入根目錄時，幫我轉導到/home, 並刺激hbs幫我render home.hbs
app.get('/', (req, res) => {
  res.redirect('/home')
})

app.get('/home' , (req, res) => {
  res.render('home')
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  res.send(`This is the restaurant ${id} details`)
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  res.send(`This is ${keyword} search result`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



