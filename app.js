const addCostButton = document.querySelector('.add__btn');
const incomeListDom = document.querySelector('.income__list');
const expenseListDom = document.querySelector('.expenses__list');
const deleteButton = document.querySelector('.item__delete--btn');
const container = document.querySelector('.container');
const updateDateDom = document.querySelector('.budget__title--month');
let count = 0;

updateDateDom.textContent = `${moment().format('MMMM YYYY')}`;

class Transaction {
  constructor(description, cost) {
    this.amount = cost;
    this.description = description;
    this.date = moment().format('MMM. Do, YYYY');
    this.id = count;
    count++;
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.totalIncomeAmount = 0;
    this.totalExpenseAmount = 0;
  }

  addNewTransaction(description, cost) {
    if (cost >= 0) {
      this.incomeList.push(new Transaction(description, cost));
      this.totalIncomeAmount += parseFloat(cost);
    } else {
      this.expenseList.push(new Transaction(description, cost.toString().substring(1)));
      this.totalExpenseAmount += parseFloat(cost.toString().substring(1));
    }

    this.listTransactionInDom(this.incomeList, incomeListDom);
    this.listTransactionInDom(this.expenseList, expenseListDom);
    this.updateDashboard();
  }

  listTransactionInDom(listName, location) {
    location.textContent = '';
    let totalAmount = this.totalIncomeAmount;
    listName.forEach(function(element) {
      let amount, percentage = ``;
      if (location === expenseListDom) {
        amount = `- $${parseFloat(element.amount).toFixed(2)}`;
        percentage = `
          <div class="item__percentage">
            ${Math.floor((element.amount / totalAmount) * 100)}%
          </div>
        `;
      } else {
        amount = `+ $${parseFloat(element.amount).toFixed(2)}`;
      }

      location.insertAdjacentHTML('afterbegin', `
        <div class="item" data-transaction-id="${element.id}">
          <div class="item__description">${element.description}</div>            
          <div class="right">
          <div class="item__value">${amount}</div>
            ${percentage}
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
          <div class="item__date">${element.date}</div>
        </div>
      `);
    });
  }

  removeTransaction(id, local) {
    if (local === "income") {
      for (let i = 0; i < this.incomeList.length; i++) {  
        if (this.incomeList[i].id === parseInt(id)) {
          this.totalIncomeAmount -= this.incomeList[i].amount;
          this.incomeList.splice(i,1);
        }                  
      }
      
      this.listTransactionInDom(this.expenseList, expenseListDom);
    } else {
      for (let i = 0; i < this.expenseList.length; i++) {  
        if (this.expenseList[i].id === parseInt(id)) {
          this.totalExpenseAmount -= this.expenseList[i].amount;
          this.expenseList.splice(i,1);
        }                  
      }
    }

    this.updateDashboard();
  }

  updateDashboard() {
    const income = document.querySelector('.budget__income--value');
    const expense = document.querySelector('.budget__expenses--value');
    const totalBudget = document.querySelector('.budget__value');
    const totalExpensePercentage = document.querySelector('.budget__expenses--percentage');
    income.textContent = `+ $${this.totalIncomeAmount.toFixed(2)}`;
    expense.textContent = `- $${this.totalExpenseAmount.toFixed(2)}`;
    if (this.totalIncomeAmount - this.totalExpenseAmount > 0) {
      totalBudget.textContent = `+ $${(this.totalIncomeAmount - this.totalExpenseAmount).toFixed(2)}`;
    } else if (this.totalIncomeAmount - this.totalExpenseAmount < 0) {
      totalBudget.textContent = `- $${((this.totalIncomeAmount - this.totalExpenseAmount).toFixed(2)).substring(1)}`;
    } else {
      totalBudget.textContent = `$ 0.00`;
    }

    if (this.totalExpenseAmount === 0 && this.totalIncomeAmount === 0) {
      totalExpensePercentage.textContent = `0%`;
    } else {
      totalExpensePercentage.textContent = `${Math.floor((this.totalExpenseAmount / this.totalIncomeAmount) * 100)}%`;
    }
  }
}

addCostButton.addEventListener('click', e => {
  const description = document.querySelector('.add__description');
  const cost = document.querySelector('.add__value');
  
  if (description.value !== "" && cost.value !== "") {
    transactionList.addNewTransaction(description.value, cost.value);
    description.value = "";
    cost.value = "";
  }
});

container.addEventListener('click', e => {
  if (e.target.nodeName === "I") {
    const item = e.path[4].dataset.transactionId;     
    if (e.path[6].className === "income") {
      transactionList.removeTransaction(item, "income");
    } else {
      transactionList.removeTransaction(item, "expense");
    }

    e.path[4].remove();
  }
});

const transactionList = new TransactionList();