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

function getParams() {
    var includeInternationals = $("#switch-internationals").prop("checked");
    var includeMajors = $("#switch-majors").prop("checked");
    var includeDpc = $("#switch-dpc").prop("checked");

    return {
        includeInternationals: includeInternationals,
        includeMajors: includeMajors,
        includeDpc: includeDpc
    }
}

function showScoreDetail(row, col) {
    $.ajax({
        url: "/getMatchesWithScore/" + row + "/" + col,
        type: "get",
        data: getParams(),
        contentType: "application/json",
        beforeSend: function () {
            $("#loading-spinner").show();
        },
        success: function (result) {
            if (result.length == 0) {
                return;
            }

            // Remove all rows but not header row
            $("#detail-table").find("tr:not(:first)").remove();

            // Update title for modal
            $("#modal-header-text").text("Radiant: " + row + ", Dire: " + col + " - [" + result.length + "]");

            for (var i = 0; i < result.length; i++) {
                // Match ID: Link to Dotabuff
                var matchIdLink = "<a href='https://www.dotabuff.com/matches/" + result[i].match_id + "' target='_blank'>" + result[i].match_id + "</a>";

                // Date in yyyy-MM-dd format
                var date = new Date(result[i].start_time * 1000);
                var dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

                // Add row for the game
                $("#detail-table > tbody").append(
                    "<tr><td>" + matchIdLink +
                    "</td><td>" + dateString +
                    "</td><td>" + result[i].league_name +
                    "</td><td style='color:green'>" + result[i].radiant_team_name +
                    "</td><td style='color:green'>" + result[i].radiant_score +
                    "</td><td style='color:red'>" + result[i].dire_team_name +
                    "</td><td style='color:red'>" + result[i].dire_score +
                    "</td></tr>");
            }

            $("#detail-modal").modal("show");
            $("#loading-spinner").hide();
        },
        error: function (result) {
            $("#loading-spinner").hide();
            console.log("Error when trying to load Scorigami for cell " + row + ", " + col);
        }
    })
}

function clearGrid() {
    for (var row = 0; row < maxScore; row++) {
        for (var col = 0; col < maxScore; col++) {
            $("#cell_" + row + "_" + col).removeClass("gradient-1");
            $("#cell_" + row + "_" + col).removeClass("gradient-2");
            $("#cell_" + row + "_" + col).removeClass("gradient-3");
            $("#cell_" + row + "_" + col).removeClass("gradient-4");
            $("#cell_" + row + "_" + col).removeClass("gradient-5");
            $("#cell_" + row + "_" + col).removeClass("gradient-6");

            $("#hover_" + row + "_" + col).html("");
        }
    }
}

function refreshGrid() {
    clearGrid();

    $.ajax({
        url: "/getScorigamiMatrix",
        type: "get",
        data: getParams(),
        contentType: "application/json",
        beforeSend: function () {
            $("#loading-spinner").show();
        },
        success: function (result) {
            $("#loading-spinner").hide();
            for (var row = 0; row < maxScore; row++) {
                for (var col = 0; col < maxScore; col++) {
                    var value = result[row][col];
                    if (value <= 0) {
                        // Override onclick event then continue
                        $("#cell_" + row + "_" + col).removeAttr("onclick");
                        continue;
                    }

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
            $("#loading-spinner").hide();
            console.log("Error when trying to load Scorigami matrix.");
        }
    });
}