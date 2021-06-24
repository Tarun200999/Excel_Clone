//Default properties that each cell has

let defaultProperties = {
  text: "",
  "font-family": "Noto Sans",
  "font-weight": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "white",
  color: "black",
  "font-size": 14,
  "font-style": "",
};
//Global Object for storing cell of each sheet

/*  Object is defined as 

   cellData={
     sheet1:{
          row1:{
            col1:{
               properties of cell 
            },
            col2:{

            }
          },
          row2:{

          }
     },
     sheet2:{

     }
   }

*/
let cellData = {
  Sheet1: {},
};

let selectedSheet = "Sheet1";
let totalSheets = 1;

//Using Jquery for Dealing with DOM

$(document).ready(() => {
  //For column name code and row name
  for (let i = 1; i <= 100; i++) {
    let ans = "";
    let n = i;
    while (n) {
      n -= 1; //0 means A
      let rem = n % 26;
      ans = String.fromCharCode(rem + 65) + ans;
      n = Math.floor(n / 26);
    }
    $(".column_name_container").append(
      `<div class="column_name colID-${i}" id="colCod-${ans}">${ans}</div>`
    );
    $(".row_name_container").append(
      `<div class="row_name rowID-${i}" id="rowCod-${i}">${i}</div>`
    );
  }

  //Adding cells in input container

  for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell_row"></div>`);
    for (let j = 1; j <= 100; j++) {
      let colCod = $(`.colID-${j}`).attr("id").split("-")[1];
      row.append(
        `<div class="input_cell" id="row-${i}-col-${j}" contenteditable="false" data="colCod-${colCod}"></div>`
      );
    }
    $(".input_container").append(row);
  }

  //menu icon selected jquery

  $(".menu-icon.align-icon").click(function () {
    $(".menu-icon.align-icon.selected").removeClass("selected"); //Removing class form the div which already have
    $(this).addClass("selected"); //Adding class of to the clicked align icon
  });

  $(".style-icon").click(function () {
    $(this).toggleClass("selected");
  });

  //Input cell selected and multiple selected  Jquery
  //if ctrl is clicked then multiple select
  // Otherwise normal select

  $(".input_cell").click(function (e) {
    console.log("Cell clicked");
    // console.log(e);
    if (e.ctrlKey) {
      let [rowID, colID] = clicked_row_col(this);

      //checking right cell
      if (colID < 100) {
        let right_cell_selected = $(`#row-${rowID}-col-${colID + 1}`).hasClass(
          "selected"
        );
        if (right_cell_selected) {
          $(this).addClass("right_cell_selected");
          $(`#row-${rowID}-col-${colID + 1}`).addClass("left_cell_selected");
        }
      }
      if (rowID < 100) {
        //checking bottom cell
        let bottom_cell_selected = $(`#row-${rowID + 1}-col-${colID}`).hasClass(
          "selected"
        );
        if (bottom_cell_selected) {
          $(this).addClass("bottom_cell_selected");
          $(`#row-${rowID + 1}-col-${colID}`).addClass("top_cell_selected");
        }
      }

      //Checking Top cell

      if (rowID > 1) {
        let top_cell_selected = $(`#row-${rowID - 1}-col-${colID}`).hasClass(
          "selected"
        );
        if (top_cell_selected) {
          $(this).addClass("top_cell_selected");
          $(`#row-${rowID - 1}-col-${colID}`).addClass("bottom_cell_selected");
        }
      }

      //Checking left cell

      if (colID > 1) {
        let left_cell_selected = $(`#row-${rowID}-col-${colID - 1}`).hasClass(
          "selected"
        );
        if (left_cell_selected) {
          $(this).addClass("left_cell_selected");
          $(`#row-${rowID}-col-${colID - 1}`).addClass("right_cell_selected");
        }
      }
    } else {
      $(".input_cell.selected").removeClass("top_cell_selected");
      $(".input_cell.selected").removeClass("bottom_cell_selected");
      $(".input_cell.selected").removeClass("right_cell_selected");
      $(".input_cell.selected").removeClass("left_cell_selected");
      $(".input_cell.selected").removeClass("selected");
    }
    $(this).addClass("selected");
    applySelectedClass(this); //2 way selected
  });

  //Making cell editable on DOUBLE click
  $(".input_cell").dblclick(function () {
    console.log("Double clicked");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  //Making cell unselectable when focus gone
  $(".input_cell").blur(function () {
    $(".input_cell.selected").attr("contenteditable", "false");
  });

  //Making column and row scrabble with input container scroll
  $(".input_container").scroll(function () {
    //console.log(this.scrollLeft); //This will give how many px we have scroll in horizontal direction
    //The pixel we are scrolling column name
    $(".column_name_container").scrollLeft(this.scrollLeft);
    // console.log(this.scrollTop);
    $(".row_name_container").scrollTop(this.scrollTop);

    //interisting thing i have learnt today
  });

  //Applying Bold Property
  $(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("font-weight", "bold", false);
    } else {
      update_cell("font-weight", "", true);
    }
  });

  //Applying Italic Property
  $(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("font-style", "italic", false);
    } else {
      update_cell("font-style", "", true);
    }
  });
  //Applying Underline Property
  $(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("text-decoration", "underline", false);
    } else {
      update_cell("text-decoration", "", true);
    }
  });
  //Applying left align Property
  $(".icon-align-left").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("text-align", "left", true);
    }
  });
  //Applying Underline Property
  $(".icon-align-center").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("text-align", "center", false);
    }
  });
  //Applying Underline Property
  $(".icon-align-right").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("text-align", "right", false);
    }
  });
});

