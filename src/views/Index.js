import React, { useState, useCallback, useContext } from 'react';
import generatorCsrfToken from '../common/generatorCsrfToken';
import axios from 'axios';

import { AppContext } from '../App';
export default function Index() {
  const app = useContext(AppContext);
  const [stage, setStage] = useState('one');
  const onClick = useCallback(async () => {
    const { data } = await axios.get('/api/next', {
      params: { index: stage },
      headers: { 'Csrf-Token': generatorCsrfToken(app.signKey) }
    });
    setStage(data);
  }, [stage]);
  return (
    <div>
      <span>{stage}</span>
      <button onClick={onClick}>next</button>
    </div>
  );
}
