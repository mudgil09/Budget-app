var budgetController = (function() {
    var Expense = function(id, description, value) {
      this.id = id,
       this.description = description, 
       this.value = value,
      this.percentage=-1;};
    Expense.prototype.calcPercentage=function(totalIncome)
    {
      if(totalIncome>0)
      {
        this.percentage=Math.round((this.value/totalIncome)*100);
      }
      else{
        this.percentage=-1;
      }
    }
    Expense.prototype.getPercentage=function()
    {
      return this.percentage;
    }
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };
  
    var data = {
      allItems: { exp: [], inc: [] },
      totals: { exp: 0, inc: 0 },
      budget:0,
      percentage:-1
    };
  
    var calculateTotal = function(type){
  
      var sum=0;
      data.allItems[type].forEach(function(current)
      {
        sum=sum+current.value;
      });
      data.totals[type]=sum;
    };
    return {
      addItem: function(type, des, value) {
        var item, ID, lastID;
  
        
        if (data.allItems[type].length > 0) {
          lastID = data.allItems[type][data.allItems[type].length - 1].id;
          ID = lastID + 1;
        } else {
          ID = 0;
        }
  
        
        if (type === "inc") {
          item = new Income(ID, des, value);
        } else if (type === "exp") {
          item = new Expense(ID, des, value);
        }
  
        
        data.allItems[type].push(item);
  
        
        return item;
      },
      calculateBudget:function()
      {
        
        calculateTotal('exp');
        calculateTotal('inc');
  
        
        data.budget=data.totals.inc-data.totals.exp;
  
       
        if(data.totals.inc >0)
        {
          data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }
        else{
          data.percentage=-1;
        }
        
      },
      calculatePercentages:function()
      {
           data.allItems.exp.forEach(function(curr)
           {
             curr.calcPercentage(data.totals.inc);
           })
      },
  
      getPercentages:function()
      {
        var allPerc = data.allItems.exp.map(function(current)
        {
          return current.getPercentage();
        })
        return allPerc;
      },
      testingData: function() {
        console.log(data);
      },
      getBudget:function()
      {
        return{
            budget:data.budget,
            totalInc:data.totals.inc,
            totalExp:data.totals.exp,
            percentage:data.percentage
  
        };
      },
      deleteItem :function(type,ID)
      {
        var index;
        var ids = data.allItems[type].map(function(current)
        {
          return current.id;
        });
  
        index=ids.indexOf(ID);
        if(index!==-1)
        {
          data.allItems[type].splice(index,1);
        }
      }
    };
  })();
  
  var uiController = (function() {
    var DOMstrings = {
      inputType: ".add__type",
      inputDesc: ".add__description",
      inputValue: ".add__value",
      inputButton: ".add__btn",
      incomeList:".income__list",
      expenseList:".expenses__list",
      budgetLabel:'.budget__value',
      expenseLabel:'.budget__expenses--value',
      incomeLabel:'.budget__income--value',
      percentageLabel:'.budget__expenses--percentage',
      container:'.container',
      itemPercentage:'.item__percentage',
      dateLabel :'.budget__title--month'
    };
  
    var formatNumber=function(num,type)
    {
      var numSplit,int,dec;
  
      num=Math.abs(num);
      num=num.toFixed(2);
  
      numSplit = num.split('.');
      int = numSplit[0];
      if(int.length>3)
      {
        int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
      }
  
      dec=numSplit[1];
      return (type==='exp'?'-':'+')+int+'.'+dec;
    };
    var nodeListForeach = function(list,callback)
          {
            for(var i=0;i<list.length;i++)
            {
              callback(list[i],i);
            }
          };
    return {
      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDesc).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
      },
      addlistItem:function(obj,type)
      {
        var html,newHtml;
        if(type==='inc')
        {
          html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else{
          html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        newHtml=html.replace("%id%",obj.id);
        newHtml=newHtml.replace("%description%",obj.description);
        newHtml=newHtml.replace("%value%",formatNumber(obj.value,type));

        if(type==='inc')
        {
          const incomeList =document.querySelector(DOMstrings.incomeList);
          incomeList.insertAdjacentHTML('beforeend',newHtml);
        }
        else if(type==='exp')
        {
          const expenseList =document.querySelector(DOMstrings.expenseList);
          expenseList.insertAdjacentHTML('beforeend',newHtml);
        }
  
      },
      getDOMStrings: function() {
        return DOMstrings;
      },
      clearFeilds:function()
      {
        var feilds,feildItems;
        //Using querySelectorAll
        feilds = document.querySelectorAll(DOMstrings.inputDesc+','+DOMstrings.inputValue);
        
        //querySelectorAll returns a list
        //Tricking the slice method to think that list is an array
        feildItems=Array.prototype.slice.call(feilds);
  
        //Traversing through the array using foreach and callback method
        feildItems.forEach(function(current,index,array)
        {
          current.value="";
        });
  
      },
      displayBudget:function(budgetobj)
      {
        var type;
        if(budgetobj.budget>0) 
        {
          type='inc';
        }
        else{
          type='exp';
        }
        document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(budgetobj.budget,type);
        document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(budgetobj.totalInc,'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(budgetobj.totalExp,'exp');
        
        if(budgetobj.percentage>0)
        {
          document.querySelector(DOMstrings.percentageLabel).textContent=budgetobj.percentage+'%';
         
        }
        else{
          document.querySelector(DOMstrings.percentageLabel).textContent='---';
        }
      },
  
      deleteListItem : function(selectorId)
      {
        //In javascript, we can only delete a child node
        //So we first traverse to the parent node and then delete the child
  
        var el = document.getElementById(selectorId);
        el.parentNode.removeChild(el);
      },
      updateItemPerc(percentages)
      {
        //Returns a node list
          var feilds = document.querySelectorAll(DOMstrings.itemPercentage);
  
          
  
          nodeListForeach(feilds,function(current,index)
          {
            if(percentages[index]>0)
            {
              current.textContent=percentages[index]+'%';
            }
            else
            {
              current.textContent="--";
            }
              
          });
  
      },
      updateDate:function()
      {
        var now,months;
        now=new Date();
        month = now.getMonth();
        year=now.getFullYear();
        months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  
        document.querySelector(DOMstrings.dateLabel).textContent=months[month]+','+year;
  
      },
      changedType:function()
      {
        var feilds = document.querySelectorAll(
          DOMstrings.inputType+','+
          DOMstrings.inputValue+','+
          DOMstrings.inputDesc);
  
          nodeListForeach(feilds,function(cur)
          {
              cur.classList.toggle('red-focus');
          });
  
          document.querySelector(DOMstrings.inputButton).classList.toggle('red');
      }
    };
  })();
  
  
  var appController = (function(Uicntrl, budgetCtrl) {
    var setupEventListeners = function() {
      var DOM = Uicntrl.getDOMStrings();
      document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
      document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });
  
      document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener('change',Uicntrl.changedType);
    };
  
    var ctrlDeleteItem=function(event)
    {
      var itemId,splitid;
      itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
      if(itemId)
      {
        splitid=itemId.split('-');
        type=splitid[0];
        ID=parseInt(splitid[1]);
        budgetCtrl.deleteItem(type,ID);
        Uicntrl.deleteListItem(itemId);
        updateBudget();
        updatePercentage();
  
      }
    }
    var updateBudget=function ()
    {
      budgetCtrl.calculateBudget();
      var budget=budgetCtrl.getBudget();
    
      Uicntrl.displayBudget(budget);
    
    };
    var ctrlAddItem = function() {
      var inputData = Uicntrl.getInput();
      console.log(inputData);
  
      if(inputData.description!==""&& !isNaN(inputData.value) && inputData.value>0)
      {
            var newItem = budgetCtrl.addItem(
            inputData.type,
            inputData.description,
            inputData.value
            );
  
            Uicntrl.addlistItem(newItem,inputData.type);
  
            Uicntrl.clearFeilds();
  
            updateBudget();
  
            updatePercentage();
      }
      
  
      
    };
  
    var updatePercentage= function()
    {
      budgetCtrl.calculatePercentages();
      var percs = budgetCtrl.getPercentages();
      Uicntrl.updateItemPerc(percs);
    };
  
  
    return {
      init: function() {
        console.log("App has started");
        Uicntrl.updateDate();
        Uicntrl.displayBudget({budget:0,
          totalInc:0,
          totalExp:0,
          percentage:0});
        setupEventListeners();
      }
    };
  })(uiController, budgetController);
  
  appController.init();