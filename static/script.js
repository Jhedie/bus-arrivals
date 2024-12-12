function updateArrivals(data) {
  const bookingList = document.getElementById("calendarData");
  bookingList.innerHTML = "";
  data.forEach((arrival) => {
    const listItem = document.createElement("li");
    const formattedDate = new Date(arrival.expectedArrival).toLocaleString();
    listItem.innerText = `${arrival.lineName} to ${arrival.destinationName} arriving at ${formattedDate}`;
    bookingList.appendChild(listItem);
  });
}

document
  .getElementById("arrivalsEntryForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const locationElement = document.getElementById("location");

    const location = locationElement.value.replace(/\s+/g, "");
    fetch(`/location/${location}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const lat = data.result.latitude;
        const lon = data.result.longitude;
        fetch(`/stoppoints?lat=${lat}&lon=${lon}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const stopPointMenu = document.createElement("select");

            data.stopPoints.forEach((stoppoint) => {
              const option = document.createElement("option");
              option.id = "code";
              option.value = stoppoint.id; // Assuming each stop point has a unique ID
              option.innerText = `${stoppoint.commonName} (${stoppoint.indicator})`;
              stopPointMenu.appendChild(option);
            });

            const chooseStopContainer = document.getElementById("choose-stop");
            chooseStopContainer.innerHTML = "";
            chooseStopContainer.appendChild(stopPointMenu);
          })
          .catch((error) => {
            document.getElementById("message2").innerText =
              "An error occurred while fetching stop points. Please try again.";
          });
      })
      .catch((error) => {
        document.getElementById("message2").innerText =
          "An error occurred while fetching location data. Please try again.";
      });
  });

document
  .getElementById("proceed-button")
  .addEventListener("click", function (event) {
    console.log("clicked");
    const busCode = document.getElementById("code").value;
    fetch(`/${busCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("message").innerText = data.message;
        document.getElementById("message").style.color = "green";
        updateArrivals(data.data);
      })
      .catch((error) => {
        document.getElementById("message").innerText =
          "An error occurred. Please try again.";
      });
  });

function getUserLocation(postcode) {
  fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching postcode data:", error);
    });
}
