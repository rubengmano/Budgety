// Budget Controller
var budgetController = (function() {

    // Function constructor has a capital letter so it's possible to distinguish from the others
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // An object to store all the data
    var data = {
        allItems: {
            // Arrays to store all expenses and incomes
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    // public methods
    return {
        addItem: function(type, des, val){
            var newItem, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1 ].id + 1;
            } else {
                ID = 0;
            }
            

            // Check the type to create a new element
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // Add the new item to the respective array
            data.allItems[type].push(newItem);
            return newItem;

        },
        test: function(){
            console.log(data);
        }
    };

})();

// IIFE - An anonymous function wrapped in parenthesis which is the
// immediately executed or invoked
// UI Controller
var UIController = (function() {

    // An object to save the name of the classes 
    // Good practice because if we need to change in html it's a serious problem
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    // Make the get methods private
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc for income or exp for expenses
                description: document.querySelector(DOMstrings.inputDescription).value, // To get the description
                value: document.querySelector(DOMstrings.inputValue).value // To get the value
            };   
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            // 1. Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">"%description%"</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">"%description%"</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // 2. Replace the placeholder with some actual data
            // replace the markers between the %% with the obj values
            newHtml = html.replace('%id%', obj.id);
            // now the hmtl var was replaced by the newHTML var
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // 3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        // A method to return the DOM strings
        getDOMstrings: function(){
            return DOMstrings;
        }
    };

})();

//Controller that makes the communication between the other two
// independet controllers
// Global App Controller
var controller = (function(budgetCtrl, IUCtrl){

    // private setup listeners function
    var setupEventListeners = function() {
        var DOM = IUCtrl.getDOMstrings();

        // This is a click event
        // The dot is the class selector
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // This is a event listener for the enter button
        document.addEventListener('keypress', function(event){

            // Good practice
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }        
        });
    };

    // private add item function
    var ctrlAddItem = function(){
        var input, newItem;
        // 1. Get the filed input data
        input = IUCtrl.getInput();
        console.log(input);

        // 2. Add the data to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the new item to the user interface
        IUCtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        // 5. Display the budget
    };

    // Making the init function public
    return {
        init: function() {
            console.log('The App has started.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Start the application
controller.init();

//Gitkracken test