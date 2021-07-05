//Default properties that each cell has

let defaultProperties = {
  text: "",
  "font-family": "Noto Sans",
  "font-weight": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "#ffffff",
  color: "#000000",
  "font-size": "14px",
  "font-style": "",
};
//Global Object for storing cell of each sheet

/*  Object is defined as 

   cellData={
     Sheet1:{
          1:{
            1:{
               properties of cell 
            },
            2:{

            }
          },
          2:{

          }
     },
     Sheet2:{

     }
   }

*/
let cellData = {
  Sheet1: {},
};
let selectedSheet = "Sheet1";
let totalSheets = 1;
lastaddedSheetNo = 1;

//Using Jquery for Dealing with DOM
$(document).bind("keydown", function (e) {
  if (e.ctrlKey && e.which == 83) {
    e.preventDefault();
    console.log("Save Button Disabled");
    return false;
  }
});

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
        `<div class="input_cell" id="row-${i}-col-${j}" contenteditable="false" data="rowCode-${i}-colCod-${colCod}"></div>`
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
    //Logic for Multiple Select
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
      //checking bottom cell
      if (rowID < 100) {
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
      //When Only single cell is selected

      $(".input_cell.selected").removeClass("top_cell_selected");
      $(".input_cell.selected").removeClass("bottom_cell_selected");
      $(".input_cell.selected").removeClass("right_cell_selected");
      $(".input_cell.selected").removeClass("left_cell_selected");
      $(".input_cell.selected").removeClass("selected");
    }
    $(this).addClass("selected");
    //Appyling cell prorperties in menu icons
    applySelectedClass(this);
    let [rowCod, cellCod] = getcellCode(this);
    //Set content to Formula Input
    $(".formula_editor.formula_input").text($(this).text());
    $(".formula_editor.selected_cell").text(cellCod + rowCod);
  });

  //Making cell editable on DOUBLE click
  $(".input_cell").dblclick(function () {
    console.log("Double clicked");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  //Adding text to formula bar input and changing content on chnage
  $(".input_cell").keyup(function (event) {
    console.log(event);
    if (event.keyCode == 46) {
      update_cell("text", "", true);
      $(".input_cell.selected").text("");
    }
    $(".formula_editor.formula_input").text($(this).text());
  });

  //2 way change in formula Input bar on selected Cell
  $(".formula_editor.formula_input").keyup(function () {
    $(".input_cell.selected").text($(this).text());
  });

  //Making cell unselectable when focus gone
  $(".input_cell").blur(function () {
    $(".input_cell.selected").attr("contenteditable", "false");
    update_cell("text", $(this).text(), true);
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

  //Clicking color picker on icon click

  $(".color-fill-icon").click(function () {
    $(".background-color-picker").click();
  });

  $(".color-text-icon").click(function () {
    $(".text-color-picker").click();
  });

  //Background Color & Text color Change
  $(".background-color-picker").change(function () {
    update_cell("background-color", $(this).val(), true);
  });
  $(".text-color-picker").change(function () {
    update_cell("color", $(this).val(), true);
  });

  $(".font_size_selector").change(function () {
    update_cell("font-size", $(this).val(), true);
  });
  $(".font_family_selector").change(function () {
    $(".font_family_selector").css("font-family", $(this).val());
    update_cell("font-family", $(this).val(), true);
  });

  //Adding new Sheet by
  $(".icon-add").click(function () {
    $(".sheet_tab.selected").removeClass("selected");
    emptySheet();
    let sheetName = "Sheet" + (totalSheets + 1);
    cellData[sheetName] = {};
    totalSheets += 1;
    selectedSheet = sheetName;
    $(".sheet_tab_container").append(
      `<div class="sheet_tab selected">${sheetName}</div>`
    );
    //Adding Event Listener to new sheet_tab
    $(".sheet_tab").click(function () {
      selectSheet(this);
    });
    sheetRename_delete_events();
  });

  //Loading Old Sheet in View
  $(".sheet_tab").click(function () {
    console.log("Sheet Clicked");
    selectSheet(this);
  });

  //Showing Rename and delete Modal

  function sheetRename_delete_events() {
    $(".sheet_tab.selected").contextmenu(function (e) {
      e.preventDefault();
      selectSheet(this);
      console.log("Right Click on sheet name");
      if ($(".sheet_option_modal").length === 0) {
        $(".container").append(`<div class="sheet_option_modal">
       <div class="sheet_rename">Rename</div>
       <div class="sheet_delete">Delete</div>
       </div>
      `);
        $(".sheet_rename").click(function () {
          console.log("rename clicked");
          $(".container").append(`<div class="sheet_rename_modal">
            <h4 class="rename_modal_title">Rename Sheet</h4>
            <input type="text" class="new_sheet_name" placeholder="Sheet name" value="${selectedSheet}"/>
            <div class="action_buttons">
              <div class="rename_button">Rename</div>
              <div class="cancel_button">Cancel</div>
            </div>
          </div>`);
          $(".cancel_button").click(function () {
            $(".sheet_rename_modal").remove();
          });
          $(".rename_button").click(function () {
            let newSheetName = $(".new_sheet_name").val();
            console.log(newSheetName);
            $(".sheet_tab.selected").text(newSheetName);
            let newCelldata = {};
            for (let key in cellData) {
              if (key != selectedSheet) {
                newCelldata[key] = cellData[key];
              } else {
                newCelldata[newSheetName] = cellData[key];
              }
            }
            cellData = newCelldata;
            selectedSheet = newSheetName;
            $(".sheet_rename_modal").remove();
            console.log(cellData);
          });
        });
        $(".sheet_delete").click(function () {
          if (Object.keys(cellData).length > 1) {
            let currSheet = $(".sheet_tab.selected");
            let currSheetName = selectedSheet;
            let sheetIndex = Object.keys(cellData).indexOf(selectedSheet);
            if (sheetIndex == 0) {
              $(".sheet_tab.selected").next().click();
            } else {
              $(".sheet_tab.selected").prev().click();
            }
            $(currSheet).remove();
            delete cellData[currSheetName];
            totalSheets -= 1;
          } else {
            $(".container").append(`<div class="alert_show_modal">
            <div class="alert_content">${"Sorry, Not Possible"}</div>
            <div class="alert_submit_button">Ok</div>
          </div>`);
            $(".alert_submit_button").click(function () {
              $(".alert_show_modal").remove();
            });
          }
        });
      }
      $(".sheet_option_modal").css("left", e.pageX + "px");
    });
  }

  sheetRename_delete_events(); //To add Sheet rename delete modal and events

  //Hideing modal when click somewhere in container
  $(".container").click(function () {
    $(".sheet_option_modal").remove();
  });

  //Scroller Left and Right

  $(".icon-left-scroll").click(function () {
    let sheetIndex = Object.keys(cellData).indexOf(selectedSheet);
    if (sheetIndex != 0) {
      $(".sheet_tab.selected").prev().click();
    }
  });
  $(".icon-right-scroll").click(function () {
    let sheetIndex = Object.keys(cellData).indexOf(selectedSheet);
    if (sheetIndex != totalSheets - 1) {
      $(".sheet_tab.selected").next().click();
    }
  });

  //Speech To Text API configration

  $(".icon-voice-input").click(function () {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.onstart = function () {
      console.log("We are listening. Try speaking into the microphone.");
    };
    recognition.onspeechend = function () {
      $(".icon-voice-input.selected").removeClass("selected");
      recognition.stop();
    };
    recognition.onresult = function (event) {
      var transcript = event.results[0][0].transcript;
      update_cell("text", transcript, true);
      $(".input_cell.selected").each(function () {
        $(this).text(transcript);
      });
    };
    if (!$(this).hasClass("selected")) {
      $(this).addClass("selected");
      recognition.start();
    }
  });

  //Text To speech API added

  $(".icon-speaker-output").click(function () {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en";

    $(this).addClass("selected");
    let text_to_speech = [];
    $(".input_cell.selected").each(function () {
      text_to_speech.push($(this).text());
    });
    console.log("data to speak ", text_to_speech);
    for (var i = 0; i < text_to_speech.length; i++) {
      speech.text = text_to_speech[i];
      console.log("i", i);
      window.speechSynthesis.speak(speech);
    }

    $(this).removeClass("selected");
  });
});

//Utility Functions

function clicked_row_col(cell) {
  let cellInfo = $(cell).attr("id").split("-");
  let rowID = parseInt(cellInfo[1]);
  let colID = parseInt(cellInfo[3]);
  return [rowID, colID];
}

function getcellCode(cell) {
  let cellInfo = $(cell).attr("data").split("-");
  return [cellInfo[1], cellInfo[3]];
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
  console.log(cellData);
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

  $(".background-color-picker").val(cellInfo["background-color"]);
  $(".text-color-picker").val(cellInfo["color"]);

  $(".font_size_selector").val(cellInfo["font-size"]);

  $(".font_family_selector").val(cellInfo["font-family"]);
  $(".font_family_selector").css("font-family", cellInfo["font-family"]);
}

function emptySheet() {
  console.log("Empty Sheet Called");
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      let cell = $(`#row-${i}-col-${j}`);
      cell.text("");
      for (let k of Object.keys(defaultProperties)) {
        cell.css(k, defaultProperties[k]);
      }
    }
  }
}
function loadSheet() {
  console.log("Load Sheet Called");
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      let cell = $(`#row-${i}-col-${j}`);
      let cellInfo = sheetInfo[i][j];
      cell.text(cellInfo["text"]);
      for (let k of Object.keys(defaultProperties)) {
        cell.css(k, cellInfo[k]);
      }
    }
  }
}

function selectSheet(ele) {
  console.log("Select Sheet clciked");
  if (!$(ele).hasClass("selected")) {
    $(".sheet_tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    loadSheet();
  } else {
    return;
  }
}
