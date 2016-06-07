<template>
    
  <div class="chatsList">
    <ul>
      <li v-for="(user, chat) in messages | filterBy chatNotEmpty | orderBy mostRecent order" @click="setCurrentChat(user)">
        <b v-if="chat[0].unread">{{user}}</b><p v-else>{{user}}</p> <span>{{chat[0].hour.getHours()}}:{{chat[0].hour.getMinutes()}}</span>
      </li>
    </ul>
  </div>
  <div class="chat">
      <h3>{{currentChat}}</h3>
      <ul>
          <li v-for="message in messages[currentChat]">
              <div class="{{message.sender ? 'sent' : 'received'}}">
                <span>{{message.hour.getHours()}}:{{message.hour.getMinutes()}}</span> 
                <div class="msg">{{message.msg}}</div>
                </div>
          </li>
      </ul>
      <div class="form"><form v-on:submit.prevent='sendMessage'>
        <template v-if="loggedUsers.indexOf(currentChat)>=0">
          <input 
                type="text"
                v-model="newMessage"
                placeholder="Entrez un message"
              /><input type="submit" value="Envoyer">
        </template>
        <template v-else>
          <input 
                type="text"
                placeholder="Entrez un message"
                disabled
              /><input type="submit" value="Envoyer" disabled>
        </template>
      </form></div>
  </div>
  <div class="online">
    <h3>Online :</h3>
    <ul>
      <li v-for='user in loggedUsers' @click="setCurrentChat(user)">
        {{user}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props:['loggedUsers'],
    data (){
      return {
        currentChat:'',
        newMessage: '',
        messages: {}
      }
    },
    methods: {
      sendMessage: function(){
          let msg={
            to: this.currentChat,
            msg: this.newMessage.trim()
          }
          this.$dispatch('sendMessage', msg);
          this.newMessage = '';
          if(!(msg.to in this.messages)){
            this.$set("messages."+msg["to"], []);
          }
          this.messages[msg.to].unshift({
            sender:true,
            msg:msg.msg,
            hour:new Date()
          });
          console.log(msg);
      },
      setCurrentChat: function(user){
        this.currentChat = user;
        if(this.currentChat in this.messages && this.messages[this.currentChat].length){
          this.messages[this.currentChat][0].unread = false;
        }
      },
      mostRecent: function(a, b){
        return b.$value[0].hour.getTime()-a.$value[0].hour.getTime();
      },
      chatNotEmpty: function(a){
        return a.$value.length>0? true:false;
      }
    },
    events: {
      newMessage: function(msg){
        console.log("newMessage");
        if(!(msg.from in this.messages)){
          this.$set("messages."+msg["from"], []);
        }
        this.messages[msg.from].unshift({
          sender:false,
          msg:msg.msg,
          hour:new Date(),
          unread: this.currentChat == msg.from ? false : true
        });
      }
    }
  }
</script>