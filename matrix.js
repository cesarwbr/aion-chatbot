

var split_input = function( options ){

    //Getting all words ( Assuming white space as separator)
    //Remove all special characteres except white spaces.
    var row    = options.input.replace(/[^a-zA-Z ]/g, "").trim().split(' ');
    var map    = [];
    map[ row ] = options.output;

    console.log( map );
};

//Testing node matrix.js
split_input({
                input:"What is your name?",
                output:"My name is Teste!"
            });