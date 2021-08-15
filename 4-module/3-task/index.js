function highlight(table) {
  let tableBody = table.tBodies[0];
  Array.prototype.forEach.call(tableBody.rows, (row) => {
    let available = row.querySelector("[data-available]");
    if (available) {
      if (available.attributes["data-available"].value === "true")
        row.classList.add("available");
      if (available.attributes["data-available"].value === "false")
        row.classList.add("unavailable");
    } else {
      row.setAttribute("hidden", true);
    }
    if (row.cells[2].textContent === "m") row.classList.add("male");
    if (row.cells[2].textContent === "f") row.classList.add("female");
    if (row.cells[1].textContent < 18)
      row.style = "text-decoration: line-through";
  });
}
