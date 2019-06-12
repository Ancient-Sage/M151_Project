<template>
  <div id="app">
    <header>
                <h1>MASTERMIND</h1><button id="manual" @click="manualcontrol()" >Anleitung</button>
                <p v-if="manual === true"> 
                    Zu beginn des Spiels wird ein Vierstelliger Farbcode aus je sechs verschiedenen Farben generiert, wobei eine Farbe auch mehrmals vorkommen kann.
                    Ihre Aufgabe ist nun diesen Farbcode mittels Logik zu erraten. Die Position der Farben spielt eine Rolle.
                    Sie erhalten rechts von ihrem Code schwarze und/oder Weisse Kugeln die ihnen als Grundlage für Schlussfolgerungen dienen.
                    Eine schwarze Kugel bedeutet, dass eine Farbe aus ihrem Code an der richtigen Position ist.
                    Eine weisse Kugel bedeutet, dass eine Farbe im Code vorkommt aber noch nicht an der richtigen Position ist.
                </p>
            </header>
        
            <div class="line" v-for="(g,index) in guesses" v-bind:key=(g,index)><!-- sorgt dafür das eine neue Reihe entstehen kann -->
                <div class="sieg col-2" v-for="l in wintext" v-bind:key="l"><!-- gibt den Gewinn Text SIEG aus und sorgt dafür das nur ein div statt 4 benötigt wird -->
                    <div class="ball" v-bind:style="'background-color: '+guesses[index][wintext.indexOf(l)]+';'"><!-- erstellt ein div und gibt ihm seine Farbe -->
                        <h1 class="wintxt" v-if="index === guesses.length-1 && win && !surrendered">{{l}}</h1><!-- gibt den Gewinn Text SIEG aus -->
                        <div class="dropcontent" v-if="index === guesses.length-1 && !win"><!-- mit diesen Knöpfen wird die Farbe geändert -->
                            <button class="btn-1" @click="cchange(index,wintext.indexOf(l),4)">Schwarz</button>
                            <button class="btn-2" @click="cchange(index,wintext.indexOf(l),2)">Blau</button>
                            <button class="btn-3" @click="cchange(index,wintext.indexOf(l),3)">Gelb</button>
                            <button class="btn-4" @click="cchange(index,wintext.indexOf(l),0)">Rot</button>
                            <button class="btn-5" @click="cchange(index,wintext.indexOf(l),5)">Orange</button>
                            <button class="btn-6" @click="cchange(index,wintext.indexOf(l),1)">Grün</button>
                        </div>
                    </div>
                </div>
                <div class="tippsfield col-2"><!-- hier werden die Hinweise angezeigt -->
                    <div class="tipp" v-bind:style="'background-color: '+hints[index][0]+';'"></div>
                    <div class="tipp" v-bind:style="'background-color: '+hints[index][1]+';'"></div>
                    <div class="tipp" v-bind:style="'background-color: '+hints[index][2]+';'"></div>
                    <div class="tipp" v-bind:style="'background-color: '+hints[index][3]+';'"></div>
                </div>
                <button class="cb col-2" @click="check(index)" v-if="index === guesses.length-1 && win === false">PRÜFEN</button><!-- mit diesem Knopf lässt sich die Eingabe überprüfen -->
                <button class="cb col-2" @click="surrender(index)" v-if="index === guesses.length-1 && win === false">AUFGEBEN</button>
                <button class="cb col-2" @click="neuladen()" v-if="index === guesses.length-1 && win === true">NEUSTART</button>
                <div id="count" v-if="index === guesses.length-1 && surrendered === false">{{index+1}}</div>
                <div id="timer" v-if="index === guesses.length-1 && surrendered === false">{{timer|timetranslate}}</div>
            </div>
            <div id="wbfooter"></div><!-- dient als simple anpassung des Viewpoints -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  //el: '#app',
  name: 'app',
  components: {
  },
  data() {
      return {
        manual: false,
        win: false, // wird auf true geschalltet wenn die Codes übereinstimmen. 
        surrendered: false,
        allcolors: ['red', 'green', 'blue', 'yellow', 'black', 'orange'], // der Array enthält alle verfügbaren Farben
        guesses: [['black', 'black', 'black', 'black']], // ein Array von Arrays in dem alle versuche aufgelistet sind
        sccode: ['', '', '', ''], // der geheime generierte Farbcode 
        hints: [['', '', '', '']], // die Hinweise, die als weisse und schwarze Kugeln aus gegeben werden
        wintext: ['S','I','E','G'],
        swinterval: null,
        timerstart: null,
        timer: 0,
        keep: []
      }
  },
  methods: {
    // um die Farbe der einzelnen divs zu ändern
    cchange: function(i, b, c) { // übergiebt den index der aktuellen Zeile, die Stelle (welche Kugel) und die stelle der Farbe aus dem "allcolors" Array
    this.guesses[i].splice(b,1,this.allcolors[c]) // geht zur aktuellen Zeile des "guesses" Array (i), zur richtigen stelle und übergiebt die stelle der Farben aus dem "allcolors" Array
    },
  // generiert den geheimen Farbcode
    generator: function() {
    var c = ['','','',''] // initialisiert den geheimen Farbcode
    for(var z = 0;z<=3;z++){ // füllt den "geheimen Farbcode"-Array mit zufälligen Farben aus dem "allcolors"-Array auf.
      c[z] = this.allcolors[Math.floor(Math.random()*6)]
    }
    this.sccode = c
      //console.log("secret-color-code: "+c)
    },
        //vergleicht den geheimen Farbcode mit der Eingabe
    check: function(i) {// i steht für index, sozusagen die Zeile des Arrays guesses
            
            if(this.guesses.length < 2){
                this.swinterval = setInterval(this.stopwatch,100)
            }

            var nextrow = this.guesses[i].slice() // kopiert die letzte Zeile des guesses Array als grundlage für den nächsten Versuch
            var guesseskopie = this.guesses[i].slice() // kopiert die letzte Zeile des guesses Array für den Vergleich mit dem geheimcode
            var sccodekopie = this.sccode.slice() // kopiert den geheimcode für den vergleich mit der guesseskopie
            /* ausgeben der Informationen in der Konsole
            console.log("nextrow: "+nextrow)
            console.log("guesseskopie: "+guesseskopie)*/
            
            // initialisieren der Variablen zum Vergleich vom Geheimcode und dem geratenen
            var same = 0
            var supersame = 0
            
            // durchläuft den geratenen Array 
            for(var c in guesseskopie) {
                if(guesseskopie[c] === sccodekopie[c]) {
                    // erhöht den Zähler, wenn sich eine Farbe in beiden Codes am gleichen Platz befindet
                    supersame++ 
                }
            }

            // durchläuft den geratenen Array innerhalb des generierten arrays
            for(var y in sccodekopie) {
                for(var x in guesseskopie) {
                    if(guesseskopie[x] === sccodekopie[y]) {
                        //console.log(guesseskopie[x]+ "=" +sccodekopie[y])
                        guesseskopie.splice(x, 1, '') // das löschen der Farben aus dem geratenen Code, verhindert das eine Farbe mehrmals gezählt wird
                        sccodekopie.splice(y, 1, '') // vielleich unnötig, erfordert mehr analyse
                        // erhöht den Zähler, wenn eine Farbe in beiden Codes vorhanden ist 
                        same++
                        break
                    }
                }
            }
            
            /* ausgeben der Tipps in der Konsole
            console.log("same: "+same)
            console.log("supersame: "+supersame)
            */

            // gibt die beiden Werte an die Funktion weiter, die für die ausgabe der Tipps zuständig ist
            this.hinter(same,supersame)

            // der Sieg wird allerdings noch hier eingeleitet
            if(supersame != 4){
                // gibt die nächste zeile aus, wenn das Spiel nicht gewonnen ist
                this.guesses.push(nextrow)
            }else{
                // leitet SIEG ein
                this.win = true
            }
            if(this.win && !this.surrendered){
                clearInterval(this.swinterval);
                setTimeout(function(){
                    var nickname = prompt("Please enter your name:", "");
                    if (nickname === null || nickname === "") {
                        //console.log("This isn't empty!")
                    } else {
                        var tries = app.guesses.length;
                        this.addEntry(this.nickname,tries,this.timer)
                    }
                   
                    
                }, 1000);
                //
            }
        },
        // gibt aufgrund des Vergleichs vom Geheimen Farbcode und der Eingabe einen Hinweis
        hinter: function(same,supersame) {
            var h = ['','','',''] // dieser Array wird der neu Tipp-block

            // füllt den Array mit weissen Kugeln, für vorhandene Farben auf
            if(same>0){
                for(var x = 0;x <same;x++) {
                    h[x] = 'white'
                }
            }

            // füllt/überschreibt den Array mit schwarzen Kugeln, für richtig platzierte Farben auf
            if(supersame>0){
                for(x = 0;x <supersame;x++) {
                    h[x] = 'black'
                }
            }

            // console.log("HINTS: "+this.guesses.length)

                this.hints.pop() // entfernt den leeren Tipp-block.
                this.hints.push(h) // fügt den neuen Tipp-block an.
                this.hints.push(['','','','']) // fügt einen leeren Tipp-block an, damit auf der aktuellen Zeile keine Tipps sind.
            window.scrollBy(0, 500) // scrolled den Bildshirm runter, damit nicht manuell gescrolled werden muss.
        },
        //  einfachste Version eines reset-buttons 
        neuladen: function(){
            location.reload(); // Seite wird einfach neu geladen
        }, 
        // ermöglicht das aufgeben, integriert die normale gewinn überprüfung
        surrender: function(i){
            clearInterval(this.swinterval);
            this.guesses[i] = this.sccode // ersetzt den ratecode durch den geheimcode, damit das Spiel als gewonnen angesehen und beendet wird.
            //this.wintext = ["L","O","S","T"] // Da das Spiel durch eine Aufgabe nicht gewonnen wird, wird der gewinntext ersetzt.
            this.surrendered = true // signalisiert dass das Spiel per aufgabe beendet wurde
            this.check(i) // löst die normale überprüfung aus  
        },
        manualcontrol: function(){
            if(this.manual){
                this.manual = false
            }else{
                this.manual = true
            }
        },
        stopwatch: function(){
            var now = new Date();
            if(this.timerstart === null){
                this.timerstart = now.getTime();
            }
            this.timer = (now.getTime() - this.timerstart);
        },
        async addEntry(nick, guesses, counter) {
            let score = {
                name: nick,
                tries: guesses,
                time: counter
            }
            this.keep.push(score)
            let result = await axios.post('/api/score', {name: score.name, tries: score.tries, time: score.time})
            score.id = result.data[0]
        }
  },
  filters: {
        timetranslate: function(t){
            var sec = Math.floor(t/1000)%60
            if (sec < 10) {
                sec = "0" + sec;
            }
            var min = Math.floor(t/(60000))%60
            return min + ":" + sec
        }
  },
  created() {
    this.generator()
  }
  
}
</script>

