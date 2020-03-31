import jwt from 'jsonwebtoken';
import getRandom from './getRandom';

// 生成csrf-token 避免重复
export default function generatorCsrfToken(signKey) {
  const token = jwt.sign(
    {
      random: getRandom(),
      timestamp: Date.now()
    },
    signKey,
    {
      // 1秒失效
      expiresIn: 60 * 5
    }
  );
  return token;
}
