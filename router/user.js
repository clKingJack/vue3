import Router from "koa-router";
export const user = new Router();
import { query } from '../utils/mysql'
user.post('/login',async(ctx,next)=>{
    console.log(ctx.request.body)
    const {userName,password} = ctx.request.body
    const sql = `select * from user where name = '${userName}' and password = '${password}'`;
    const result = await query(sql);
    console.log(result)
    ctx.body= {
        code:'200',
        msg:'登录成功'
    }
})


