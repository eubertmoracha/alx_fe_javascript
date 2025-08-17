let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" - ${quote.category}`;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();
  }
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  const display = document.getElementById("quoteDisplay");
  display.innerText = filtered.length
    ? `"${filtered[0].text}" - ${filtered[0].category}`
    : "No quotes available for this category.";
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    quotes = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));
    saveQuotes();
    populateCategories();
    showRandomQuote();
    notifyUser("Quotes synced with server!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

function notifyUser(message) {
  const notification = document.createElement("div");
  notification.innerText = message;
  notification.style.background = "#dff0d8";
  notification.style.padding = "10px";
  notification.style.marginTop = "10px";
  document.body.appendChild(notification);
}

function syncQuotes() {
  fetchQuotesFromServer();
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

window.onload = () => {
  loadQuotes();
  populateCategories();
  const selected = localStorage.getItem("selectedCategory");
  if (selected) {
    document.getElementById("categoryFilter").value = selected;
    filterQuotes();
  } else {
    showRandomQuote();
  }
  syncQuotes();
};