<style>

body{
    background-color:grey;
    margin: 0;
}

.sieg{
    padding: 1%;
    text-align: center;
}


.ball{
    width: 100%;
    height: 10%;
    position: relative;
}


.ball:after {
    content: "";
    display: block;
    padding-bottom: 100%;
}

p{
    text-align: center;
    padding: 0 10%;
}

a{
    text-decoration: none;
    border-right: solid white;
    border-top: solid white;
    padding-right: 1%;
    color: rgb(255, 255, 255);
    font-size: 3vw;
    text-align: left;
}


div div{
    float:left;
    border-radius: 100%;
}

.line{
    width: 100%;
    height: 80px;
}

.tipp{
    border-radius: 50%;
    margin: 5% 5% 5% 5%;
    width: 40%;
    
    position: relative;
}

.tippsfield{
    padding: 1%;
    width: 100%;
    position: relative;
}


.tippsfield:after{
    content: "";
    display: block;
    padding-bottom: 100%;
}

.tipp:after{
    content: "";
    display: block;
    padding-bottom: 100%;
}


.dropcontent {
    margin: 0;
    opacity: 0;
    position: absolute;
    width: 100%;
    z-index: 1;
}

.dropcontent button {
    border: none;
    border-radius: 50%;
    padding: 0;
    text-decoration: none;
    display: block;
    float: left;
    width: 50px;
    width: 50%;
    height: 33%;
}

