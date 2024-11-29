let gameActive = false;  
let score = 0;
function change(){
    x = document.getElementById("start");
    y = document.getElementById("next");
    if (!gameActive) {
        y.style.display = 'block';        
        x.innerText = "End";
        x.setAttribute('onclick', 'atEnd()');
        gameActive = true;
        genNum();
    } 
    
}
function next(){
    document.getElementById("ans").value = '';
    document.getElementById("feedback").innerHTML = null;

    genNum();
}

function genNum(){
    num1 = Math.floor(Math.random()*10)+1;
    num2 = Math.floor(Math.random()*10)+1;
    console.log(num1,num2);
    a = document.getElementById("num1");
    b = document.getElementById("num2");
    a.innerHTML = num1;
    b.innerHTML = num2;

}
function calc(event){
   const btnClicked = event.target;
   const btnText = btnClicked.innerText;
    c = document.getElementById("op");

    switch(btnText){
        case 'Addition':
            c.innerHTML = "+"
            break;
        case 'Subtraction':
            c.innerHTML = "-"
            break;
        case 'Multiplication':
            c.innerHTML = "*"
            break;
        case 'Division':
            c.innerHTML = "/"
            break;
    }
   }
 function checkAns(event){
    event.preventDefault();
   a = document.getElementById("num1").innerText;
    b = document.getElementById("num2").innerText;
    c = document.getElementById("op").innerText;
    d = document.getElementById("ans").value;
    console.log(d);
    console.log(c);

    switch(c){
        case '+':
            ans = parseInt(a)+parseInt(b);
            console.log(ans);
            break;
        case '-':
            
            ans = parseInt(a)-parseInt(b);
            break;
        case '*':
            
            ans = parseInt(a)*parseInt(b);
            break;
        case '/':
           
            ans = parseInt(a)/parseInt(b);
            break;
    }
    if(parseInt(d) ==ans)
    {
        document.getElementById("feedback").innerHTML = "You got correct answer!!"
        if(c == '+' || c== '-'){
            score+=2;
        }
        else{
            score+=4;
        }
        document.getElementById("scoreDisplay").innerText = score; 

    }
    else{
        document.getElementById("feedback").innerHTML = "Try again!!"
    }
    
 }
 
 function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    for (let i = 0; i <= 9; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
            document.getElementById('ans').value += i;
        });
        keyboard.appendChild(button);
    }
    const clearButton = document.createElement('button');
    clearButton.innerText = 'C';
    clearButton.addEventListener('click', () => {
        document.getElementById('ans').value = '';
    });
    keyboard.appendChild(clearButton);
}
function atEnd(){
    const x = document.getElementById("start");
    y = document.getElementById("next");
    y.style.display = 'none';
    x.innerText = "Start";
    x.setAttribute('onclick', 'change()');
    gameActive = false;
    document.getElementById("num1").innerHTML = null;
    document.getElementById("num2").innerHTML = null;
    document.getElementById("ans").value = '';
    document.getElementById("op").innerText = null;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", saveScoreUrl , true);  // 'save_score' should be the Django URL name
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', '{{ csrf_token }}');  // Include CSRF token for security

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Score saved successfully!");
        }
    };

    const data = JSON.stringify({
        'score': score,
        'game_name': 'Maths'  // Name of the game
    });
    xhr.send(data);

    score = 0; 
    
    document.getElementById("scoreDisplay").innerText = score; 


}
createKeyboard();