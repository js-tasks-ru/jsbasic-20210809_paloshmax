function makeDiagonalRed(table) {
  Array.prototype.forEach.call(
    table.rows,
    (line, index) => (line.cells[index].style.backgroundColor = "red")
  );
}
