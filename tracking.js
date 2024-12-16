document
  .getElementById("submitTracking")
  .addEventListener("click", async function () {
    const trackingNumber = document.getElementById("trackingNumber").value;

    // If no tracking number is entered, return
    if (!trackingNumber) {
      alert("Please enter a tracking number");
      return;
    }

    // Show the loader while waiting for the data
    document.getElementById("loader").style.display = "block";
    document.querySelector(".tracking-form").style.display = "none"; // Hide the form

    // Clear any previous error message
    document.getElementById("errorMessage").style.display = "none";

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

      // Hide the loader
      document.getElementById("loader").style.display = "none";

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error);
      }

      const data = await response.json();

      // Update the tracking number and shipping address
      document.querySelector(".tracking-number").textContent =
        data.trackingNumber; // Tracking number from API
      document.querySelector(
        ".name"
      ).textContent = `${data.user.firstName} ${data.user.lastName}`; // User's full name
      document.querySelector(
        ".address"
      ).innerHTML = `${data.shipping.address}, <br />${data.shipping.city}, ${data.shipping.country}, ${data.shipping.zip}`;

      // Get the container where the timeline boxes should be appended
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
        // Create a new timeline container and box
        const timelineContainer = document.createElement("div");
        timelineContainer.classList.add("timeline-container");

        const dot = document.createElement("div");
        dot.classList.add("dot");

        const timelineBox = document.createElement("div");
        timelineBox.classList.add("timeline-box");

        // Format timestamp to a readable date and time format
        const timestamp = new Date(status.timestamp);
        const statusDate = document.createElement("div");
        statusDate.classList.add("status-date");
        statusDate.textContent = `${timestamp.toLocaleDateString()} | ${timestamp.toLocaleTimeString()}`; // Format timestamp to date and time

        const statusTitle = document.createElement("h4");
        statusTitle.classList.add("status-title");
        statusTitle.textContent = status.status; // Status from API

        const statusDescription = document.createElement("p");
        statusDescription.classList.add("status-description");
        statusDescription.textContent = status.desc; // Description from API

        // Append all the elements together
        timelineBox.appendChild(statusDate);
        timelineBox.appendChild(statusTitle);
        timelineBox.appendChild(statusDescription);

        timelineContainer.appendChild(dot);
        timelineContainer.appendChild(timelineBox);

        // Append the new timeline container to the main timeline boxes container
        timelineBoxesContainer.appendChild(timelineContainer);
      });

      // Show the order details section after successful API response
      document.getElementById("orderDetails").style.display = "block";
    } catch (error) {
      // Hide the loader if there's an error
      document.getElementById("loader").style.display = "none";

      // Display error message
      document.getElementById("errorMessage").textContent = error.message;
      document.getElementById("errorMessage").style.display = "block";

      // Don't hide the form if there was an error
      document.querySelector(".tracking-form").style.display = "block";
    }
  });
