var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    this.percentage = totalIncome > 0 ? Math.round((this.value / totalIncome) * 100) : -1;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    data.totals[type] = data.allItems[type].reduce((sum, current) => sum + current.value, 0);
  };

  // ... (rest of your budgetController code)

  return {
    // ... (methods of budgetController)
  };
})();

var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    // ... (other DOM strings)
  };

  var formatNumber = function (num, type) {
    num = Math.abs(num).toFixed(2);
    return (type === 'exp' ? '-' : '+') + (num.length > 3 ? num.substr(0, num.length - 3) + ',' + num.substr(num.length - 3, 3) : num);
  };

  var nodeListForeach = (list, callback) => list.forEach(callback);

  // ... (rest of your uiController code)

  return {
    // ... (methods of uiController)
  };
})();

var appController = (function (Uicntrl, budgetCtrl) {
  var setupEventListeners = function () {
    var DOM = Uicntrl.getDOMStrings();
    document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", (event) => event.keyCode === 13 || event.which === 13 ? ctrlAddItem() : null);
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', Uicntrl.changedType);
  };

  // ... (rest of your appController code)

  return {
    init: () => {
      Uicntrl.updateDate();
      Uicntrl.displayBudget({ budget: 0, totalInc: 0, totalExp: 0, percentage: 0 });
      setupEventListeners();
    },
  };
})(uiController, budgetController);

appController.init();
