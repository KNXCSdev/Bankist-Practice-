"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const user = document.querySelector(".navigation-user");
const password = document.querySelector(".navigation-pin");
const logbtn = document.querySelector(".navigation-button");
const welcome = document.querySelector(".navigation-welcome-message");
const container = document.querySelector(".app");

const movments = document.querySelector(".movments");
const movmentsValue = document.querySelector(".movments-value");
const balanceCurrent = document.querySelector(".balance-current-text");

const movmentDeposit = document.querySelector(".movments-deposit");
const movmentWithdrawal = document.querySelector(".movments-withdrawal");

const summaryIn = document.querySelector(".summary-value-in");
const summaryOut = document.querySelector(".summary-value-out");
const summaryInterest = document.querySelector(".summary-value-interest");

const btnTransfer = document.querySelector(".transfer-button");
const transferTo = document.querySelector(".transfer-form-to");
const transferAmount = document.querySelector(".transfer-form-amount");

const btnLoan = document.querySelector(".loan-button");
const loanAmount = document.querySelector(".loan-form-amount");

const closeAccount = document.querySelector(".close-form-user");
const closePin = document.querySelector(".close-form-pin");
const closeButton = document.querySelector(".close-button");

const btnSort = document.querySelector(".btn-sort");

function updateUI(acc) {
  calculateBalance(acc);
  displayMovements(acc.movements);
  displaySummary(acc.movements);
}

function create(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
create(accounts);

let currentAccount;
logbtn.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === user.value);
  console.log(currentAccount);

  if (user.value === currentAccount?.username && Number(password.value) === currentAccount?.pin) {
    welcome.textContent = `Welcome back, ${currentAccount.owner.split(" ").slice(0, 1)}!`;
    container.style.opacity = 100;

    user.value = user.value = "";
    password.value = "";
    password.blur();
    updateUI(currentAccount);
  }
});

function calculateBalance(acc) {
  acc.balance = acc.movements.reduce((acc, e) => acc + e, 0);
  balanceCurrent.textContent = `${acc.balance}€`;
}

function displayMovements(acc) {
  movments.innerHTML = "";

  acc.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = ` 
    <div class="movments-row">
          <div class="movments-type movments-${type}">${i + 1} ${type}</div>
          <div class="movments-value">${mov.toFixed(2)}€</div>
    </div>`;

    movments.insertAdjacentHTML("afterbegin", html);
  });
}

function displaySummary(acc) {
  const into = acc.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov);
  const out = acc.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov);

  summaryIn.textContent = `${into.toFixed(2)}€`;
  summaryOut.textContent = `${out.toFixed(2)}€`;
  summaryInterest.textContent = `${(into * 0.1).toFixed(2)}€`;
}

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const receiverAcc = accounts.find((acc) => acc.username === transferTo.value);
  const amount = Number(transferAmount.value);

  if (
    transferTo.value &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(Number(-transferAmount.value));
    receiverAcc.movements.push(Number(transferAmount.value));
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(loanAmount.value);

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  loanAmount.value = "";
});

closeButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    closeAccount.value === currentAccount?.username &&
    Number(closePin.value) === currentAccount?.pin
  ) {
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    container.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  if (sorted === false) {
    currentAccount.movements.sort((a, b) => a - b);
    sorted = true;
  } else if (sorted === true) {
    currentAccount.movements.sort((a, b) => b - a);
    sorted = false;
  }

  updateUI(currentAccount);
});
