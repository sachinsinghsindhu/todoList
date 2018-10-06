<template>
  <div class="login">
    <h2>Login</h2>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passRules"
        type="password"
        label="password"
        required
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        @click="submit"
      >
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
    <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn slot="activator" color="primary" dark>register</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Register</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Email" required v-model="registerData.email"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password" required v-model="registerData.password"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="registerUser">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

  </div>
</template>

<script>
  import axios from 'axios';
  axios.defaults.withCredentials = true;

  export default {
    data: () => ({
      valid: true,
      dialog: false,
      registerData: {
        email: '',
        password: ''
      },
      password: '',
      passRules: [
        v => !!v || 'pass is required',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
    }),

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported\
          let uri = 'http://localhost:4000/login';
          axios.post(uri, {
            email: this.email,
            password: this.password
          })
          .then((response) => {
            console.log(response);
            axios.get('http://localhost:4000/api/all').then((res) => {
              if (res.status == 200) {
                this.$router.push('/');
              }
            })
          });
        }
      },
      clear () {
        this.$refs.form.reset();
      },
      registerUser() {
        let uri = 'http://localhost:4000/register';
        axios.post(uri, this.registerData)
        .then((res) => {
          if (res.status == 200) {
            this.dialog = false;
            this.$router.push('/');
          }
        })
        .catch((err) => {
          console.log('err',err);
        });
      }
    }
  }
</script>
