//captures all necessary DOM nodes
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const modifierButtons = document.querySelectorAll(".modifier");
const screenInterfaces = document.querySelectorAll(".screen");

//adds objects to organize each type of button and its properties
const numberButtonObj={};
const operatorButtonObj={};
const modifierButtonObj={};
const screenObj={};

//attaches each object type with an array of (DOM button id, event.key value) to be sorted by later function
operatorButtonObj.keyboardKeyArray = 
[   
    ["subtraction","-"],
    ["addition", "+"], 
    ["multiplication","*"], 
    ["division", "/"],
    ["sqrt", "s"],
    ["power", "^"],
    ["percentile", "%"],
    ["factorial", "!"],
    ["equal", "="],
]

numberButtonObj.keyboardKeyArray = 
[   
    ["nine","9"],
    ["eight", "8"], 
    ["seven","7"], 
    ["six", "6"],
    ["five", "5"],
    ["four", "4"],
    ["three", "3"],
    ["two", "2"],
    ["one", "1"],
    ["zero", "0"]
]

modifierButtonObj.keyboardKeyArray = 
[   
    ["decimalPoint","."],
    ["negative", "n"], 
    ["delete", "backspace"], 
    ["clear", "delete"],
    
]


const calculatorDisplay = {
    firstOperand : null,
    secondOperand : null,
    operandString : "",
    total : null,
    displayInputValue : "0",
    cdisplayTotalValue : "",
}

/*iterates over querySelectorAll variables and creates new objects as properties of argument object; 
assigns child objects with individual querySelector property */
function buildNodeListObj(queryAllArgument, objectArgument){      
    queryAllArgument.forEach(function(item){ 
        const name = item.id;
        const docQuery = document.querySelector(`#${name}`);
        
        objectArgument[name] = 
        {
            query: docQuery
        };
    })   
}

/*iterates over keyBoardArray property and attaches event.key values 
to an eventKey property for each button  */
function assignEventKeyValue(objectArgument){    
    if(objectArgument != screenObj){
        objectArgument.keyboardKeyArray.forEach(function(key){
            if(key[1] != ""){
                objectArgument[key[0]].eventKey = key[1]
            }
        })
    }
}

/*iterates over each objectProperty in the objectArgument and assigns click and keydown event listeners
based on the click and keydown properties of that objectProperty */
function assignEventListeners(objectArgument){
    for(const name in objectArgument){
        if(objectArgument != screenObj)
            if (objectArgument[name].clickFunction){
                objectArgument[name].query.addEventListener("click", objectArgument[name].clickFunction);
            }
            if (objectArgument[name].keydownFunction){
            document.addEventListener("keydown", objectArgument[name].keydownFunction);
        }
    }
}

//onclick/keypress functions (prototypal?)

//unique onclick/keydown functions to later attach to relevant buttons

function reset(){
    calculatorDisplay.firstOperand = null ;
    calculatorDisplay.secondOperand = null;
    calculatorDisplay.operandString = "";
    calculatorDisplay.total = null;
    calculatorDisplay.displayInputValue = "0";
    calculatorDisplay.displayTotalValue = "";
    calculatorDisplay.currentOperator = null;
    updateCalculatorDisplay(); 
}

function updateCalculatorDisplay(){
    screenObj.currentInput.query.textContent = calculatorDisplay.displayInputValue;
    screenObj.currentTotal.query.textContent = calculatorDisplay.displayTotalValue;
}

function backspaceDisplayInputValue(){
    if (calculatorDisplay.displayInputValue.length <=1){
        calculatorDisplay.displayInputValue = "0";
        calculatorDisplay.operandString = "";
    }else{
        calculatorDisplay.operandString = calculatorDisplay.operandString.split("").slice(0,calculatorDisplay.displayInputValue.length-1).join("");
        calculatorDisplay.displayInputValue = calculatorDisplay.operandString
    }
        updateCalculatorDisplay();   
}

function modifyPositiveNegative(){
    //save for post operators
}

function convertDisplayStringtoNumber(){
    if(calculatorDisplay.firstOperand == null){
        calculatorDisplay.firstOperand = Number(calculatorDisplay.operandString);
    }else{
        calculatorDisplay.secondOperand = Number(calculatorDisplay.operandString);
    }
}

