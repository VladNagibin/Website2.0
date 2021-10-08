const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')    
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const mainRouter = require('./routes/mainRouter')
const hbs = handlebars.create()
const PORT = process.env.PORT || 3000
var conn='mongodb+srv://Vlad:123@cluster0.zy9vv.mongodb.net/Database'

app.engine('html', hbs.engine)
app.set('view engine','html')
app.set('views', 'views')
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(mainRouter)
async function start(){
    try{
      
      connection=await mongoose.connect(conn)
      app.listen(PORT,()=>{
        console.log('server has been started')
    })  
        
    }catch(e){
        console.log(e)
    }
}

start()