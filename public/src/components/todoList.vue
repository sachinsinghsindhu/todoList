<template>
  <div class="todos">
    <input type="text" v-model="addTodo" style="background-color: grey;color: white;">
    <button @click.prevent="Add" class="btn">Add</button>
    <div v-for="(todo, index) in todos">
      <div class="name">{{todo.name}}</div>
      <button @click.prevent="update(todo._id, index)" v-if="!todo.done" class="btn">Done</button>
      <button @click.prevent="update(todo._id, index)" v-else class="btn">Undone</button>
      <button @click.prevent="deleteTodo(todo._id,index)" class="btn">Delete</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
export default {
  data: () => ({
    todos: [],
    addTodo: '',
  }),
  created() {
    let uri = 'http://localhost:4000/api/all';
    axios.get(uri)
    .then((response) => {
      console.log(response);
      this.todos = response.data.todos;
    });
  },
  methods: {
    getTodos() {
      let uri = 'http://localhost:4000/api/all';
      axios.get(uri)
      .then((response) => {
        this.todos = response.data.todos;
      });
    },
    Add() {
      console.log(this.addTodo);
      if (this.addTodo.length > 0) {
        let uri = 'http://localhost:4000/api/add';
        axios.post(uri, {
          name: this.addTodo,
        })
        .then((response) => {
          if (response.status == 200) {
            this.addTodo = '';
            this.getTodos();
          }
        });
      }
    },
    update(id,index) {
      console.log(id);
      let uri = 'http://localhost:4000/api/update';
      axios.post(uri, {
        id: id,
        done: !this.todos[index].done,
      })
      .then((response) => {
        if (response.status == 200) {
          this.todos[index].done = !(this.todos[index].done);
        }
      });
    },
    deleteTodo(id, index) {
      let uri = 'http://localhost:4000/api/delete';
      axios.post(uri, {
        id: id,
      })
      .then((response) => {
        if (response.status == 200) {
          this.todos.splice(index, 1);
        }
      });
    }
  }
}
</script>
