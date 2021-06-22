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
      $(this).addClass("selected");
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
      $(this).addClass("selected");
    }
  });

  //Making cell selectable on DOUBLE click
  $(".input_cell").dblclick(function () {
    console.log("Double clicked");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  //Bluring input cell
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

  //Applying Text property , bold , italic, underline
  $(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
      update_cell("font-weight", "bold");
    } else {
      update_cell("font-weight", "");
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

function update_cell(property, value) {
  //each
  $(".input_cell.selected").each(function () {
    $(this).css(property, value);
  });
}
