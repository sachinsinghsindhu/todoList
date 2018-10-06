<template>
  <div>
    <button @click.prevent="logout" class="btn">Logout</button>
    <todo-list></todo-list>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
import TodoList from './todoList';
export default {
  data: () => ({
  }),
  created() {
  },
  components: {
    TodoList,
  },
  methods: {
    logout() {
      let uri = 'http://localhost:4000/logout';
      axios.get(uri)
      .then((response) => {
        if (response.status == 200) {
          this.$router.push('/login');
        }
      });
    }
  }
}
</script>
