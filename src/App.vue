<template>
  <div class="login" v-if='!isLogged'>
    <h2>Connexion</h2>
    <form v-on:submit.prevent='Connect'>
      <input type='text' v-model='user.name' placeholder='Entrez votre identifiant'>
      <input type='submit'>
    </form>
  </div>
  <div class="messages" v-else >
    <messages :logged-users='loggedUsers'></messages>
    <button class="quit" @click="Disconnect">Déconnexion</button>
    <span class="user">{{user.name}}</span>
  </div>

</template>

<script>
  import Vue from 'vue'
  import VueSocketio from 'vue-socket.io'
  import Messages from './components/Messages'

  Vue.use(VueSocketio, window.location.protocol + '//' + window.location.host)

  export default {
    components:{'messages': Messages},
    data () {
      return {
        user:{
          id:'',
          name:''
        },
        isLogged : false,
        loggedUsers : []
      }
    },
    sockets:{
      connect: function(){
        console.log('socket connecteeesd')
      },
      newMessage: function(msg) {
        console.log(this)
        this.$children[0].$emit('newMessage', msg);
      },
      logged: function(data){
        this.user.id = data.id;
        this.isLogged = true;
        this.loggedUsers = data.users  
      },
      badName: function(){
        alert("User named "+ this.user.name +" already registerd");
        this.user.name = "";
      },
      newUser: function(user){
        this.loggedUsers.push(user);
      },
      userQuit: function(user){
        for(i=0; i<this.loggedUsers.length; i++){
          var i = this.loggedUsers.indexOf(user);
          if(i>=0){
            this.loggedUsers.splice(i, 1);
          }
        }
      }
    },
    methods: {
      Connect: function(){
        if(this.user.name.trim().length>0){
          this.$socket.emit('log', this.user.name.trim())
        }
      },
      Disconnect: function(){
        this.$socket.emit('unlog', this.user.name.trim())
        this.user = {id:'', name:''};
        this.isLogged = false;
        this.loggedUsers = [];
      }
    },
    events: {
      sendMessage:function(msg){
        msg.from = this.user.name.trim();
        this.$socket.emit('sendMessage', msg);
      }
    }
  }
</script>