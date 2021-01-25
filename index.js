// Account Data
const account1 = {
  owner: "Luke Skywalker",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: "Katniss Everdeen",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.9,
  pin: 2222
};

const account3 = {
  owner: "Harry Potter",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: "Elle Woods",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Variables for HTML Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Creating Usernames
const createUsernames = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createUsernames(accounts);

//Logging in
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Login");

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //validating credentials
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI + welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";

    //update UI
    updateUI(currentAccount);
  }
});

//Displaying transactions
const displayTransactions = function (transactions, sort = false) {
  //setter
  containerTransactions.innerHTML = "";

  const trans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;

  trans.forEach(function (transaction, i) {
    const type = transaction > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="transactions__date">3 days ago</div>
        <div class="transactions__value">$${transaction}</div>
      </div>
    `;

    containerTransactions.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.transactions.reduce((acc, tran) => acc + tran, 0);
  labelBalance.textContent = `$${acc.balance} USD`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.transactions
    .filter((tran) => tran > 0)
    .reduce((acc, tran) => acc + tran, 0);

  labelSumIn.textContent = `$${incomes}`;

  const out = acc.transactions
    .filter((tran) => tran < 0)
    .reduce((acc, tran) => acc + tran, 0);

  labelSumOut.textContent = `$${Math.abs(out)}`;

  const interest = acc.transactions
    .filter((tran) => tran > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //to exclude interest amounts that are less than $1
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `$${interest}`;
};
