
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

//把movie資料存到物件內
const restaurant = require(path.join(__dirname, 'public','jsons','restaurant.json')).results

//建立靜態routing
app.use(express.static(path.join(__dirname,'public')));


//建立動態routing
//當輸入根目錄時，幫我轉導到/home, 並刺激hbs幫我render home.hbs
app.get('/', (req, res) => {
  res.redirect('/home')
})

app.get('/home' , (req, res) => {
  res.render('home', {restaurant:restaurant})
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const selectedRestaurant = restaurant.find((rst)=> rst.id.toString() === id)
  res.render('detail',{restaurant:selectedRestaurant})
})

//search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  let searchedRestaurant = findRestaurantByName(restaurant,keyword) 
  if (searchedRestaurant.length === 0) {
    searchedRestaurant = findRestaurantByCategory(restaurant,keyword)}
  if (searchedRestaurant.length === 0){
      res.render('noresult')
  }else{
      res.render('home',{restaurant:searchedRestaurant})
    } 
})

//http://localhost:3000/search?keyword=%E6%A2%85%E5%AD%90
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//----------------------------------------------------------------
//把search 從餐廳名稱 找關鍵字寫成function 
function findRestaurantByName(restaurant,keyword) {
  let searchedRestaurant = restaurant.filter((rst) => rst.name.toLowerCase().includes(keyword))
  return searchedRestaurant
}
  
//把search 從餐廳類別 找關鍵字寫成function 
function findRestaurantByCategory(restaurant,keyword) {
  let searchedRestaurant = restaurant.filter((rst) => rst.category.toLowerCase().includes(keyword))
  return searchedRestaurant
}

