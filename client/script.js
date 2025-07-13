document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit-btn").addEventListener("click", submitCustomer);
  document.getElementById("add-button").addEventListener("click", () => toggleCard("Add Customer"));
  loadCustomers();
});

let editMode = false;
let editId = null;

function toggleCard(title = "Add Customer") {
  const card = document.getElementById("card-overlay");
  const cardTitle = document.getElementById("card-title");
  card.style.display = card.style.display === "flex" ? "none" : "flex";
  cardTitle.textContent = title;
}

const submitCustomer = async () => {
  const name = document.getElementById("customerName").value.trim();
  const amount = document.getElementById("creditAmount").value.trim();

  if (!name || !amount) {
    alert("Please fill all the fields");
    return;
  }

  const customerData = { name, amount};

  try {
    let response;

    if (editMode && editId) {
      //  Update request
      response = await fetch(`/api/customer/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      });
    } else {
      //  Create request
      response = await fetch("/api/customer/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      });
    }

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Failed to submit customer");
      return;
    }

    alert(result.message || "Success");

    // Reload table data
    await loadCustomers();

    // Reset form
    document.getElementById("customerName").value = "";
    document.getElementById("creditAmount").value = "";
    toggleCard();

    // Reset edit mode
    editMode = false;
    editId = null;

  } catch (error) {
    console.error("Submission error:", error);
    alert("Request failed: " + error.message);
  }
};

async function loadCustomers() {
  try {
    const res = await fetch("/api/customer/all");
    const customers = await res.json();

    const tableBody = document.querySelector("#customerTable tbody");
    tableBody.innerHTML = "";

    let totatCredit = 0;

    customers.forEach(customer => {
      const row = document.createElement("tr");

      const amount = Number(customer.amount || 0);
      totatCredit += amount;

      row.innerHTML = `
        <td>${customer.name}</td>
        <td>$${customer.amount}</td>
        <td>
          <button class="delete-btn" data-id="${customer._id}">Delete</button>
          <button class="edit-btn" data-id="${customer._id}">Edit</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // updating the total amount of credit in the heading
    document.getElementById("totalCreditAmount").textContent = `$${totatCredit}`;
  } catch (error) {
    console.error("Error loading customers:", error);
    alert("Failed to load customers");
  }
}

document.addEventListener("click", async function (e) {
  // Delete customer
  if (e.target.classList.contains("delete-btn")) {
    const customerId = e.target.dataset.id;
    const row = e.target.closest("tr");

    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await fetch(`/api/customer/delete/${customerId}`, {
        method: "DELETE"
      });
      const result = await res.json();

      if (res.ok) {
        row.remove();
        alert("Customer deleted successfully");
      } else {
        alert(result.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  }

  // Edit customer
  if (e.target.classList.contains("edit-btn")) {
    const customerId = e.target.dataset.id;
    const row = e.target.closest("tr");
    const name = row.querySelector("td:nth-child(1)").textContent.trim();
    const amount = row.querySelector("td:nth-child(2)").textContent.replace('$', '').trim();

    document.getElementById("customerName").value = name;
    document.getElementById("creditAmount").value = amount;

    editMode = true;
    editId = customerId;

    toggleCard("Edit Customer");
  }
});

// for the search option

document.addEventListener("DOMContentLoaded", function () {
  const searchInputs = document.querySelectorAll("#searchInput, #searchInput2");

  searchInputs.forEach(input => {
    input.addEventListener("input", async function () {
      const searchValue = this.value.trim();

      try {
        const res = await fetch(`/api/customer/search?name=${encodeURIComponent(searchValue)}`);
        const customers = await res.json();
        renderCustomerTable(customers);
      } catch (err) {
        console.error("Error searching:", err);
      }
    });
  });
});



function renderCustomerTable (customers) {
  const tableBody = document.querySelector("#customerTable tbody");
  tableBody.innerHTML = ""; // here i cleared existing rows

  customers.forEach(customer => {
    const row = document.createElement("tr");
    row.innerHTML =` 
     <td>${customer.name}</td>
      <td>$${customer.amount}</td>
      <td>
        <button class="delete-btn" data-id="${customer._id}">Delete</button>
        <button class="edit-btn" data-id="${customer._id}">Edit</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}