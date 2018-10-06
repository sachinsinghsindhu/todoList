import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
//import Register from '@/components/Register';
import Home from '@/components/Home';
import axios from 'axios';
axios.defaults.withCredentials = true;
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: (to, from, next) => {
        let uri = 'http://localhost:4000/protected';
        axios.get(uri)
        .then((response) => {
          console.log(response.status)
          if (response.status == 200) {
            next();
          } else {
            next('/login');
          }
        })
        .catch((err) => {
          next('/login');
        });
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
  ],
});
