
/*
** L-Systems
* Cristian Rojas Cardenas, April 2022
* Algorithm based on the tutorial of Daniel Shiffman.
* See the video here: 
* https://www.youtube.com/watch?v=E1B4UoSQMFw
* 
* The algorithm operates under an axiom and a set of rules. The axiom is a chain of
* characters that established the initial state of the algorithm. The rules are a 
* set of substitutions that can be applied over a character in the string. For 
* instance:
* 
* For an Axiom:
*                                     A
* 
* And a set of rules:
*                                     A: AB
*                                     B: A
* 
* The first iteration will result in 
*                                     AB 
* 
* Then for the second and third iterations:
*                                     ABA -> ABAAB
* 
* In each iteration, the generate function applies the set of rules under the chain 
* of characters generating a new one.  These rules are iteratively operated for each 
* of the symbols. For this example, the axiom and the rules are defined as:
* 
* 	Axiom: 				Rules:
*             “F”               “F”: “FF+[+F-F-F]-[-F+F+F]”
* 
* Moreover, each of the symbols used in the chains of characters has a meaning for 
* the drawer:
* 
*         F: Draws a straight line of length “len”.
*         +: Rotates the reference point in the positive direction.
*         -: Rotates the reference point in the negative direction.
*         [: Save the current reference state.
*         ]: Discard the current reference state and retake the previously saved 
*             reference.
* 
* The turtle function is performed after the generation of each chain of characters 
* in every iteration and it evaluates each character of the current chain and draws 
* the corresponding meaning. 
* 
* Lastly, the parameters that set the length of the line and angle of rotation 
* (len, angle) are inputs of the algorithm that can be modified by the user. However, 
* the length of the line is a parameter that is updated in every iteration to half 
* of its value to generate the shape.
* 
*/

let len;
let texts = [];
let sentence;
let iteration; 

var axiom = "F";
var rules = {
    F: "FF+[+F-F-F]-[-F+F+F]",
}

// Settings, values used in the algorithm execution
let settings = { 
  Generate: function(){ generate(); },
  Reset: function(){ init(); },
  Len: 200,
  Angle: 30,
  Iteration: 0,
};

function gui(){
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings,'Iteration').listen();
    gui.add(settings,'Generate');
    gui.add(settings,'Reset');
    gui.add(settings,'Len', 50, 500).step(1);
    gui.add(settings,'Angle', -180, 180);
    
}

function setup(){
    gui();
    canvas = createCanvas(720, 400); 
    canvas.position(0, 0);
    background(255);
    init();
}

function init(){
    clear();
    removeTexts();

    settings.Iteration = 0;
    sentence = axiom; 
    loop = settings.Loops;
    len = settings.Len;
    texts = [];
    turtle();
    updateText();
}

function draw(){ 
}


// The generate function iterates through the sentence an evaluates all the rules
// to create the next.
function generate(){
    var nextSentence = "";
    for (var i = 0; i < sentence.length; i++){
        var current = sentence.charAt(i);
        if (current in rules){
            nextSentence += rules[current];
        } else {
            nextSentence += current;
        }
    }
    sentence = nextSentence;
    settings.Iteration++;
    turtle();
    updateText();
} 

function turtle(){
    len *= 0.5;
    push()
    translate(width/2, height);
    for (var i = 0; i < sentence.length; i++){
        var current = sentence.charAt(i);
        if (current == "F"){
            line(0, 0, 0, -len);
            translate(0, -len);
        } else if (current == "+"){
            rotate(radians(settings.Angle));
        } else if (current == "-"){
            rotate(-radians(settings.Angle));
        } else if (current == "["){
            push();                 // Save the current state
        } else if (current == "]"){
            pop();                  // Revert to the last saved state
        }
    }
    pop();
}

function updateText(){
    text = createP(sentence);
    text.addClass('sentences')
    texts.push(text);
}

function removeTexts(){
    texts.forEach(text => {
        text.remove();
    });
}


