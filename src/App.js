import React, { useEffect, useState, useMemo } from 'react';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import axios from 'axios';

import getRandom from './common/getRandom';

const AppContext = React.createContext({
  // 签名密钥
  signKey: ''
});

export default function App(props) {
  const [signKey, setSignKey] = useState('');
  const appContext = useMemo(
    () => ({
      signKey
    }),
    [signKey]
  );
  useEffect(() => {
    const fetchData = async () => {
      const secrete = md5(md5('yjh-release'));
      const json = require('../package.json');
      const payload = {
        // 系统名称
        name: json.name,
        // 版本号
        version: json.version,
        // 时间戳
        timestamp: Date.now(),
        // 随机数
        random: getRandom()
      };
      const token = jwt.sign(payload, secrete, { noTimestamp: true });
      const res = await axios.post('/api/sign', {
        data: token
      });
      const tk = jwt.decode(res.data, `${secrete}${token}`);
      if (!tk || !tk.signKey) {
        throw new Error('tk 不合法');
      }
      setSignKey(tk.signKey);
    };
    fetchData();
  }, []);
  return signKey ? (
    <AppContext.Provider value={appContext}>
      {props.children}
    </AppContext.Provider>
  ) : (
    ''
  );
}

export { AppContext };
