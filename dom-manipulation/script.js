// Array to hold quotes and categories
let quotes = [];
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API for simulation

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
  quoteDisplay.textContent = ''; // Clear previous content using textContent

  // Filter and display quotes based on the selected category
  const filteredQuotes = quotes.filter(quote => 
    selectedCategory === 'all' || quote.category === selectedCategory
  );

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `${quote.text} - ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);  // Append new text elements to the DOM
  });
}

// Function to dynamically populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');

  // Get unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];

  categoryFilter.textContent = ''; // Clear previous options using textContent
  const defaultOption = document.createElement('option');
  defaultOption.value = 'all';
  defaultOption.textContent = 'All Categories';
  categoryFilter.appendChild(defaultOption);

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category; // Use textContent for option text
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

// Function to simulate server sync
function syncWithServer() {
  fetch(API_URL)
    .then(response => response.json())
    .then(serverQuotes => {
      // Simulate server response structure with text and category
      const formattedServerQuotes = serverQuotes.map(q => ({
        text: q.title, // Simulating quote text with "title"
        category: "Server" // Assume a default category for server quotes
      }));

      const localDataUpdated = mergeServerData(formattedServerQuotes);
      
      if (localDataUpdated) {
        saveQuotes();
        displayNotification('Quotes synced with server. Conflicts resolved.', 'success');
      } else {
        displayNotification('No new quotes from server.', 'info');
      }
    })
    .catch(() => displayNotification('Error syncing with server.', 'error'));
}

// Function to merge server data and handle conflicts (server data takes precedence)
function mergeServerData(serverQuotes) {
  let dataUpdated = false;

  serverQuotes.forEach(serverQuote => {
    const existsLocally = quotes.some(localQuote => localQuote.text === serverQuote.text);

    if (!existsLocally) {
      quotes.push(serverQuote);  // Add new quote from server
      dataUpdated = true;
    }
  });

  return dataUpdated;
}

// Function to display sync or conflict notifications
function displayNotification(message, type) {
  const notificationDiv = document.getElementById('syncNotification');
  notificationDiv.textContent = message;
  notificationDiv.style.color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue';
}

// Periodic sync every 60 seconds
setInterval(syncWithServer, 60000);

// Load quotes from local storage on page load
loadQuotes();

// Event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for adding a new quote
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Event listener for exporting quotes to JSON
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);