.dropcontent:hover {
    opacity: 1;
    transition: 0.5s
}

.dropcontent{
    padding: 10%;
    width: 100%;
    height: 100%;
    transition: 1s;
}

.cb{
    background-color: rgba(255, 255, 255, 0); 
    border: 2px solid rgb(255, 255, 255);
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 2.5vw;
    height: 25%;
    margin-top: 1%;
}

.wintxt{
    padding: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    font-size: 12vw;
    text-align: center;
    color: rgb(255, 255, 255);
    z-index: 2;
}

[class*="btn-"]{
    font-size: 1.25vw
}

#count{
    text-align: center;
    font-size: 2vw;
    color: white;
    border-style: solid;
    border-width: 2px;
    border-color: white;
    border-radius: 0%;
    margin-top: 0.5%;
    width: 4%;
}

#timer{
    text-align: center;
    font-size: 2vw;
    color: white;
    border-style: solid;
    border-width: 2px;
    border-color: white;
    border-radius: 0%;
    margin-top: 0.5%;
    margin-left: 0.5%;
    width: 7%;
}

#wbfooter{
    height: 100px;
    width: 100%;
    margin: 0;
    position: static;
}

[class*="btn-"]{
    color: rgb(255, 255, 255);
}

.btn-1{ background-color: black;    }
.btn-2{ background-color: blue;     }
.btn-3{ background-color: yellow;
        color: black;               }
