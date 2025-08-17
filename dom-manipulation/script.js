// Initial Quotes Array
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');

// Function to Show a Random Quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Function to Add a New Quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText').value.trim();
  const categoryInput = document.getElementById('newQuoteCategory').value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    alert('New quote added successfully!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
