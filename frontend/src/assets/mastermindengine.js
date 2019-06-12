var app = new Vue({
    el: '#app',
    data: {
        manual: false,
        win: false, // wird auf true geschalltet wenn die Codes übereinstimmen. 
        surrendered: false,
        allcolors: ['red', 'green', 'blue', 'yellow', 'black', 'orange'], // der Array enthält alle verfügbaren Farben
        guesses: [['black', 'black', 'black', 'black']], // ein Array von Arrays in dem alle versuche aufgelistet sind
        sccode: ['', '', '', ''], // der geheime generierte Farbcode 
        hints: [['', '', '', '']], // die Hinweise, die als weisse und schwarze Kugeln aus gegeben werden
        wintext: ['S','I','E','G']
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
            console.log("secret-color-code: "+c)
        },
        //vergleicht den geheimen Farbcode mit der Eingabe
        check: function(i) {// i steht für index, sozusagen die Zeile des Arrays guesses
            
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
            for(c in guesseskopie) {
                if(guesseskopie[c] === sccodekopie[c]) {
                    // erhöht den Zähler, wenn sich eine Farbe in beiden Codes am gleichen Platz befindet
                    supersame++ 
                }
            }

            // durchläuft den geratenen Array innerhalb des generierten arrays
            for(y in sccodekopie) {
                for(x in guesseskopie) {
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
                for(var x = 0;x <supersame;x++) {
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
            this.guesses[i] = this.sccode // ersetzt den ratecode durch den geheimcode, damit das Spiel als gewonnen angesehen und beendet wird.
            //this.wintext = ["L","O","S","T"] // Da das Spiel durch eine Aufgabe nicht gewonnen wird, wird der gewinntext ersetzt.
            this.check(i) // löst die normale überprüfung aus
            this.surrendered = true // signalisiert dass das Spiel per aufgabe beendet wurde
        },
        manualcontrol: function(){
            if(this.manual){
                this.manual = false
            }else{
                this.manual = true
            }
        }
    }      
})
// sorgt dafür das als erstes der Geheime Farbcode generiert wird
app.generator()