.btn-4{ background-color: red;      }
.btn-5{ background-color: orange;   }
.btn-6{ background-color: green;    }




* {
    font-family: "Arial", Arial, Helvetica, sans-serif;
    box-sizing: border-box;
    padding: 0px;
}

        
h1{
    margin: 0; 
    padding: 2%;
    padding-bottom: 0%;
    text-align: center;
    font-size: 10vw;
}

#manual{
    background-color: rgba(255, 255, 255, 0); 
    border: 1px solid rgb(255, 255, 255);
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1.5vw;
    margin-bottom: 1%;
    position: relative;
    left: 80%;
    top: -100%
}

header{
    background-color: rgb(0, 130, 180);
    border-bottom: solid;
    border-left: solid;
    border-right: solid;
    color: white;
}

.row::after {
    content: "";
    clear: both;
    display: table;
}

    /* mobile */
[class*="col-"] {
        width: 16.66%;
        float: left;
        
}


@media only screen and (min-width: 600px) {
    /* For tablets: */
    .col-s-1 {width: 8.33%;}
    .col-s-2 {width: 16.66%;}
    .col-s-3 {width: 25%;}
    .col-s-4 {width: 33.33%;}
    .col-s-5 {width: 41.66%;}
    .col-s-6 {width: 50%;}
    .col-s-7 {width: 58.33%;}
    .col-s-8 {width: 66.66%;}
    .col-s-9 {width: 75%;}
    .col-s-10 {width: 83.33%;}
    .col-s-11 {width: 91.66%;}
    .col-s-12 {width: 100%;}

    .title{margin: 0 12.5%;}

    .desc{margin: 0 12.5%;}

    .line{height: 150px;}


        
    .btn-1{ background-color: black; 
        color: white;}
    .btn-2{ background-color: blue; 
        color: white;}
    .btn-3{ background-color: yellow;
        color: black;}
    .btn-4{ background-color: red;
        color: black;}
    .btn-5{ background-color: orange;
        color: black;}
    .btn-6{ background-color: green; 
        color: white;}

    h1{font-size: 5vw;}

    #wbfooter{height: 300px;}

}



    /* Desktop*/
