const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Display a random quote based on filter
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for this category.</p>`;
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ✅ Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (newQuote.text && newQuote.category) {
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// ✅ Export quotes to JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Post quote to server (simulation)
function postQuoteToServer(quote) {
  fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(data => console.log("Posted to server:", data))
    .catch(error => console.error("Post error:", error));
}

// ✅ Fetch quotes from server and sync (required name)
function fetchQuotesFromServer() {
  fetch(SERVER_URL)
    .then(response => response.json())
    .then(serverData => {
      const serverQuotes = serverData.slice(0, 5).map(item => ({
        text: item.title || "Untitled",
        category: item.body ? item.body.split(" ")[0] : "General"
      }));
      quotes = serverQuotes; // Server data takes precedence
      saveQuotes();
      populateCategories();
      notifyUser("Quotes synced from server. Local data updated.");
      showRandomQuote();
    })
    .catch(error => console.error("Error syncing with server:", error));
}

// ✅ Show temporary notification
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.background = "#fffae6";
  notification.style.border = "1px solid #ccc";
  notification.style.padding = "10px";
  notification.style.margin = "10px 0";
  document.body.insertBefore(notification, quoteDisplay);
  setTimeout(() => notification.remove(), 5000);
}

// ✅ Populate category dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// ✅ Get filtered quotes based on category
function getFilteredQuotes() {
  const selected = categoryFilter.value;
  return selected === "all" ? quotes : quotes.filter(q => q.category === selected);
}

// ✅ Apply filter and update display
function filterQuotes() {
  showRandomQuote();
  localStorage.setItem("selectedCategory", categoryFilter.value);
}

// ✅ Initialize App
window.onload = function () {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `<p><strong>${lastQuote.category}:</strong> ${lastQuote.text}</p>`;
  }

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }

  populateCategories();
  showRandomQuote();
  fetchQuotesFromServer(); // Initial sync
};

// ✅ Auto-sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// ✅ Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
