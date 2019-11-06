const mongoose = require('mongoose')
// 链接数据库
mongoose.connect('mongodb://localhost:27017/express-auth',{
    useCreateIndex:true,
    useNewUrlParser:true
})

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true //字段是否唯一
    },
    password:{
        type:String,
        set(val){
            // 通过bcryptjs对密码加密返回值 第一个值返回值， 第二个密码强度
            return require('bcryptjs').hashSync(val,10)
        }
    }
})


const User = mongoose.model('User',UserSchema)
// 全部删除
// User.db.dropCollection('users')
module.exports = {User}