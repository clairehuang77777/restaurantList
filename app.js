
//建立本機伺服器 local server 
const express = require('express')
const { create } = require('express-handlebars');
const path = require('path');
//透過 sequelize 連線本機資料庫MySQL

const db = require("./models")
const rstList = db.rstList

const { Op } = require('sequelize');
//初始化express-handlebars
const app = express()
const port = 4001

//套用methodoverride把post轉成put
var methodOverride = require('method-override');
const rstlist = require('./models/rstlist');



//初始化express-handlebars
const hbs = create({
  defaultLayout: 'main',
  extname: '.hbs', //設置副檔名為hbs
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,  // 允許訪問原型屬性
    allowProtoMethodsByDefault: true     // 允許訪問原型方法
  },
  helpers: {
    eq: (a, b) => a === b, // 返回是否相等
  },
})

//express要能正確解決type=urlencoded的值
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views',  './views');
app.use(methodOverride('_method'))


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

app.post('/',(req,res)=>{
  const newRst = req.body
  console.log(newRst)

    return rstList.create({ 
    name: newRst.name, 
    name_en: newRst.name_en,
    category: newRst.category,
    image: newRst.image,
    location: newRst.location,
    phone: newRst.phone,
    google_map: newRst.google_map,
    rating:newRst.rating,
    description:newRst.description,
  })
  .then(()=>res.redirect('/'))
  .catch((error)=>console.error(error))
})

app.get('/edit/:id',(req, res)=> {
  const id = req.params.id

  return rstList.findByPk(id,
    {raw: true}
  )
  .then((rstList)=>res.render('edit',{rstList:rstList}))
  .catch((error)=>console.error(error))
})

app.put('/edit/:id',async(req, res)=>{
  const editingID = req.params.id
  const editingRst = req.body

  try {
    await rstList.update({
    name: editingRst.name, 
    name_en: editingRst.name_en,
    category: editingRst.category,
    image: editingRst.image,
    location: editingRst.location,
    phone: editingRst.phone,
    google_map: editingRst.google_map,
    rating:editingRst.rating,
    description:editingRst.description},
    {
      where : {
        id :editingID,
      }
    }
  )
  const allRst = await rstList.findAll({raw:true})
  res.render('home',{rstList:allRst})
  }
  catch(error){
    console.error(error)
  }
})


app.delete('/delete/:id',async (req, res)=>{
  const id = req.params.id

  try { 
      await rstList.destroy({
      where: {
        id : id,
      }
    })
  
  const allRst = await rstList.findAll({raw:true})
  res.render('home',{rstList:allRst})
  }
  catch(error){
    console.error(error)
  }

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
app.get('/search', async (req, res) => {
  const keyword = req.query.keyword || ''
  try{
    const findRstList = await rstList.findAll({
      where: {
          name: {
            [Op.like]: `%${keyword}%`},
        },
      raw:true
    })
    .then((findRstList)=>res.render('home',{rstList:findRstList}))
    .catch((error)=>console.error(error))
  }
  catch(error){
    console.error(error)
  }
})

app.get('/create',(req,res)=>{
  res.render('create')
})

//http://localhost:3000/search?keyword=%E6%A2%85%E5%AD%90
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//----------------------------------------------------------------
  
//把search 從餐廳類別 找關鍵字寫成function 
function findRestaurantByCategory(restaurant,keyword) {
  let searchedRestaurant = restaurant.filter((rst) => rst.category.toLowerCase().includes(keyword))
  return searchedRestaurant
}

