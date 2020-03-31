const Koa = require('koa');
const Router = require('@koa/router');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');
const md5 = require('md5');
const generatorCsrfValidator = require('./middlewares/generatorCsrfValidator');
const app = new Koa();

// 前后端统一密钥
const secrete = md5(md5('yjh-release'));

// 静态资源
app.use(serve(path.resolve(process.cwd(), 'public')));
// 打包出来的前端资源
app.use(serve(path.resolve(process.cwd(), 'dist')));
// 服务端资源
app.use(serve(path.resolve(process.cwd(), 'build')));
const router = new Router();

app.use(bodyParser());

// 获取signKey
const getSignKey = async () => md5(md5('yjh-csrf-token'));

// 中间件-校验csrf-token
const validateCsrf = generatorCsrfValidator(getSignKey);

// 校验客户端
const validateClient = async payload => {
  // 已注册的服务
  const whiteList = ['my-bff'];
  if (!payload || !payload.name || whiteList.indexOf(payload.name) === -1) {
    throw new Error('未识别的客户端');
  }
};

router.post('/api/sign', async ctx => {
  const token = ctx.request.body.data;
  const payload = jwt.decode(token, secrete);
  try {
    await validateClient(payload);
    const signKey = await getSignKey();
    ctx.body = jwt.sign({ signKey }, `${secrete}${token}`, {
      noTimestamp: true
    });
  } catch (err) {
    console.error(error);
    ctx.status = 401;
  }
});

router.get('/api/next', validateCsrf, async ctx => {
  const { index } = ctx.query;
  const list = ['one', 'two', 'three'];
  const idx = list.indexOf(index);
  ctx.body = list[idx + 1] || 'success!';
});

router.get('*', async ctx => {
  ctx.body = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'));
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
