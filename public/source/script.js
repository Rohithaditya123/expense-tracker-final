/* =========================================================
   EXPENSE TRACKER - FINAL JAVASCRIPT
========================================================= */

const TRANSACTION_KEY = "expenseTrackerTransactions";
const BUDGET_KEY = "expenseTrackerBudget";
const THEME_KEY = "expenseTrackerTheme";

let transactions = loadTransactions();
let budget = loadBudget();

let spendingChartInstance = null;
let categoryChartInstance = null;
let toastTimer = null;


/* =========================================================
   STORAGE
========================================================= */

function loadTransactions() {
    try {
        const data = localStorage.getItem(TRANSACTION_KEY);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {
        console.error("Could not load transactions:", error);
        return [];
    }
}


function saveTransactions() {
    localStorage.setItem(
        TRANSACTION_KEY,
        JSON.stringify(transactions)
    );
}


function loadBudget() {
    try {
        const data = localStorage.getItem(BUDGET_KEY);

        if (!data) {
            return 0;
        }

        const parsed = JSON.parse(data);

        return Number(parsed) || 0;

    } catch (error) {
        console.error("Could not load budget:", error);
        return 0;
    }
}


function saveBudget() {
    localStorage.setItem(
        BUDGET_KEY,
        JSON.stringify(budget)
    );
}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(Number(amount) || 0);

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   USER PROFILE
========================================================= */

function loadUserProfile() {

    try {

        const data =
            localStorage.getItem("expenseTrackerCurrentUser");

        if (!data) {
            return;
        }

        const user = JSON.parse(data);

        const name = user.name || "User";
        const email = user.email || "user@email.com";

        /* Top profile */

        const topAvatar =
            document.getElementById("topProfileAvatar");

        const topName =
            document.getElementById("topProfileName");

        const topEmail =
            document.getElementById("topProfileEmail");


        /* Dashboard profile */

        const avatar =
            document.getElementById("profileAvatar");

        const nameElement =
            document.getElementById("profileName");

        const emailElement =
            document.getElementById("profileEmail");


        if (topAvatar) {
            topAvatar.textContent =
                name.charAt(0).toUpperCase();
        }

        if (topName) {
            topName.textContent = name;
        }

        if (topEmail) {
            topEmail.textContent = email;
        }


        if (avatar) {
            avatar.textContent =
                name.charAt(0).toUpperCase();
        }

        if (nameElement) {
            nameElement.textContent = name;
        }

        if (emailElement) {
            emailElement.textContent = email;
        }

    } catch (error) {

        console.error(
            "Could not load user profile:",
            error
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    localStorage.removeItem(
        "expenseTrackerLoggedIn"
    );

    localStorage.removeItem(
        "expenseTrackerCurrentUser"
    );

    window.location.href = "login.html";
}


/* Make available to HTML onclick */

window.logoutUser = logoutUser;


/* =========================================================
   CALCULATE TOTALS
========================================================= */

function calculateTotals() {

    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount) || 0;

        if (transaction.type === "income") {

            income += amount;

        } else if (transaction.type === "expense") {

            expenses += amount;

        }

    });


    const balance = income - expenses;

    return {
        income,
        expenses,
        balance,
        savings: balance
    };

}


/* =========================================================
   UPDATE DASHBOARD VALUES
========================================================= */

function updateDashboardValues() {

    const totals = calculateTotals();


    const balance =
        document.getElementById("balance");

    const income =
        document.getElementById("income");

    const expenses =
        document.getElementById("expenses");

    const savings =
        document.getElementById("savings");


    if (balance) {
        balance.textContent =
            formatCurrency(totals.balance);
    }

    if (income) {
        income.textContent =
            formatCurrency(totals.income);
    }

    if (expenses) {
        expenses.textContent =
            formatCurrency(totals.expenses);
    }

    if (savings) {
        savings.textContent =
            formatCurrency(totals.savings);
    }

}


/* =========================================================
   CATEGORIES
========================================================= */

