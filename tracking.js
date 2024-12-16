const errorMessage = document.getElementById("errorMessage");
const loader = document.getElementById("loader");
const trackingForm = document.querySelector(".tracking-form");
const trackingTimeline = document.getElementById("orderDetails");

// Check if there's data in localStorage and load it
window.addEventListener("load", () => {
  const storedData = localStorage.getItem("orderData");

  if (storedData) {
    const data = JSON.parse(storedData);
    loadOrderDetails(data);
    trackingForm.style.display = "none";
    trackingTimeline.style.display = "block";
  }
});

// Handle the "Back" button click
document.querySelector(".back-btn").addEventListener("click", () => {
  localStorage.removeItem("orderData"); // Clear stored data
  trackingForm.style.display = "block";
  trackingTimeline.style.display = "none";
});

document
  .getElementById("submitTracking")
  .addEventListener("click", async function () {
    const trackingNumber = document.getElementById("trackingNumber").value;

    // If no tracking number is entered, return
    if (!trackingNumber) {
      errorMessage.textContent = "Please enter a tracking number!";
      errorMessage.style.display = "block";
      return;
    }

    // Show the loader while waiting for the data
    loader.style.display = "flex";

    // Clear any previous error message
    errorMessage.style.display = "none";

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

      // Store data in localStorage
      localStorage.setItem("orderData", JSON.stringify(data));

      // Load and display the order details
      loadOrderDetails(data);

      // Show the order details section after successful API response
      trackingTimeline.style.display = "block";
    } catch (error) {
      // Hide the loader if there's an error
      loader.style.display = "none";

      // Display error message
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";

      // Don't hide the form if there was an error
      trackingForm.style.display = "block";
    }
  });

// Function to populate the order details section
function loadOrderDetails(data) {
  document.querySelector(".tracking-number").textContent = data.trackingNumber; // Tracking number from API
  document.querySelector(
    ".name"
  ).textContent = `${data.user.firstName} ${data.user.lastName}`; // User's full name
  document.querySelector(
    ".address"
  ).innerHTML = `${data.shipping.address}, <br />${data.shipping.city}, ${data.shipping.country}, ${data.shipping.zip}`;

  const timelineBoxesContainer = document.querySelector(".timeline-boxes");

  // Clear any previous timeline boxes before appending new ones
  timelineBoxesContainer.innerHTML = "";

  // Reverse the status history to show the latest event first
  const reversedStatusHistory = [...data.statusHistory].reverse();

  // Show the latest status in the "latest-status" div
  const latestStatus = reversedStatusHistory[0];
  const latestStatusDate = new Date(latestStatus.timestamp);
  document.querySelector(
    ".latest-status .status-date"
  ).textContent = `${latestStatusDate.toLocaleDateString()} | ${latestStatusDate.toLocaleTimeString()}`;
  document.querySelector(".latest-status .status-title").textContent =
    latestStatus.status;
  document.querySelector(".latest-status .status-description").textContent =
    latestStatus.desc;

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
