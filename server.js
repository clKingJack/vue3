const Koa = require('koa');
const Router = require('koa-router');
const query = require('./bd.js'); //sql操作
const cors = require('koa2-cors'); //跨域
const parser = require('koa-bodyparser'); //获取接口参数

// 实例
const app = new Koa();
const router = new Router();

/*路由接口*/
// 可以使用链式调用
router
    .get('/', async (ctx) => {
        ctx.status = 200; //状态码
        ctx.body = '<h1>Hello</h1>';
    })
    // 查询
    .get('/user', async (ctx) => {
        ctx.status = 200; //状态码
        let body = { code: 200, list: [], message: 'ok' };
        const name = ctx.request.query.name; // 假设前端传递name参数
        try {
            let _sql = 'SELECT * FROM cl WHERE name LIKE ?'; // 增加搜索条件
            let value = ['%' + name + '%']; // 如果searchName存在，则添加模糊搜索条件
            if (!name) {
                _sql = 'SELECT * FROM cl';
                value = [];
            }
            let data = await query(_sql, value);
            for (let i = 0; i < data.length; i++) {
                data[i].index = i + 1; // 添加序号字段
            }
            body.list = data;
        } catch (error) {
            body.message = error.message;
            body.code = 300;
        } finally {
            ctx.body = body;
        }
    })
    // 添加
    .post('/add', async (ctx) => {
        let body = { code: 200, data: null, message: 'ok' };
        ctx.status = 200; //状态码
        let _info = ctx.request.body ?? {}; //获取参数

        if (!_info.name) {
            body.message = '用户名不能为空';
            ctx.code = 300;
            ctx.body = body;
            return;
        }

        try {
            let _sql = 'INSERT INTO cl (name, password) VALUES (?, ?)';
            let value = [_info.name, _info.password ?? ''];
            let insertResult = await query(_sql, value);

            // 如果插入成功再查询所有数据
            if (insertResult.affectedRows > 0) {
                let _querySql = 'SELECT * FROM cl';
                let data = await query(_querySql);
                body.data = data;
            } else {
                body.message = '添加失败';
                body.code = '1';
            }
        } catch (error) {
            body.message = error.message;
            body.code = '1';
        } finally {
            ctx.body = body;
        }
    })
    // 更新
    .post('/edit', async (ctx) => {
      let body = { code: 200, data: [], message: 'ok' };
      ctx.status = 200; //状态码
      let _info = ctx.request.body ?? {}; //获取参数
      if (!_info.name) {
          body.message = '用户名不能为空';
          ctx.body = body;
          return;
      }
      if (!_info.id) {
          body.message = '用户id不能为空';
          ctx.body = body;
          return;
      }
      if (!Number(_info.id)) {
          body.message = 'id格式不正确';
          ctx.body = body;
          return;
      }
  
      try {
          let _sqlUpdate = 'UPDATE cl SET name=? WHERE id=?';
          let updateValue = [_info.name, Number(_info.id)];
          await query(_sqlUpdate, updateValue);
  
          // 更新成功后查询该记录
          let _sqlSelect = 'SELECT * FROM cl WHERE id=?';
          let selectValue = [Number(_info.id)];
          let data = await query(_sqlSelect, selectValue);
  
          // 给查询结果添加序号
          for (let i = 0; i < data.length; i++) {
              data[i].index = i + 1;
          }
  
          body.data = data;
      } catch (error) {
          body.message = error.message;
          body.code = 300;
      } finally {
          ctx.body = body;
      }
  })
    // 删除
    .delete('/delete/:id', async (ctx) => {
        let body = { code: '0', data: null, message: 'ok' };
        ctx.status = 200; //状态码
        let _info = ctx.params ?? {}; //获取参数
        if (!Number(_info.id)) {
            body.message = 'id格式不正确';
            ctx.body = body;
            return;
        }
        try {
            let _sql = 'DELETE FROM cl WHERE id=?';
            let value = [Number(_info.id)];
            let data = await query(_sql, value);
            body.data = data;
        } catch (error) {
            body.message = '删除失败';
            body.code = '1';
        } finally {
            ctx.body = body;
        }
    })

// 详情
.get('/detail/:id', async (ctx) => {
    ctx.status = 200;
    let body = { code: 200, data: {}, message: 'ok' };

    const id = ctx.params.id;

    if (!Number(id)) {
        body.message = 'ID 格式不正确';
        ctx.body = body;
        return;
    }
    try {
        let _sql = 'SELECT name FROM cl WHERE id=?';
        let value = [Number(id)];
        let user = await query(_sql, value);

        if (user.length > 0) {
            body.data = { name: user[0].name };
        } else {
            body.message = '用户不存在';
            body.code = '1';
        }
    } catch (error) {
        body.message = error.message;
        body.code = 300;
    } finally {
        ctx.body = body;
    }
});
// 添加接口固定前缀
router.use('/api', router.routes());
// .use('/pc', pcRouter.routes())
// .use('/android', androidRouter.routes())

app.use(cors() /*跨域 */)
    .use(parser() /*获取接口参数 */)
    .use(router.routes() /*配置路由*/)
    .use(router.allowedMethods() /*配置路由*/);

// 服务端口
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000/');
});
