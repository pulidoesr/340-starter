async function fetchCars() {

  const classificationId = document.getElementById("classification").value;
  if (!classificationId) return;

  const carDropdown = document.getElementById("car");

  // Clear previous options
  carDropdown.innerHTML = '<option value="">Select a Car</option>';

  if (!classificationId) {
      console.log("No classification selected.");
      return;
  }

  try {
      const response = await fetch(`/sale/cars/${classificationId}`);
      if (!response.ok) {
          throw new Error("Failed to fetch cars.");
      }

      const cars = await response.json();

      // ✅ Ensure correct data mapping
      cars.forEach(car => {
          let option = document.createElement("option");

          // ✅ Ensure valid data exists
          option.value = car.inv_id || "";  // Fallback to empty if car_id is undefined
          option.textContent = car.inv_make && car.inv_model && car.inv_year 
              ? `${car.inv_make} ${car.inv_model} - ${car.inv_year}`
              : "Unknown Car";

          carDropdown.appendChild(option);
      });

  } catch (error) {
      console.error("Error fetching cars:", error);
  }
}

async function updateCarDetails() {
  const carDropdown = document.getElementById("car");
  const carSelected = carDropdown.value;

  console.log("Selected Car ID:", carSelected); // ✅ Debugging log

  if (!carSelected) {
      console.warn("No car selected.");
      return;
  }

  try {
      const response = await fetch(`/sale/car-details/${carSelected}`);

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
          console.error("Fetch error:", response.status, response.statusText);
          return;
      }
      if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text(); // Read as text
          console.error("Error: Expected JSON but received HTML:", text);
          return;
      }

      const car = await response.json(); // ✅ Parse JSON safely
      console.log("Car Details Received:", car);

      // Update UI elements with car details
      document.getElementById("inv_image").src = car.inv_image || "default.jpg";
      document.getElementById("inv_price").value = car.inv_price || "N/A";
      document.getElementById("inv_miles").value = car.inv_miles || "N/A";
      document.getElementById("inv_color").value = car.inv_color || "N/A";

  } catch (error) {
      console.error("Error fetching car details:", error);
  }
}

function calculateTotal() {
  const price = parseFloat(document.getElementById("inv_price").value) || 0;
  const taxRate = parseFloat(document.getElementById("invoice_tax_rate").value) || 0;
  const taxAmount = price * (taxRate / 100);
  document.getElementById("invoice_tax_amount").value = taxAmount.toFixed(2);
  document.getElementById("invoice_total").value = (price + taxAmount).toFixed(2);
}

async function processSale() {
  const carId = document.getElementById("car").value;
  const clientId = document.getElementById("client").value;
  const taxRate = document.getElementById("taxRate").value;
  const totalPrice = document.getElementById("totalPrice").value;

  const response = await fetch("/sale/process-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId, clientId, taxRate, totalPrice })
  });

  const result = await response.json();
  alert(result.message);
  if (result.success) window.location.reload();
}

