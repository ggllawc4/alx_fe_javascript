// Array to hold quotes and categories
let quotes = [];

// Load quotes from local storage when the page loads
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "In the end, we only regret the chances we didn’t take.", category: "Life" },
      { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
    ];
  }

  // Load the last selected category filter from local storage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
  }

  populateCategories();
  filterQuotes();
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display quotes based on the selected category filter
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  // Filter and display quotes based on the selected category
  const filteredQuotes = quotes.filter(quote => 
    selectedCategory === 'all' || quote.category === selectedCategory
  );

  filteredQuotes.forEach(quote => {
    quoteDisplay.innerHTML += `<p>${quote.text} - <strong>${quote.category}</strong></p>`;
  });

  // Save the selected category filter in local storage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to dynamically populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');

  // Get unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];

  // Remove any existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Dynamically add unique categories to the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.innerText = category;
    categoryFilter.appendChild(option);
  });
}

// Function to add a new quote to the array and update the display and categories
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  // Save the updated quotes to local storage
  saveQuotes();

  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";

  // Update the categories and display the quotes
  populateCategories();
  filterQuotes();
}

// Function to export quotes to JSON
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  // Use Blob and createObjectURL for the download functionality
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);  // Clean up the DOM
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        filterQuotes();
      } else {
        alert('Invalid JSON format. Please provide an array of quotes.');
      }
    } catch (e) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Load quotes from local storage on page load
loadQuotes();

// Event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for adding a new quote
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Event listener for exporting quotes to JSON
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);


// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();
      } else {
        alert('Invalid JSON format. Please provide an array of quotes.');
      }
    } catch (e) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Load quotes from local storage on page load
loadQuotes();

// Event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for adding a new quote
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Event listener for exporting quotes to JSON
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Initial quote display on page load
showRandomQuote();
