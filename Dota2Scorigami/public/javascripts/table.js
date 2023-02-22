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

function refreshGrid() {
    var includeInternationals = $("#switch-internationals").prop("checked");
    var includeMajors = $("#switch-majors").prop("checked");
    var includeDpc1 = $("#switch-dpc1").prop("checked");
    var includeDpc2 = $("#switch-dpc2").prop("checked");

    $.ajax({
        url: "/getScorigamiMatrix",
        type: "get",
        data: {
            includeInternationals: includeInternationals,
            includeMajors: includeMajors,
            includeDpc1: includeDpc1,
            includeDpc2: includeDpc2
        },
        contentType: "application/json",
        success: function (result) {
            for (var row = 0; row < maxScore; row++) {
                for (var col = 0; col < maxScore; col++) {
                    var value = result[row][col];
                    if (value <= 0) continue;

                    // Set color gradient
                    if (value == 1) {
                        $("#cell_" + row + "_" + col).addClass("gradient-1");
                    }

                    if (value > 1 && value <= 4) {
                        $("#cell_" + row + "_" + col).addClass("gradient-2");
                    }

                    if (value > 4 && value <= 8) {
                        $("#cell_" + row + "_" + col).addClass("gradient-3");
                    }

                    if (value > 8 && value <= 13) {
                        $("#cell_" + row + "_" + col).addClass("gradient-4");
                    }

                    if (value > 13 && value <= 20) {
                        $("#cell_" + row + "_" + col).addClass("gradient-5");
                    }

                    if (value > 20) {
                        $("#cell_" + row + "_" + col).addClass("gradient-6");
                    }

                    $("#hover_" + row + "_" + col).html(result[row][col]);
                }
            }
        },
        error: function (result) {
            console.log("Error when trying to load Scorigami matrix.");
        }
    });
}