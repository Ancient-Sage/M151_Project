<template>
  <div id="app">
    <header>
        <h1>TFB MASTERMIND LEADERBOARD</h1>
    </header>
        <div class="block" v-for="(o,index) in aliens" v-bind:key="(o,index)" :style="'width:'+ width +'%; height: '+height+'px;'">
            <div :class="{blk: true, v1: (index === 0), v2: (index === 1), v3: (index === 2), vother: (index > 2)}" :style="{backgroundColor: o.color,}">
                <div id="place">{{index + 1}}</div> 
                <div id="name">{{o.name}}</div> 
                <div id="tries">{{o.tries}}</div> 
                <div id="time">{{o.time|timetranslater}}</div>
            </div>
        </div>               
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
      width: 100,
      height:100,
      aliens: []
    }
  },
  filters:{
    timetranslater: function(t){
      var sec = Math.floor(t/1000)%60
      if (sec < 10) {
        sec = "0" + sec;
      }
      var min = Math.floor(t/(60000))%60
      return min + ":" + sec
    }
  },
  methods: {
    async deleteTodo(index) {
      let todo_id = this.todos[index].id
      this.todos.splice(index, 1)
      await axios.delete(`/api/todo/${todo_id}`)
    }
  },
  async created() {
    let response = await axios.get('/api/score')
    this.aliens = response.data

    setTimeout(function(){location.reload();},30000)

  },
}
</script>

<style scoped>
body{
    margin: 0;
}
html{
    padding: 0;
}
header{
    width: 100%;
    height: 10vh;
    background-color: rgb(0, 130, 180);
    color: white;
    font-family: 'Franklin Gothic Medium';
    text-align: center;
}
h1{
    margin: 0;
}

.blk div{
    float: left;
}

#place{
    width: 12.5%;
    font-size: 1.5em;
}
#name{
    width: 50%;
    word-break: break-all;
    text-overflow: ellipsis;

    white-space: nowrap;
    overflow: hidden;
}
#tries{
    width: 12.5%;
}
#time{
    width: 25%;
}
.blk{
    margin: 2.5% 5%;
    width: 90%;
    height: 100%;
    text-align: center;
    font: 4em sans-serif;
}
.v1{
    background: gold;
}
.v2{
    background: silver;
}
.v3{
    background: #b08d57;
}
.vother{
    background: rgb(0, 130, 180);
}
</style>
