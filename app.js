
//建立本機伺服器 local server 
const express = require('express')
const { create } = require('express-handlebars');
const path = require('path');
//透過 sequelize 連線本機資料庫MySQL

const db = require("./models")
const rstList = db.rstList

//初始化express-handlebars
const app = express()
const port = 4001

//初始化express-handlebars
const hbs = create({
  defaultLayout: 'main',
  extname: '.hbs', //設置副檔名為hbs
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,  // 允許訪問原型屬性
    allowProtoMethodsByDefault: true     // 允許訪問原型方法
  }
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views',  './views');

//把movie資料存到物件內
//要把資料改成從**db**來~


//建立靜態routing
app.use(express.static(path.join(__dirname,'public')));


//建立動態routing
//當輸入根目錄時，幫我轉導到/home, 並刺激hbs幫我render home.hbs
app.get('/', (req, res) => {
  return rstList.findAll()
  .then((rstList)=>res.render('home',{rstList:rstList}))
})


app.get('/home' , (req, res) => {
  return rstList.findAll()
  .then((rstList)=>res.render('home',{rstList:rstList}))
})

app.get('/restaurants/:id', async (req, res) => {
  const id = req.params.id
  try {
    const selectedRst = await rstList.findByPk(id,{raw:true})
    if (!selectedRst){
      return res.status(404).send('restaurant not found')
    }
    res.render('detail',{rstList:selectedRst})
  }
  catch(error){
    console.error(error)
  }
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

