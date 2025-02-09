"use strict";


// Select Inv Item Activity
// Get a list of vehicles in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value;
    console.log(`classificationId is: ${classification_id}`);

    if (classification_id) {
        let classIdURL = `/inv/getInventory/${classification_id}`
        console.log("Fetching inventory from:", classIdURL);
        fetch(classIdURL)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("No inventory found");
            })
            .then(function (data) {
                console.log(data);
                buildInventoryList(data);
            })
            .catch(function (error) {
                clearInventoryList();
                console.log("JSON fetch error: ", error.message);
                throw new Error("Fetch of JSON data failed.");
                
            });
    }
});

// ✅ Function to clear inventory list
function clearInventoryList() {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    inventoryDisplay.innerHTML = `
        <thead>
            <tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>
        </thead>
        <tbody>
            <tr><td colspan="3">No inventory found.</td></tr>
        </tbody>`;
}

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");

    // Set up the table labels
    let dataTable = "<thead>";
    dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
    dataTable += "</thead>";

    // Set up the table body
    dataTable += "<tbody>";

    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    });

    dataTable += "</tbody>";

    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
}
