export default class UserTable {
  constructor(rows) {
    let table = document.createElement("table");
    let tBody = document.createElement("tbody");

    Array.prototype.forEach.call(rows, (row) => {
      let tRow = document.createElement("tr");

      Object.values(row).forEach((value) => {
        let tCell = document.createElement("td");
        tCell.textContent = value;
        tRow.append(tCell);
      });

      let tCell = document.createElement("td");
      let tBtn = document.createElement("button");
      tBtn.textContent = "x";
      tCell.append(tBtn);
      tRow.append(tCell);

      tBody.append(tRow);
    });

    table.append(tBody);

    table.addEventListener("click", (e) => {
      let target = e.target.closest("button");
      if (target) {
        let line = e.target.closest("tr");
        line.remove();
      }
    });

    this._elem = table;
  }
  get elem() {
    return this._elem;
  }
}