@media only screen and (min-width: 769px) {
    .col-1 {width: 8.33%;}
    .col-2 {width: 16.66%;}
    .col-3 {width: 25%;}
    .col-4 {width: 33.33%;}
    .col-5 {width: 41.66%;}
    .col-6 {width: 50%;}
    .col-7 {width: 58.33%;}
    .col-8 {width: 66.66%;}
    .col-9 {width: 75%;}
    .col-10 {width: 83.33%;}
    .col-11 {width: 91.66%;}
    .col-12 {width: 100%;}

    

    .menu{
        /*background-color: rgb(110, 110, 110);*/
        list-style: none;
        text-decoration: none;
        padding: 0px;
        display: block;
    }


    .title{margin: 0 12.5%;}

    .desc{margin: 0 12.5%;}
    
    .line{height: 200px;}

}


    /* Desktop L*/
    @media only screen and (min-width: 1100px) {
        .col-1 {width: 8.33%;}
        .col-2 {width: 16.66%;}
        .col-3 {width: 25%;}
        .col-4 {width: 33.33%;}
        .col-5 {width: 41.66%;}
        .col-6 {width: 50%;}
        .col-7 {width: 58.33%;}
        .col-8 {width: 66.66%;}
        .col-9 {width: 75%;}
        .col-10 {width: 83.33%;}
        .col-11 {width: 91.66%;}
        .col-12 {width: 100%;}
    
        
    
        .menu{
            /*background-color: rgb(110, 110, 110);*/
            list-style: none;
            text-decoration: none;
            padding: 0px;
            display: block;
        }
    
    
        .line{height: 250px;}

    
    }
    


   /* Desktop L*/
   @media only screen and (min-width: 1500px) {
    .col-1 {width: 8.33%;}
    .col-2 {width: 16.66%;}
    .col-3 {width: 25%;}
    .col-4 {width: 33.33%;}
    .col-5 {width: 41.66%;}
    .col-6 {width: 50%;}
    .col-7 {width: 58.33%;}
    .col-8 {width: 66.66%;}
    .col-9 {width: 75%;}
    .col-10 {width: 83.33%;}
    .col-11 {width: 91.66%;}
    .col-12 {width: 100%;}

    

    .menu{
        /*background-color: rgb(110, 110, 110);*/
        list-style: none;
        text-decoration: none;
        padding: 0px;
        display: block;
    }

    
    .line{height: 300px;}

}


 /* Desktop 4K*/
 @media only screen and (min-width: 2000px) {
    .col-1 {width: 8.33%;}
    .col-2 {width: 16.66%;}
    .col-3 {width: 25%;}
    .col-4 {width: 33.33%;}
    .col-5 {width: 41.66%;}
    .col-6 {width: 50%;}
    .col-7 {width: 58.33%;}
    .col-8 {width: 66.66%;}
    .col-9 {width: 75%;}
    .col-10 {width: 83.33%;}
    .col-11 {width: 91.66%;}
    .col-12 {width: 100%;}

    

    .menu{
        /*background-color: rgb(110, 110, 110);*/
        list-style: none;
        text-decoration: none;
        padding: 0px;
        display: block;
    }

    
    
    .line{height: 400px;}

    #wbfooter{height: 500px;}


}

</style>
