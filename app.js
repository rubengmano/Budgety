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

    // Private function to calculate the total of incomes or expenses depending on the type
    var calculateTotal = function(type){
        var sum = 0;
        // Foreach to calculate the sum of all the elements of an array
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        // Store the correspondent sum in the global data structure
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id){
            var index, ids;

            // map() receives a callback function which has access to the current element, the current index
            // and the entire array
            // creates an array with the ids of the elements
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            // returns the index number of the element of the array with the correspondent id
            index = ids.indexOf(id);

            if(index !== -1){
                // splice method
                // 1st argument is the position number where it starts to delete
                // 2nd arg is the numbers of elements that are going to be deleted
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){
            
            // Calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that was spent
            // Math.round() rounds the final number to the closer integer
            // The if is necessary because it is not possible to devide by zero
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        // Function to return the budget data structure
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    // Make the get methods public
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc for income or exp for expenses
                description: document.querySelector(DOMstrings.inputDescription).value, // To get the description
                // Parse float converts a string into a decimal number
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // To get the value
            };   
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            // 1. Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">"%description%"</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">"%description%"</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

        // method to delete an Item from the UI
        deleteListItem: function(selectorID){

            // select the element
            var el = document.getElementById(selectorID);
            // remove the element
            // select the parent node
            // select the child and remove the proper element
            el.parentNode.removeChild(el);

        },

        // A method to clear the input fields
        clearFields: function(){
            var fields, fieldsArr;
            // The syntax is like css selecting so to separate diferent selectors just use a ','
            // the fields var is now a list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // tricks the slice function to receive a List and return an Array
            // usually the slice function only receives and returns arrays
            fieldsArr = Array.prototype.slice.call(fields);

            // for each loop
            // current -> current element being processed
            // index number -> goes from zero to the length - 1
            // array - entire array
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            // set the focus on the first element of the array
            fieldsArr[0].focus(); 
        },

        // A method to display the budget in the interface
        displayBudget: function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

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

        // Event delegation in the parent element
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget
        IUCtrl.displayBudget(budget);
    };

    // private add item function
    var ctrlAddItem = function(){
        var input, newItem;
        // 1. Get the filed input data
        input = IUCtrl.getInput();

        // check if description field is filled
        // check if value is in fact a value
        // check if value is greater than 0
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add the data to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the user interface
            IUCtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            IUCtrl.clearFields();

            // 5. Calculate and Update budget
            updateBudget();
        }

    };

    // private delete item function
    // the event is necessary to know what the target element is
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

        // traversing the DOM
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){

            // inc-1
            // split method to split the string and returns an array with [inc, 1]
            splitID = itemID.split('-');
            type = splitID[0];
            // the id needs to be an integer in order to work
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item form the UI
            IUCtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

        }

    };

    // Making the init function public
    return {
        init: function() {
            console.log('The App has started.');
            IUCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Start the application
controller.init();