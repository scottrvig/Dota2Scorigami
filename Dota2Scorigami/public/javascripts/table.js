// Functions for setting grid crosshair highlight on mouse hover

function mouseOverGrid(row, col) {
    for (var k = 0; k <= maxScore; k++) {
        var cell = $("#hover_" + row + "_" + k);

        if (cell && k !== col) {
            // Same row
            cell.addClass("adjhover");
        } else if (k === col) {
            // Hovered cell
            cell.addClass("over");
        }

        cell = $("#hover_" + k + "_" + col);
        if (cell && k !== row) {
            // Same column
            cell.addClass("adjhover");
        }

        // Column header
        cell = $("#colheader_" + col);
        if (cell) {
            cell.addClass("adjhover");
        }

        // Row header
        cell = $("#rowheader_" + row);
        if (cell) {
            cell.addClass("adjhover");
        }
    }
}

function mouseOffGrid(row, col) {
    for (var k = 0; k <= maxScore; k++) {
        var cell = $("#hover_" + row + "_" + k);

        if (cell && k !== col) {
            // Same row
            cell.removeClass("adjhover");
        } else if (k === col) {
            // Hovered cell
            cell.removeClass("over");
        }

        cell = $("#hover_" + k + "_" + col);
        if (cell && k !== row) {
            // Same column
            cell.removeClass("adjhover");
        }

        // Column header
        cell = $("#colheader_" + col);
        if (cell) {
            cell.removeClass("adjhover");
        }

        // Row header
        cell = $("#rowheader_" + row);
        if (cell) {
            cell.removeClass("adjhover");
        }
    }
}

function addGridHoverEvents() {
    for (var i = 0; i <= maxScore; i++) {
        for (var j = 0; j <= maxScore; j++) {
            var cell = document.getElementById("cell_" + i + "_" + j);
            if (cell) {
                cell.addEventListener("mouseover", mouseOverDelegate(i, j));
                cell.addEventListener("mouseout", mouseOffDelegate(i, j));
            }
        }
    }
}

function mouseOverDelegate(i, j) {
    return function () {
        mouseOverGrid(i, j);
    };
}
function mouseOffDelegate(i, j) {
    return function () {
        mouseOffGrid(i, j);
    };
}