function resetUnaryOperatortoNull(){
    if(calculatorDisplay.currentOperator == "sqrt" ||
       calculatorDisplay.currentOperator == "factorial" ||
       calculatorDisplay.currentOperator == "percentile"){
           calculatorDisplay.currentOperator = null;
       }
}

function addCalculatorOperations(){
    
    function addition(x,y){
        return x + y
    }

    function subtraction(x,y){
        return x - y
    }

    function multiplication(x,y){
        return x*y
    } 
            
    function division(x,y){
    return x / y
    }

    function power(x,y){
        return Math.pow(x,y)
    }

    function sqrt(x){
        return Math.pow(x,.5)
    }

    function percentile(x){
        return x/100
    }

    function factorial(x){
        if(x==1){
            return 1
        }else{
            return x*factorial(x-1)
        }
    }

    return{addition, subtraction, multiplication, division, power, sqrt, percentile, factorial}
}


//for-in loop to allocate appropriate operations to a property .calculate for each operator button

const calculatorOperations = addCalculatorOperations();

function assignCalculatorOperations(){
    for(operator in operatorButtonObj){
        const name = this.operator;
        operatorButtonObj[name].calculate = calculatorOperations[operator]
    }
}

//adds appropriate functions to each button for click and keydown listeners
function addClickKeydownFunctions(){
    
    function addClearFunction(){
        modifierButtonObj.clear.clickFunction = reset;
        modifierButtonObj.clear.keydownFunction = function(e){
            if (e.key == "Delete"){
                reset();
            }
        }
    } 

    function addNumberFunctions(){
        for(number in numberButtonObj){
            const name = this.number //without this, number stays equal to zero, is globally available?
            
            function addNonZeroNumber(){
                if(calculatorDisplay.operandString.length == 10){
                    return
                }else{          
                    if(calculatorDisplay.displayInputValue == "0"){
                        calculatorDisplay.operandString = `${numberButtonObj[name].eventKey}`
                        calculatorDisplay.displayInputValue = calculatorDisplay.operandString;
                        
                    }else{
                        calculatorDisplay.operandString += `${numberButtonObj[name].eventKey}`; 
                        calculatorDisplay.displayInputValue = calculatorDisplay.operandString;                    
                    }
                }
                updateCalculatorDisplay();
                resetUnaryOperatortoNull();
            }

            function addZeroNumber(){
                if(calculatorDisplay.displayInputValue == "0" ||
                    calculatorDisplay.operandString.length == 10){
                    return;
                }else{
                    calculatorDisplay.operandString += `${numberButtonObj[name].eventKey}`; 
                    calculatorDisplay.displayInputValue = calculatorDisplay.operandString;  
                }
                updateCalculatorDisplay();
                resetUnaryOperatortoNull();
            }

            if(number != "keyboardKeyArray" && 
                number != "zero"){
                    numberButtonObj[name].clickFunction = function(){
                        addNonZeroNumber()
                    }

                    numberButtonObj[name].keydownFunction = function(e){
                        if(e.key == `${numberButtonObj[name].eventKey}`){
                            addNonZeroNumber()
                        }
                    }
            }
            else if(number =="zero"){
                    numberButtonObj[name].clickFunction = function(){                                          
                        addZeroNumber();
                    }

                    numberButtonObj[name].keydownFunction = function(e){
                        if(e.key == `${numberButtonObj[name].eventKey}`){                           
                            addZeroNumber();
                        }
                    }
            }
        }
    }
    function addBackSpaceFunction(){
        modifierButtonObj.delete.clickFunction = backspaceDisplayInputValue;
        modifierButtonObj.delete.keydownFunction = function(e){
            if(e.key == "Backspace"){
                backspaceDisplayInputValue();
            }
        }
    }

    function addDecimalPointFunction(){

        function addDecimalPoint(){
            if(calculatorDisplay.operandString.length ==10||
                calculatorDisplay.operandString.includes(`${modifierButtonObj.decimalPoint.eventKey}`)){
                 return;
            }else if(calculatorDisplay.operandString == ""){
                calculatorDisplay.operandString = "0.";
                calculatorDisplay.displayInputValue = calculatorDisplay.operandString;
            
            }else{
                 
                 calculatorDisplay.operandString += `${modifierButtonObj.decimalPoint.eventKey}`;
                 calculatorDisplay.displayInputValue = calculatorDisplay.operandString;
             }
             updateCalculatorDisplay()
        }

        modifierButtonObj.decimalPoint.clickFunction = function(){
            addDecimalPoint()
        }
        modifierButtonObj.decimalPoint.keydownFunction = function(e){
            if(e.key == "."){
                addDecimalPoint()
            }
        }
    }

    function addOperatorFunctions(){
        for(operator in operatorButtonObj){
            const name = this.operator;

            function updateConditions(){
                calculatorDisplay.displayTotalValue = calculatorDisplay.total; 
                calculatorDisplay.firstOperand = calculatorDisplay.total;
                calculatorDisplay.operandString = "";
                if(name != "equal"){
                    calculatorDisplay.currentOperator = operatorButtonObj[name].calculate;
                }
            }

            
            function addUnaryOperators(){
                if(calculatorDisplay.total == "Error! Cannot divide by zero!"){
                    return;
                }
                else if(calculatorDisplay.operandString == ""){
                    if(calculatorDisplay.total == null){ 
                        calculatorDisplay.firstOperand = 0;
                    }else if(calculatorDisplay.total != null){
                        calculatorDisplay.firstOperand = calculatorDisplay.total;
                    }  
                }
                else{
                    calculatorDisplay.firstOperand = Number(calculatorDisplay.operandString)
                }
                    calculatorDisplay.total = operatorButtonObj[name].calculate(calculatorDisplay.firstOperand);
                    updateConditions();
                    updateCalculatorDisplay();
            }

            function addBinaryOperators(){
                
                if(calculatorDisplay.total == "Error! Cannot divide by zero!"){
                    return;
                }
                else if(calculatorDisplay.operandString != ""){
                    if(calculatorDisplay.total == null){
                        calculatorDisplay.total = Number(calculatorDisplay.operandString);
                    }else if(calculatorDisplay.total !=null){
                        calculatorDisplay.secondOperand = Number(calculatorDisplay.operandString)
                        if(calculatorDisplay.currentOperator != null){
                            if(calculatorDisplay.currentOperator == operatorButtonObj.division.calculate && calculatorDisplay.secondOperand == 0){
                                calculatorDisplay.total = "Error! Cannot divide by zero!"
                            }else{
                                calculatorDisplay.total = calculatorDisplay.currentOperator(calculatorDisplay.firstOperand,calculatorDisplay.secondOperand)
                            }
                        }
                    }
                    
                }         
                else if(calculatorDisplay.operandString == ""){
                    if(calculatorDisplay.total == null){
                        calculatorDisplay.total = 0;
                    }
                    
                }
                updateConditions() 
                updateCalculatorDisplay()  
            }

            function addEqualOperator(){
                if(calculatorDisplay.total == "Error! Cannot divide by zero!"){
                    return;
                
                }else if(calculatorDisplay.operandString != ""){
                    if(calculatorDisplay.total == null || calculatorDisplay.currentOperator == null ){
                        calculatorDisplay.total = Number(calculatorDisplay.operandString);
                    
                    }else{  
                        calculatorDisplay.secondOperand = Number(calculatorDisplay.operandString)
                            if(calculatorDisplay.currentOperator == operatorButtonObj.division.calculate && calculatorDisplay.secondOperand == 0){
                                calculatorDisplay.total = "Error! Cannot divide by zero!"
                            }else{
                                calculatorDisplay.total = calculatorDisplay.currentOperator(calculatorDisplay.firstOperand,calculatorDisplay.secondOperand)
                            }
                    }
                     
                    calculatorDisplay.displayTotalValue = calculatorDisplay.total; 
                    calculatorDisplay.firstOperand = calculatorDisplay.total;
                    calculatorDisplay.operandString = "";
                        
                    }

                    else if(calculatorDisplay.operandString == ""){
                        if(calculatorDisplay.total == null){
                            calculatorDisplay.total = 0;
                        }else if(calculatorDisplay.total != null){
                            if(calculatorDisplay.currentOperator == operatorButtonObj.sqrt.calculate ||
                               calculatorDisplay.currentOperator == operatorButtonObj.factorial.calculate ||
                               calculatorDisplay.currentOperator == operatorButtonObj.percentile.calculate){
                                    calculatorDisplay.total = calculatorDisplay.currentOperator(calculatorDisplay.total)
                            }
                            else if(calculatorDisplay.currentOperator == operatorButtonObj.addition.calculate ||
                                    calculatorDisplay.currentOperator == operatorButtonObj.subtraction.calculate ||
                                    calculatorDisplay.currentOperator == operatorButtonObj.multiplication.calculate ||
                                    calculatorDisplay.currentOperator == operatorButtonObj.division.calculate ||
                                    calculatorDisplay.currentOperator == operatorButtonObj.power.calculate){
                                        calculatorDisplay.total = calculatorDisplay.currentOperator(calculatorDisplay.total,calculatorDisplay.secondOperand)
                            }         
                        }
                    }
                    updateConditions() 
                    updateCalculatorDisplay()
            }
            
           
            if(operator == "sqrt" ||
               operator == "factorial" ||
               operator == "percentile"){
                operatorButtonObj[name].clickFunction = function(){
                        addUnaryOperators()
                }

                operatorButtonObj[name].keydownFunction = function(e){
                    if(e.key == operatorButtonObj[name].eventKey){
                        addUnaryOperators()
                    }
                }
            }
                
            else if(operator == "addition" ||
                    operator == "subtraction" ||
                    operator == "multiplication" ||
                    operator == "division" ||
                    operator == "power"){      
                    operatorButtonObj[name].clickFunction = function(){
                        addBinaryOperators()
                    }

                    operatorButtonObj[name].keydownFunction = function(e){
                        if(e.key == operatorButtonObj[name].eventKey){
                            addBinaryOperators()
                        }
                    }
                
            }

            else if(operator == "equal"){
                operatorButtonObj[name].clickFunction = function(){
                    addEqualOperator()
                }

                operatorButtonObj[name].keydownFunction = function(e){
                    if(e.key == operatorButtonObj[name].eventKey){
                        addEqualOperator()
                    }
                }
            }
    }   }    
    
//check all hard-coding of (e.key == eventkey) to see if variable event keys work
    function addPositiveNegativeFunction(){
        function addRemoveNegativeSign(){
            if(calculatorDisplay.operandString == ""){
                return
            }
            else if(calculatorDisplay.operandString.includes("-")){
                calculatorDisplay.operandString = calculatorDisplay.operandString.replace("-","")
                calculatorDisplay.displayInputValue = calculatorDisplay.operandString;
            }else{
                calculatorDisplay.operandString = `-${calculatorDisplay.operandString}`;
                calculatorDisplay.displayInputValue = calculatorDisplay.operandString
            }
            updateCalculatorDisplay();
        }
            modifierButtonObj.negative.clickFunction = function(){
                addRemoveNegativeSign()
            }
            modifierButtonObj.negative.keydownFunction = function(e){
                if(e.key == modifierButtonObj.negative.eventKey){
                    addRemoveNegativeSign()
                }
            }
        
    }

    addClearFunction();
    addNumberFunctions();
    addBackSpaceFunction();
    addDecimalPointFunction();
    addOperatorFunctions();
    addPositiveNegativeFunction();


}

buildNodeListObj(numberButtons,numberButtonObj);
buildNodeListObj(modifierButtons, modifierButtonObj);
buildNodeListObj(operatorButtons, operatorButtonObj);
buildNodeListObj(screenInterfaces, screenObj);

assignEventKeyValue(numberButtonObj);
assignEventKeyValue(modifierButtonObj);
assignEventKeyValue(operatorButtonObj);

assignCalculatorOperations();

addClickKeydownFunctions();

assignEventListeners(numberButtonObj);
assignEventListeners(modifierButtonObj);
assignEventListeners(operatorButtonObj);



