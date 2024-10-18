// Array to hold quotes and categories
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the end, we only regret the chances we didn’t take.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${quote.text} - <strong>${quote.category}</strong></p>`;
  }

  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    
    const quoteTextInput = document.createElement('input');
    quoteTextInput.setAttribute('id', 'newQuoteText');
    quoteTextInput.setAttribute('type', 'text');
    quoteTextInput.setAttribute('placeholder', 'Enter a new quote');
    
    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.setAttribute('id', 'newQuoteCategory');
    quoteCategoryInput.setAttribute('type', 'text');
    quoteCategoryInput.setAttribute('placeholder', 'Enter quote category');
    
    const addButton = document.createElement('button');
    addButton.innerText = 'Add Quote';
    addButton.addEventListener('click', addQuote);
    
    formContainer.appendChild(quoteTextInput);
    formContainer.appendChild(quoteCategoryInput);
    formContainer.appendChild(addButton);
    
    document.body.appendChild(formContainer);
  }
  
  // Function to add a new quote to the array and update the display
  function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Simple validation to ensure both fields are filled
    if (quoteText === "" || quoteCategory === "") {
      alert("Please enter both a quote and a category.");
      return;
    }
  
    // Add the new quote to the quotes array
    quotes.push({ text: quoteText, category: quoteCategory });
  
    // Clear the form inputs
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  
    // Show the new quote added
    showRandomQuote();
  }
  
  // Event listener for showing a new random quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  //  show a random quote and create the add quote form
  showRandomQuote();
  createAddQuoteForm();
  