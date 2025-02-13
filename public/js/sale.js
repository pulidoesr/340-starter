async function fetchCars() {
  const classificationId = document.getElementById("classification").value;
  if (!classificationId) return;
  
  const response = await fetch(`/sale/cars/${classificationId}`);
  const cars = await response.json();
  
  const carSelect = document.getElementById("car");
  carSelect.innerHTML = '<option value="">Select Car</option>';
  cars.forEach(car => {
      carSelect.innerHTML += `<option value="${car.id}" data-price="${car.price}" data-miles="${car.miles}" data-color="${car.color}" data-img="${car.image}">${car.model}</option>`;
  });
}

function updateCarDetails() {
  const selectedCar = document.getElementById("car");
  const price = selectedCar.options[selectedCar.selectedIndex].dataset.price || 0;
  const miles = selectedCar.options[selectedCar.selectedIndex].dataset.miles || 0;
  const color = selectedCar.options[selectedCar.selectedIndex].dataset.color || "";
  const imgSrc = selectedCar.options[selectedCar.selectedIndex].dataset.img || "";

  document.getElementById("price").value = price;
  document.getElementById("miles").value = miles;
  document.getElementById("color").value = color;
  document.getElementById("carImage").src = imgSrc;
}

function calculateTotal() {
  const price = parseFloat(document.getElementById("price").value) || 0;
  const taxRate = parseFloat(document.getElementById("taxRate").value) || 0;
  const taxAmount = price * (taxRate / 100);
  document.getElementById("taxAmount").value = taxAmount.toFixed(2);
  document.getElementById("totalPrice").value = (price + taxAmount).toFixed(2);
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