const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Education",
    "Bills",
    "Entertainment",
    "Health",
    "Other"
];


const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other"
];


function updateCategories() {

    const category =
        document.getElementById("category");

    if (!category) {
        return;
    }


    const selectedType =
        document.querySelector(
            'input[name="type"]:checked'
        );


    const type =
        selectedType
            ? selectedType.value
            : "expense";


    const categories =
        type === "income"
            ? incomeCategories
            : expenseCategories;


    category.innerHTML =
        '<option value="">Select category</option>';


    categories.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item;
        option.textContent = item;

        category.appendChild(option);

    });

}


/* =========================================================
   TRANSACTION MODAL
========================================================= */

function openTransactionModal() {

    const modal =
        document.getElementById("transactionModal");

    if (!modal) {
        return;
    }

    updateCategories();

    modal.classList.add("active");

    modal.style.display = "flex";

}


function closeTransactionModal() {

    const modal =
        document.getElementById("transactionModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.style.display = "";

}


function resetTransactionForm() {

    const form =
        document.getElementById("transactionForm");

    if (!form) {
        return;
    }

    form.reset();

    const expenseRadio =
        document.querySelector(
            'input[name="type"][value="expense"]'
        );

    if (expenseRadio) {
        expenseRadio.checked = true;
    }

    updateCategories();

}


/* =========================================================
   ADD TRANSACTION
========================================================= */

function handleTransactionSubmit(event) {

    event.preventDefault();


    const typeElement =
        document.querySelector(
            'input[name="type"]:checked'
        );

    const description =
        document.getElementById("description");

    const amount =
        document.getElementById("amount");

    const category =
        document.getElementById("category");

    const date =
        document.getElementById("date");

    const account =
        document.getElementById("account");

    const notes =
        document.getElementById("notes");


    if (!typeElement ||
        !description ||
        !amount ||
        !category ||
        !date ||
        !account ||
        !notes) {

        return;
    }


    const type =
        typeElement.value;

    const descriptionValue =
        description.value.trim();

    const amountValue =
        Number(amount.value);

    const categoryValue =
        category.value;

    const dateValue =
        date.value;

    const accountValue =
        account.value;

    const notesValue =
        notes.value.trim();


    /* Validation */

    if (!descriptionValue) {

        showToast(
            "Missing information",
            "Please enter a description."
        );

        return;
    }


    if (!amountValue || amountValue <= 0) {

        showToast(
            "Invalid amount",
            "Please enter an amount greater than ₹0."
        );

        return;
    }


    if (!categoryValue) {

        showToast(
            "Missing category",
            "Please select a category."
        );

        return;
    }


    if (!dateValue) {

        showToast(
            "Missing date",
            "Please select the transaction date."
        );

        return;
    }


    if (!accountValue) {

        showToast(
            "Missing account",
            "Please select an account."
        );

        return;
    }


    const transaction = {

        id: Date.now(),

        type: type,

        description: descriptionValue,

        amount: amountValue,

        category: categoryValue,

        date: dateValue,

        account: accountValue,

        notes: notesValue

    };


    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    updateDashboardValues();

    updateCharts();

    updateBudget();

    closeTransactionModal();

    resetTransactionForm();


    showToast(
        "Transaction added",
        `${type === "income" ? "Income" : "Expense"} saved successfully.`
    );

}


/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {

    const list =
        document.getElementById("transactionList");

    const empty =
        document.getElementById("noTransactions");

    const searchInput =
        document.getElementById("searchInput");


    if (!list) {
        return;
    }
    function renderTransactionsPage(list) {

    const tableBody =
        document.getElementById("transactionsTableBody");

    const empty =
        document.getElementById("transactionsEmpty");

    if (!tableBody || !empty) {
        return;
    }

    tableBody.innerHTML = "";

    if (!list || list.length === 0) {
        empty.style.display = "flex";
        return;
    }

    empty.style.display = "none";

    list.forEach(function (transaction) {

        const row = document.createElement("tr");

        const amount = Number(transaction.amount) || 0;

        const amountClass =
            transaction.type === "income"
                ? "income-text"
                : "expense-text";

        const sign =
            transaction.type === "income"
                ? "+"
                : "-";

        row.innerHTML = `
            <td>
                <strong>
                    ${escapeHTML(transaction.description || "Untitled")}
                </strong>
            </td>

            <td>
                ${escapeHTML(transaction.category || "Other")}
            </td>

            <td>
                ${escapeHTML(transaction.account || "—")}
            </td>

            <td>
                ${formatDate(transaction.date)}
            </td>

            <td class="${amountClass}">
                <strong>
                    ${sign}${formatCurrency(amount)}
                </strong>
            </td>

            <td>
                ${escapeHTML(transaction.notes || "—")}
            </td>

            <td>
                <button
                    class="delete-transaction-btn"
                    onclick="deleteTransactionFromPage('${transaction.id}')"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


    const search =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    let filtered =
        transactions.filter(transaction => {

            const text = [

                transaction.description,

                transaction.category,

                transaction.account,

                transaction.notes

            ]
            .join(" ")
            .toLowerCase();


            return text.includes(search);

        });


    /* Newest first */

    filtered.sort((a, b) => {

        return new Date(b.date) - new Date(a.date);

    });


    list.innerHTML = "";


    if (filtered.length === 0) {

        if (empty) {
            empty.style.display = "flex";
        }

        return;

    }


    if (empty) {
        empty.style.display = "none";
    }


    filtered.forEach(transaction => {

        const row =
            document.createElement("tr");


        const amountClass =
            transaction.type === "income"
                ? "positive"
                : "negative";


        const amountSign =
            transaction.type === "income"
                ? "+"
                : "-";


        const formattedDate =
            formatDate(transaction.date);


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(transaction.description)}
                </strong>
            </td>

            <td>
                ${escapeHTML(transaction.category)}
            </td>

            <td>
                ${escapeHTML(transaction.account)}
            </td>

            <td>
                ${escapeHTML(formattedDate)}
            </td>

            <td class="${amountClass}">
                ${amountSign}${formatCurrency(transaction.amount)}
            </td>

            <td>
                ${escapeHTML(transaction.notes || "-")}
            </td>

            <td>

                <button
                    class="delete-btn"
                    type="button"
                    data-delete-id="${transaction.id}"
                    title="Delete transaction"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;


        list.appendChild(row);

    });

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString + "T00:00:00");


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   DELETE TRANSACTION
========================================================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item => Number(item.id) === Number(id)
        );


    if (!transaction) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            item => Number(item.id) !== Number(id)
        );


    saveTransactions();

    renderTransactions();

    updateDashboardValues();

    updateCharts();

    updateBudget();


    showToast(
        "Transaction deleted",
        "The transaction was removed."
    );

}


/* =========================================================
   CHARTS
========================================================= */

function updateCharts() {

    updateSpendingChart();

    updateCategoryChart();

}


/* =========================================================
   SPENDING CHART
========================================================= */

function updateSpendingChart() {

    const canvas =
        document.getElementById("spendingChart");

    const empty =
        document.getElementById("spendingEmpty");


    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const expenseTransactions =
        transactions.filter(
            transaction =>
                transaction.type === "expense"
        );


    if (expenseTransactions.length === 0) {

        if (empty) {
            empty.style.display = "flex";
        }

        if (spendingChartInstance) {

            spendingChartInstance.destroy();

            spendingChartInstance = null;

        }

        return;
    }


    if (empty) {
        empty.style.display = "none";
    }


    const labels = [];
    const values = [];


    for (let i = 6; i >= 0; i--) {

        const date = new Date();

        date.setHours(0, 0, 0, 0);

        date.setDate(date.getDate() - i);


        const dateString =
            date.toISOString().split("T")[0];


        labels.push(
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short"
                }
            )
        );


        let total = 0;


        expenseTransactions.forEach(
            transaction => {

                if (transaction.date === dateString) {

                    total +=
                        Number(transaction.amount) || 0;

                }

            }
        );


        values.push(total);

    }


    if (spendingChartInstance) {
        spendingChartInstance.destroy();
    }


    spendingChartInstance =
        new Chart(
            canvas.getContext("2d"),
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label: "Expenses",

                            data: values,

                            tension: 0.4,

                            fill: true,

                            borderWidth: 3,

                            pointRadius: 4,

                            pointHoverRadius: 6
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback: function(value) {

                                    return "₹" +
                                        Number(value).toLocaleString(
                                            "en-IN"
                                        );

                                }

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   CATEGORY CHART
========================================================= */

function updateCategoryChart() {

    const canvas =
        document.getElementById("categoryChart");

    const empty =
        document.getElementById("categoryEmpty");

    const donutTotal =
        document.getElementById("donutTotal");


    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const categoryTotals = {};


    transactions
        .filter(
            transaction =>
                transaction.type === "expense"
        )
        .forEach(transaction => {

            const category =
                transaction.category || "Other";


            categoryTotals[category] =
                (categoryTotals[category] || 0) +
                Number(transaction.amount);

        });


    const labels =
        Object.keys(categoryTotals);


    const values =
        Object.values(categoryTotals);


    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        );


    if (donutTotal) {

        donutTotal.textContent =
            formatCurrency(total);

    }


    if (labels.length === 0) {

        if (empty) {
            empty.style.display = "flex";
        }

        if (categoryChartInstance) {

            categoryChartInstance.destroy();

            categoryChartInstance = null;

        }

        return;

    }


    if (empty) {
        empty.style.display = "none";
    }


    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }


    categoryChartInstance =
        new Chart(
            canvas.getContext("2d"),
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            data: values,

                            borderWidth: 2
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "65%",

                    plugins: {

                        legend: {
                            position: "bottom"
                        }

                    }

                }

            }
        );

}


/* =========================================================
   BUDGET
========================================================= */

function openBudgetModal() {

    const modal =
        document.getElementById("budgetModal");

    const input =
        document.getElementById("budgetAmount");


    if (!modal) {
        return;
    }


    if (input && budget > 0) {

        input.value = budget;

    }


    modal.classList.add("active");

    modal.style.display = "flex";

}


function closeBudgetModal() {

    const modal =
        document.getElementById("budgetModal");


    if (!modal) {
        return;
    }


    modal.classList.remove("active");

    modal.style.display = "";

}


function updateBudget() {

    const budgetText =
        document.getElementById("budgetText");

    const budgetSpent =
        document.getElementById("budgetSpent");

    const budgetLimit =
        document.getElementById("budgetLimit");

    const progressFill =
        document.getElementById("progressFill");


    const totals =
        calculateTotals();


    const spent =
        totals.expenses;


    if (budgetText) {

        if (budget > 0) {

            budgetText.textContent =
                `${formatCurrency(spent)} of ${formatCurrency(budget)} used.`;

        } else {

            budgetText.textContent =
                "No budget has been set.";

        }

    }


    if (budgetSpent) {

        budgetSpent.textContent =
            `${formatCurrency(spent)} spent`;

    }


    if (budgetLimit) {

        budgetLimit.textContent =
            `${formatCurrency(budget)} budget`;

    }


    if (progressFill) {

        let percentage = 0;


        if (budget > 0) {

            percentage =
                (spent / budget) * 100;

        }


        percentage =
            Math.min(percentage, 100);


        progressFill.style.width =
            percentage + "%";

    }

}
function updateBudgetPage() {

    const limit = Number(budget) || 0;

    const totals = calculateTotals();

    const spent = totals.expenses;

    const remaining = Math.max(limit - spent, 0);

    let percentage = 0;

    if (limit > 0) {
        percentage = (spent / limit) * 100;
    }

    const displayPercentage = Math.round(percentage);


    // Budget Limit
    const limitElement =
        document.getElementById("pageBudgetLimit");

    if (limitElement) {
        limitElement.textContent =
            formatCurrency(limit);
    }


    // Total Spent
    const spentElement =
        document.getElementById("pageBudgetSpent");

    if (spentElement) {
        spentElement.textContent =
            formatCurrency(spent);
    }


    // Remaining
    const remainingElement =
        document.getElementById("pageBudgetRemaining");

    if (remainingElement) {
        remainingElement.textContent =
            formatCurrency(remaining);
    }


    // Used Percentage
    const percentageElement =
        document.getElementById("pageBudgetPercentage");

    if (percentageElement) {
        percentageElement.textContent =
            displayPercentage + "%";
    }


    // Progress bar
    const progressFill =
        document.getElementById("budgetProgressFill");

    if (progressFill) {
        progressFill.style.width =
            Math.min(percentage, 100) + "%";
    }


    // Progress percentage
    const progressPercent =
        document.getElementById("budgetProgressPercent");

    if (progressPercent) {
        progressPercent.textContent =
            displayPercentage + "%";
    }


    // Spent value
    const spentValue =
        document.getElementById("budgetSpentValue");

    if (spentValue) {
        spentValue.textContent =
            formatCurrency(spent);
    }


    // Limit value
    const limitValue =
        document.getElementById("budgetLimitValue");

    if (limitValue) {
        limitValue.textContent =
            formatCurrency(limit);
    }
}

/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const theme =
        localStorage.getItem(THEME_KEY);


    const isDark =
        theme === "dark";


    document.body.classList.toggle(
        "dark",
        isDark
    );


    updateThemeIcon();

}


function toggleTheme() {

    const isDark =
        document.body.classList.toggle("dark");


    localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
    );


    updateThemeIcon();

}


function updateThemeIcon() {

    const button =
        document.getElementById("themeToggle");


    if (!button) {
        return;
    }


    const icon =
        button.querySelector("i");


    if (!icon) {
        return;
    }


    const isDark =
        document.body.classList.contains("dark");


    if (isDark) {

        icon.className =
            "fa-solid fa-sun";

    } else {

        icon.className =
            "fa-solid fa-moon";

    }

}


/* =========================================================
   CLEAR ALL DATA
========================================================= */

function clearAllData() {

    if (transactions.length === 0 && budget === 0) {

        showToast(
            "Nothing to clear",
            "There is no financial data yet."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete all transactions and budget data?"
        );


    if (!confirmed) {
        return;
    }


    transactions = [];

    budget = 0;


    saveTransactions();

    saveBudget();


    renderTransactions();

    updateDashboardValues();

    updateCharts();

    updateBudget();


    showToast(
        "Data cleared",
        "All transaction and budget data has been removed."
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(title, message) {

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");


    if (!toast) {
        return;
    }


    if (toastTitle) {
        toastTitle.textContent = title;
    }


    if (toastMessage) {
        toastMessage.textContent = message;
    }


    toast.classList.add("show");

    toast.style.display = "flex";


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

            toast.style.display = "";

        }, 3000);

}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            function() {

                navLinks.forEach(item => {

                    item.classList.remove("active");

                });


                this.classList.add("active");

            }
        );

    });

}


/* =========================================================
   MODAL EVENTS
========================================================= */

function setupModalEvents() {

    /* Transaction buttons */

    const openTransaction =
        document.getElementById("openTransaction");

    const openTransaction2 =
        document.getElementById("openTransaction2");

    const emptyAddBtn =
        document.getElementById("emptyAddBtn");

    const closeTransaction =
        document.getElementById("closeTransaction");

    const cancelTransaction =
        document.getElementById("cancelTransaction");


    if (openTransaction) {

        openTransaction.addEventListener(
            "click",
            openTransactionModal
        );

    }


    if (openTransaction2) {

        openTransaction2.addEventListener(
            "click",
            openTransactionModal
        );

    }


    if (emptyAddBtn) {

        emptyAddBtn.addEventListener(
            "click",
            openTransactionModal
        );

    }


    if (closeTransaction) {

        closeTransaction.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    if (cancelTransaction) {

        cancelTransaction.addEventListener(
            "click",
            closeTransactionModal
        );

    }


    /* Budget buttons */

    const openBudget =
        document.getElementById("openBudget");

    const closeBudget =
        document.getElementById("closeBudget");

    const cancelBudget =
        document.getElementById("cancelBudget");


    if (openBudget) {

        openBudget.addEventListener(
            "click",
            openBudgetModal
        );

    }


    if (closeBudget) {

        closeBudget.addEventListener(
            "click",
            closeBudgetModal
        );

    }


    if (cancelBudget) {

        cancelBudget.addEventListener(
            "click",
            closeBudgetModal
        );

    }

}


/* =========================================================
   FORM EVENTS
========================================================= */

function setupForms() {

    const transactionForm =
        document.getElementById("transactionForm");


    if (transactionForm) {

        transactionForm.addEventListener(
            "submit",
            handleTransactionSubmit
        );

    }


    const budgetForm =
        document.getElementById("budgetForm");


    if (budgetForm) {

        budgetForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const input =
                    document.getElementById("budgetAmount");


                const value =
                    Number(input.value);


                if (!value || value <= 0) {

                    showToast(
                        "Invalid budget",
                        "Please enter a budget greater than ₹0."
                    );

                    return;

                }


                budget = value;

                saveBudget();

                updateBudget();

                closeBudgetModal();


                showToast(
                    "Budget saved",
                    "Your monthly budget has been updated."
                );

            }
        );

    }

}


/* =========================================================
   TYPE SWITCH
========================================================= */

function setupTypeSwitch() {

    const radios =
        document.querySelectorAll(
            'input[name="type"]'
        );


    radios.forEach(radio => {

        radio.addEventListener(
            "change",
            updateCategories
        );

    });

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        document.getElementById("searchInput");


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        renderTransactions
    );

}


/* =========================================================
   DELETE BUTTONS
========================================================= */

function setupDeleteButtons() {

    const list =
        document.getElementById("transactionList");


    if (!list) {
        return;
    }


    list.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "[data-delete-id]"
                );


            if (!button) {
                return;
            }


            const id =
                button.dataset.deleteId;


            deleteTransaction(id);

        }
    );

}


/* =========================================================
   CLEAR DATA BUTTON
========================================================= */

function setupClearButton() {

    const button =
        document.getElementById("clearData");


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        clearAllData
    );

}


/* =========================================================
   THEME BUTTON
========================================================= */

function setupThemeButton() {

    const button =
        document.getElementById("themeToggle");


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        toggleTheme
    );

}


/* =========================================================
   MODAL OVERLAY
========================================================= */

function setupOverlayClose() {

    const transactionModal =
        document.getElementById("transactionModal");

    const budgetModal =
        document.getElementById("budgetModal");


    if (transactionModal) {

        transactionModal.addEventListener(
            "click",
            function(event) {

                if (event.target === transactionModal) {

                    closeTransactionModal();

                }

            }
        );

    }


    if (budgetModal) {

        budgetModal.addEventListener(
            "click",
            function(event) {

                if (event.target === budgetModal) {

                    closeBudgetModal();

                }

            }
        );

    }

}


/* =========================================================
   ESC KEY
========================================================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Escape") {
                return;
            }


            closeTransactionModal();

            closeBudgetModal();

        }
    );

}


/* =========================================================
   INITIALIZE APP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadUserProfile();

        loadTheme();

        updateCategories();

        renderTransactions();

        updateDashboardValues();

        updateCharts();

        updateBudget();


        setupNavigation();

        setupModalEvents();

        setupForms();

        setupTypeSwitch();

        setupSearch();

        setupDeleteButtons();

        setupClearButton();

        setupThemeButton();

        setupOverlayClose();

        setupEscapeKey();

    }
);