//Utility Functions

function clicked_row_col(cell) {
  let cellInfo = $(cell).attr("id").split("-");
  let rowID = parseInt(cellInfo[1]);
  let colID = parseInt(cellInfo[3]);
  return [rowID, colID];
}

function update_cell(property, value, canbeDefault) {
  //each
  $(".input_cell.selected").each(function () {
    $(this).css(property, value);

    //Adding only that which are not defaults in Cell Data
    let [rowID, colID] = clicked_row_col(this);
    if (cellData[selectedSheet][rowID]) {
      if (cellData[selectedSheet][rowID][colID]) {
        cellData[selectedSheet][rowID][colID][property] = value;
      } else {
        cellData[selectedSheet][rowID][colID] = {};
        cellData[selectedSheet][rowID][colID] = { ...defaultProperties };
        cellData[selectedSheet][rowID][colID][property] = value;
      }
    } else {
      cellData[selectedSheet][rowID] = {};
      cellData[selectedSheet][rowID][colID] = { ...defaultProperties };
      cellData[selectedSheet][rowID][colID][property] = value;
    }
    if (
      canbeDefault &&
      JSON.stringify(cellData[selectedSheet][rowID][colID]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete cellData[selectedSheet][rowID][colID];
      if (Object.keys(cellData[selectedSheet][rowID]).length == 0) {
        delete cellData[selectedSheet][rowID];
      }
    }
  });
  // console.log(cellData);
}

function applySelectedClass(cell) {
  // Function to appply selected class to icons according to the selected cell properties
  let [rowID, colID] = clicked_row_col(cell);
  let cellInfo = defaultProperties;
  if (cellData[selectedSheet][rowID] && cellData[selectedSheet][rowID][colID]) {
    cellInfo = cellData[selectedSheet][rowID][colID];
  }

  cellInfo["font-weight"]
    ? $(".icon-bold").addClass("selected")
    : $(".icon-bold").removeClass("selected");
  cellInfo["font-style"]
    ? $(".icon-italic").addClass("selected")
    : $(".icon-italic").removeClass("selected");
  cellInfo["text-decoration"]
    ? $(".icon-underline").addClass("selected")
    : $(".icon-underline").removeClass("selected");

  let whichAlign = cellInfo["text-align"];
  $(".align-icon.selected").removeClass("selected");
  if (whichAlign == "right") {
    $(".icon-align-right").addClass("selected");
  } else if (whichAlign == "center") {
    $(".icon-align-center").addClass("selected");
  } else {
    $(".icon-align-left").addClass("selected");
  }
}
