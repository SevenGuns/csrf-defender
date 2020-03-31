import './styles.css';
import Index from './views/Index';
import Test from './views/Test';
import NotFount from './views/NotFount';

const getRoutes = () => {
  return [
    {
      component: Index,
      path: '',
      key: 'index'
    },
    {
      component: Test,
      path: '/test',
      key: 'test'
    },
    {
      component: NotFount,
      key: '404'
    }
  ];
};
const routes = getRoutes();

export default routes;
