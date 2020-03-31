const jwt = require('jsonwebtoken');
const generatorCsrfAuth = getSignKey => {
  const cachKeys = new Set();
  const validateCsrfToken = async csrfToken => {
    const secret = await getSignKey();
    return new Promise((rs, rj) => {
      if (!csrfToken) {
        rj(new Error('csrf token null'));
        return;
      }
      jwt.verify(csrfToken, secret, (err, decoded) => {
        if (err || !decoded || !decoded.random) {
          rj(new Error('invalid csrf token'));
          return;
        }
        // token被使用过
        if (cachKeys.has(csrfToken)) {
          rj(new Error('repeat csrf token'));
          return;
        }
        cachKeys.add(csrfToken);
        // 一秒后释放
        setTimeout(() => {
          cachKeys.delete(csrfToken);
        }, 1000 * 60 * 5);
        rs();
      });
    });
  };
  return async (ctx, next) => {
    const csrfToken = ctx.headers['csrf-token'];
    if (!csrfToken) {
      ctx.status = 401;
      return;
    }
    try {
      await validateCsrfToken(csrfToken);
      await next();
    } catch (err) {
      console.error('err', err);
      ctx.status = 401;
    }
  };
};

module.exports = generatorCsrfAuth;
