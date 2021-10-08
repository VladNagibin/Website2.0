const {Router, response} = require('express')
const router = Router()

router.get('/', (req, res )=>{
    res.render('index')
})

module.exports=router