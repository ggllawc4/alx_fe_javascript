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

// Function to fetch quotes from the server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);  // Await the fetch call
    const serverQuotes = await response.json();  // Await the response parsing

    // Simulate server response structure with text and category
    return serverQuotes.map(q => ({
      text: q.title, // Simulating quote text with "title"
      category: "Server" // Assume a default category for server quotes
    }));
  } catch (error) {
    throw new Error('Error fetching quotes from the server');
  }
}

// Function to post a new quote to the server using async/await with POST method
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',  // Using POST method to send data to the server
      headers: {
        'Content-Type': 'application/json',  // Set content type to JSON
      },
      body: JSON.stringify(quote)  // Send the quote as JSON
    });
    const result = await response.json();  // Parse the server's response
    return result;
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

// Function to sync quotes (fetch and update quotes from the server)
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();  // Await the fetching of server quotes
    const localDataUpdated = mergeServerData(serverQuotes);

    if (localDataUpdated) {
      saveQuotes();
      displayNotification('Quotes synced with server!', 'success');
    } else {
      displayNotification('No new quotes from server.', 'info');
    }
  } catch (error) {
    displayNotification('Error syncing with server.', 'error');
  }
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
setInterval(syncQuotes, 60000);  // Changed from syncWithServer to syncQuotes

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
async function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);

  // Save the updated quotes to local storage
  saveQuotes();

  // Post the new quote to the server
  await postQuoteToServer(newQuote);

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

// Load quotes from local storage on page load
loadQuotes();

// Event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for adding a new quote
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Event listener for exporting quotes to JSON
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);