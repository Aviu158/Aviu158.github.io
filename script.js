document.addEventListener("DOMContentLoaded", function() {
    const addIncomeBtn = document.getElementById('add-income-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const incomeDescriptionInput = document.getElementById('income-description');
    const incomeAmountInput = document.getElementById('income-amount');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseCategoryInput = document.getElementById('expense-category');
    const transactionList = document.getElementById('transaction-history');
    const totalExpense = document.getElementById('total-expenses');
    const totalIncome = document.getElementById('total-income');
    const balance = document.getElementById('balance');

    addIncomeBtn.addEventListener('click', function() {
        addTransaction('Income');
    });

    addExpenseBtn.addEventListener('click', function() {
        addTransaction('Expense');
    });

    clearAllBtn.addEventListener('click', clearAll);

    function addTransaction(type) {
        let description, amount, category;

        if (type === 'Income') {
            description = incomeDescriptionInput.value.trim();
            amount = parseFloat(incomeAmountInput.value.trim());
            category = 'Income';
        } else {
            description = expenseDescriptionInput.value.trim();
            amount = parseFloat(expenseAmountInput.value.trim());
            category = expenseCategoryInput.value;
        }

        if (description === '' || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        const transaction = {
            description: description,
            amount: amount,
            category: category,
            type: type
        };

        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        const transactionRow = document.createElement('tr');
        transactionRow.innerHTML = `
            <td>${description}</td>
            <td>${category}</td>
            <td>${amount.toFixed(2)}</td>
            <td>${type}</td>
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;
        transactionList.appendChild(transactionRow);

        transactionRow.querySelector('.delete-btn').addEventListener('click', function() {
            transactionRow.remove();
            removeTransaction(transaction);
            updateSummary();
        });

        updateSummary();
        clearInputs(type);
    }

    function removeTransaction(transactionToRemove) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        transactions = transactions.filter(function(transaction) {
            return !(transaction.description === transactionToRemove.description &&
                     transaction.amount === transactionToRemove.amount &&
                     transaction.category === transactionToRemove.category &&
                     transaction.type === transactionToRemove.type);
        });

        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        transactions.forEach(function(transaction) {
            addTransactionRow(transaction);
        });

        updateSummary();
    }

    function addTransactionRow(transaction) {
        const transactionRow = document.createElement('tr');
        transactionRow.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.type}</td>
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;
        transactionList.appendChild(transactionRow);

        transactionRow.querySelector('.delete-btn').addEventListener('click', function() {
            transactionRow.remove();
            removeTransaction(transaction);
            updateSummary();
        });
    }

    function updateSummary() {
        let totalExpenses = 0;
        let totalIncomes = 0;

        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        transactions.forEach(function(transaction) {
            if (transaction.type === 'Income') {
                totalIncomes += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
            }
        });

        totalExpense.textContent = totalExpenses.toFixed(2);
        totalIncome.textContent = totalIncomes.toFixed(2);

        const currentBalance = totalIncomes - totalExpenses;
        balance.textContent = currentBalance.toFixed(2);

        // Apply positive/negative class
        if (currentBalance >= 0) {
            balance.classList.remove('negative');
            balance.classList.add('positive');
        } else {
            balance.classList.remove('positive');
            balance.classList.add('negative');
        }
    }

    function clearInputs(type) {
        if (type === 'Income') {
            incomeDescriptionInput.value = '';
            incomeAmountInput.value = '';
        } else {
            expenseDescriptionInput.value = '';
            expenseAmountInput.value = '';
            expenseCategoryInput.value = 'Housing';
        }
    }

    function clearAll() {
        localStorage.removeItem('transactions');
        transactionList.innerHTML = '';
        updateSummary();
    }

    loadTransactions();
});
