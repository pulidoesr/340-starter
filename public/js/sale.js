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

function showFlashMessage(message, type = "error") {
    const flashContainer = document.getElementById("flash-message");

    if (!flashContainer) {
        console.error("Flash message container not found.");
        return;
    }

    // Set flash message content
    flashContainer.innerHTML = `<div class="flash-${type}">${message}</div>`;

    // Automatically hide the message after 3 seconds
    setTimeout(() => {
        flashContainer.innerHTML = "";
    }, 6000);
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

function recalculateAmounts() {
    const price = parseFloat(document.getElementById("inv_price").value) || 0;
    const discount = parseFloat(document.getElementById("invoice_discount").value) || 0;
    const taxRate = parseFloat(document.getElementById("invoice_tax_rate").value) || 0;

    // Ensure discount is not greater than price
    if (discount >= ( price * .10 )) {
        showFlashMessage("Discount cannot be greater than 10% of the price!", "error")
        document.getElementById("invoice_discount").value = 0;
        return;
    } else {
        showFlashMessage("Great discount!", "notice");
    }
    // Calculate taxable amount (price - discount)
    const taxableAmount = price - discount;

    // Calculate tax amount
    const taxAmount = (taxableAmount * taxRate) / 100;

    // Calculate total price
    const totalPrice = taxableAmount + taxAmount;

    // Update form fields
    document.getElementById("invoice_tax_amount").value = taxAmount.toFixed(2);
    document.getElementById("invoice_total").value = totalPrice.toFixed(2);
}

function validateDiscount() {
    const discount = parseFloat(document.getElementById("invoice_discount").value) || 0;
    const price = parseFloat(document.getElementById("inv_price").value) || 0;

    if (discount >= (price * .10)) {
        showFlashMessage("Discount cannot be greater than 10% of the price!", "error"); // ✅ Use flash message
        document.getElementById("invoice_discount").value = 0; // Reset to max allowed value
        document.getElementById("invoice_tax_amount").value = 0;
        document.getElementById("invoice_total").value = 0;
        recalculateAmounts();
        return false;
        } else recalculateAmounts()
    } 


function calculateTotal() {
  const price = parseFloat(document.getElementById("inv_price").value) || 0;
  const discount = parseFloat(document.getElementById("invoice_discount").value) || 0;
  const taxRate = parseFloat(document.getElementById("invoice_tax_rate").value) || 0;
  const taxAmount = (price - discount) * (taxRate / 100);
  document.getElementById("invoice_tax_amount").value = taxAmount.toFixed(2);
  document.getElementById("invoice_total").value = ((price - discount) + taxAmount).toFixed(2);
}

async function processSale() {
    
        const carElement = document.getElementById("car");
        const clientElement = document.getElementById("client");
        const priceElement = document.getElementById("inv_price");
        const discountElement = document.getElementById("invoice_discount");
        const taxRateElement = document.getElementById("invoice_tax_rate");
        const taxAmountElement = document.getElementById("invoice_tax_amount");
        const totalPriceElement = document.getElementById("invoice_total");

        
        clientName = clientElement.options[clientElement.selectedIndex]?.text;
        console.log("🔹 Selected Client Name:", clientName);
        
        // ✅ Ensure elements exist before accessing .value
        if (!carElement || !clientElement || !priceElement || !discountElement || 
            !taxRateElement || !taxAmountElement || !totalPriceElement ) {
            console.error("❌ Error: One or more form elements are missing.");
            showFlashMessage("Error: Some required fields are missing.", "error");
        return;
        }
        // ✅ Extract values properly
        const carId = carElement.value;
        const clientId = clientElement.value;
        const carPrice = parseFloat(priceElement.value) || 0;
        const discount = parseFloat(discountElement.value) || 0;
        const taxRate = (parseFloat(taxRateElement.value) / 100).toFixed(2) || 0;
        const taxAmount = parseFloat(taxAmountElement.value) || 0;
        const totalPrice = parseFloat(totalPriceElement.value) || 0;

        // ✅ Validate values before sending the request
       if (!carId || !clientId || !carPrice || !taxRate || !taxAmount || !totalPrice ) {
            console.error("❌ Error: Missing required data.");
            showFlashMessage("Please fill all required fields before processing the sale.", "error");
        return;
        }
        const saleData = {
            carId, clientId, carPrice, discount, taxRate, taxAmount, totalPrice
        };
        console.log("🔹 Sending sale data:", saleData); // ✅ Debugging log

        try {
            const response = await fetch("/sale/process-sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData),
            });
   
               
            if (!response.ok) {
                const text = await response.text(); // Read response as text
                console.error("❌ Error response from server:", text);
                showFlashMessage(`Server Error: ${response.status} ${response.statusText}`, "error");
                return;
            }
    
            const result = await response.json();
            console.log("✅ Sale Response:", result);
    
            if (response.ok) {
                console.log("✅ Sale Response:", result);
                showFlashMessage(`✅ Sale completed successfully! Invoice #${result.invoiceId} created for ${clientName}.`, "success");
                // ✅ Get previous page (fallback to `/account/accountview` if empty)
               const previousPage = document.referrer || "/account/accountview";
                // ✅ Redirect after 2 seconds
                setTimeout(() => {
                window.location.href = previousPage;
                }, 3000);
            } else {
                showFlashMessage(result.error, "error");
            }
        } catch (error) {
            console.log("❌ Error processing sale:", error);
            showFlashMessage("An unexpected error occurred. Please try again.", "error");
        }
    }