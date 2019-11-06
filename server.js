const {User} = require('./models')
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd'


// 测试接口是否通
app.use(express.json())
app.get('/api/test',async(req,res) =>{
    res.send('ok')
})


app.get('/api/user',async(req,res) =>{
    //查询所有用户
    const users = await User.find()
    res.send(users)
})

// 注册
app.post('/api/register',async(req,res) =>{
    const user = await User.create({
        username:req.body.username,
        password:req.body.password
    })
    res.send(user)
})


// 登录
app.post('/api/login',async(req,res) =>{
    const user = await User.findOne({
        username:req.body.username
    })
    if(!user) {
        return res.status(422).send({
            message:"用户不存在"
        })
    }

    const isPasswordValid = require('bcryptjs').compareSync(
        req.body.password,
        user.password
    )
    if(!isPasswordValid){
        return res.status(422).send({
            message:"密码无效"
        })
    }
    

    const token = jwt.sign({
        id:String(user._id)
    },SECRET)

    // 生成token
    res.send({
        user,
        token
    })
})


// 校验中间件
const auth = async(req,res) =>{
    const raw = String(req.headers.authorization).split(' ').pop();
    // 验证
    const {id} = jwt.verify(raw,SECRET)
    req.user = await User.findById(id)
}

app.get('/api/profile',auth,async(req,res) =>{
    res.send(req.user)
})


app.listen(3001,() =>{
    console.log('http://localhost:3001')
})