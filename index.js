//Using Jquery for Dealing with DOM

$(document).ready(() => {
  //For column name code and row
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
  //Adding cells

  for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell_row"></div>`);
    for (let j = 1; j <= 100; j++) {
      let colCod = $(`.colID-${j}`).attr("id").split("-")[1];
      row.append(
        `<div class="input-cell row-${i}-col-${j}" contenteditable="true" data="colCod-${colCod}"></div>`
      );
    }
    $(".input_container").append(row);
  }

  //SELECTED in menu bar
  $(".menu-icon.align-icon").click(function () {
    $(".menu-icon.align-icon.selected").removeClass("selected"); //Removing class form the div which already have
    $(this).addClass("selected"); //Adding class of to the clicked align icon
  });

  $(".style-icon").click(function () {
    $(this).toggleClass("selected");
  });

  //Selected Input cell

  $(".input-cell").click(function () {
    console.log("I am clicked");

    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
  });
});
