// 生成6位随机数
export default function getRandom() {
  const num = Math.random() * 1000000;
  return num.toFixed();
}
