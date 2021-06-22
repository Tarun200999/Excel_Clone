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
        `<div class="input_cell row-${i}-col-${j}" contenteditable="false" data="colCod-${colCod}"></div>`
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

  //Input cell selected Jquery

  $(".input_cell").click(function () {
    console.log("I am clicked");
    $(".input_cell.selected").removeClass("selected");
    $(this).addClass("selected");
  });

  //Making cell selectable on DOUBLE click
  $(".input_cell").dblclick(function () {
    console.log("Double clicked");

    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  //Making column and row scrabble with input container scroll
  $(".input_container").scroll(function () {
    console.log(this.scrollLeft); //This will give how many px we have scroll in horizontal direction
    //The pixel we are scrolling column name
    $(".column_name_container").scrollLeft(this.scrollLeft);
    console.log(this.scrollTop);
    $(".row_name_container").scrollTop(this.scrollTop);

    //interisting thing i have learnt today
  });
});
