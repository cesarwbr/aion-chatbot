
var Matrix = function(){

    this.map = [];

    this.insert = function( options ){

        //Getting all words ( Assuming white space as separator)
        //Remove all special characteres except white spaces.
        var row    = options.input.replace(/[^a-zA-Z ]/g, "").trim().split(' ');
        this.map[ row ] = options.output;

    };

    this.best_match = function( ){
        //TODO
    };

    this.print = function(){
        console.log( this.map );
    };

};

//Testing node matrix.js

var mtx = new Matrix();
mtx.insert({
                input:"What is your name?",
                output:"My name is Teste!"
            });

mtx.insert({
                input:"How are you?",
                output:"I´m fine"
            });


mtx.print();