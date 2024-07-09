//fetch all elements in which you want to have dynamic functionality
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

//some random symbols
const randSymbol = `~'!@#$%^&*(){}[]?<>,._+-=/`;


//initial values
let password="";
let passwordLength = 10; //initial value of input slider
let checkCount=0; //no. of checkbox checked
handleSlider(); //initial call to set default values
//set strength circle to grey initially
setIndicator('#ccc');

//handle slider sets lengthDisplay according to slider value
//thus reflects changes to the ui
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //for slider set 2 colors for selected part and remaining part 
    //this is just for learning it doesn't work 
    const min = inputSlider.min;
    const max= inputSlider.max; //range
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"; //width% height% height set to 100
}

function setIndicator(color)
{
    //change style property of indicator div
    indicator.style.backgroundColor = color;

}

//range for this random int is min to max
function getRndInteger(min,max)
{   //Math.random range is [0,1) multiplited by (max-min) it gives range betwwen 0 to max-min so add min to it to get range between min to max
    return Math.floor(Math.random() * (max-min) + min);
}

function generateRandomNumber()
{
    return getRndInteger(0,9); //since digits from 0 to 9
}

function generateLowerCase(){
    //convert this number to char //since lowercase ascii is 97
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    //convert this number to char 
    return String.fromCharCode(getRndInteger(65,91)); //uppercase ascii from 65
}

function generateSymbol(){
    //use randSymb array and then generate a random Index
    let len = randSymbol.length;
    const randIndex = getRndInteger(0,len);
    return randSymbol.charAt(randIndex);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNumber = true;
    if (symbols.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0"); //strong password so green
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0"); //yellow if medium strength
    } else {
        setIndicator("#f00"); //red if low strength password
    }
}

//copy button
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText ="copied";
    }
    catch(e){
        copyMsg.innerText ="failed";
    }
    //to make copyMsg visible only for 2sec you use setTimeout function to remove it after 2 second
    copyMsg.classList.add('active');

    setTimeout( () => {
        copyMsg.classList.remove('active');
    },2000);
}

//e is the event i.e. giving current value of slider
inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value) //there exists a non null value for password input box
        copyContent();//call for copy content api
});


//find the count of checked items
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });


    //special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); //since password length has been changed reset slider values
    }
}


allCheckBox.forEach((checkbox) =>
{
    //if any checkbox is checked or unchecked i.e changed checkCount again
    checkbox.addEventListener('change' , handleCheckBoxChange);
});



function shufflePassword(array)
{
    //Fisher Yates method requires inout as array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


//generate password function
generateBtn.addEventListener('click',() => {
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //now find the new password for given constraints
     
    //remove old password
    password = "";
    //now for remaining left characters generate randomly chose

    let funcArr =[];

    if(uppercase.checked)
        funcArr.push(generateUpperCase);
    if(lowercase.checked)
        funcArr.push(generateLowerCase);
    if(numbers.checked)
        funcArr.push(generateRandomNumber);
    if(symbols.checked)
        funcArr.push(generateSymbol);

    //now make compulsory additions of 1 char for each checked value
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //for remaining chars fill them randomly
    for(let i=0;i<passwordLength - funcArr.length ; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password+=funcArr[randIndex]();
    }

    //now shuffle password for increased security
    password = shufflePassword(Array.from(password));
    
    //show in UI
    passwordDisplay.value = password;

    //now for each password calculate strength
    calcStrength();
});

