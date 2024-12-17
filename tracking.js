const errorMessage = document.getElementById("errorMessage");
const loader = document.getElementById("loader");
const trackingForm = document.querySelector(".tracking-form");
const trackingTimeline = document.getElementById("orderDetails");

// Function to get URL parameter (trackingNumber)
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to load order details from localStorage
function loadOrderDetailsFromLocalStorage() {
  const orderData = localStorage.getItem('orderData');
  
  if (orderData) {
    const data = JSON.parse(orderData);
    populateOrderDetails(data);
    trackingForm.style.display = "none";
    trackingTimeline.style.display = "block";
  }
}

// Function to populate the order details section
function populateOrderDetails(data) {
  document.querySelector(".tracking-number").textContent = data.trackingNumber;
  document.querySelector(".name").textContent = `${data.user.firstName} ${data.user.lastName}`;
  document.querySelector(".address").innerHTML = `${data.shipping.address}, <br />${data.shipping.city}, ${data.shipping.country}, ${data.shipping.zip}`;

  const timelineBoxesContainer = document.querySelector(".timeline-boxes");

  // Clear any previous timeline boxes before appending new ones
  timelineBoxesContainer.innerHTML = "";

  // Reverse the status history to show the latest event first
  const reversedStatusHistory = [...data.statusHistory].reverse();

  // Show the latest status in the "latest-status" div
  const latestStatus = reversedStatusHistory[0];
  const latestStatusDate = new Date(latestStatus.timestamp);
  document.querySelector(".latest-status .status-date").textContent = `${latestStatusDate.toLocaleDateString()} | ${latestStatusDate.toLocaleTimeString()}`;
  document.querySelector(".latest-status .status-title").textContent = latestStatus.status;
  document.querySelector(".latest-status .status-description").textContent = latestStatus.desc;

  // Loop through the reversed status history and create timeline boxes
  reversedStatusHistory.forEach((status) => {
    const timelineContainer = document.createElement("div");
    timelineContainer.classList.add("timeline-container");

    const dot = document.createElement("div");
    dot.classList.add("dot");

    const timelineBox = document.createElement("div");
    timelineBox.classList.add("timeline-box");

    const timestamp = new Date(status.timestamp);
    const statusDate = document.createElement("div");
    statusDate.classList.add("status-date");
    statusDate.textContent = `${timestamp.toLocaleDateString()} | ${timestamp.toLocaleTimeString()}`;

    const statusTitle = document.createElement("h4");
    statusTitle.classList.add("status-title");
    statusTitle.textContent = status.status;

    const statusDescription = document.createElement("p");
    statusDescription.classList.add("status-description");
    statusDescription.textContent = status.desc;

    timelineBox.appendChild(statusDate);
    timelineBox.appendChild(statusTitle);
    timelineBox.appendChild(statusDescription);

    timelineContainer.appendChild(dot);
    timelineContainer.appendChild(timelineBox);

    timelineBoxesContainer.appendChild(timelineContainer);
  });
}

// Check if there's a tracking number in the URL and autofill the input field
window.addEventListener("load", () => {
  // Try loading from localStorage first
  loadOrderDetailsFromLocalStorage();

  const trackingNumber = getUrlParameter("trackingNumber");

  if (trackingNumber) {
    // Autofill the input field
    document.getElementById("trackingNumber").value = trackingNumber;
    // Call the API to fetch order details
    fetchOrderDetails(trackingNumber);
  }
});

// Handle the "Back" button click
document.querySelector(".back-btn").addEventListener("click", () => {
  localStorage.removeItem("orderData");  // Clear stored order data
  window.history.back();  // Go back to the previous page
});

document
  .getElementById("submitTracking")
  .addEventListener("click", function () {
    const trackingNumber = document
      .getElementById("trackingNumber")
      .value.trim();

    // If no tracking number is entered, return
    if (!trackingNumber) {
      errorMessage.textContent = "Please enter a tracking number!";
      errorMessage.style.display = "block";
      return;
    }

    // Call the API to fetch order details
    fetchOrderDetails(trackingNumber);
  });

// Fetch order details from the API and populate the tracking page
async function fetchOrderDetails(trackingNumber) {
  loader.style.display = "flex";
  errorMessage.style.display = "none"; // Clear previous errors

  try {
    // Fetch the order details from the API
    const response = await fetch(
      `http://localhost:5000/api/order/${trackingNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    trackingForm.style.display = "none"; // Hide the form

    // Hide the loader
    loader.style.display = "none";

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error);
    }

    const data = await response.json();

    // Save order data to localStorage
    localStorage.setItem("orderData", JSON.stringify(data));

    // Populate the order details section
    populateOrderDetails(data);

    // Show the order details section after successful API response
    trackingTimeline.style.display = "block";
  } catch (error) {
    loader.style.display = "none";
    errorMessage.textContent = error.message;
    errorMessage.style.display = "block";
    trackingForm.style.display = "block";
  }
}




// 2) i want is whenever some comes from the home page or through direct link the api is called then when the user got the order details i want to reset the params what i mean is lets take an example if someone comes with direct link with id 5681 then the api will automatically get called 