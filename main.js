/* START helper functions */
let latestId = -1;
let unique_id_generator = (function (s) {
  return function () {
    s += 1;
    latestId = s;
    localStorage.setItem("latestId", latestId);
    return s;
  };
})(latestId);
latestId = localStorage.getItem("latestId");
/* END helper functions */

// for opening upper modal just add class open-upper to element and so on...

let lowerModal = document.querySelector("#lower-modal");
let upperModal = document.querySelector("#upper-modal");

let upperModalClosers = document.querySelectorAll(".close-upper");
let ifOpener = document.getElementById("if-opener");
let thenOpener = document.getElementById("then-opener");
let elseOpener = document.getElementById("else-opener");

let lowerModalClosers = document.querySelectorAll(".close-lower");
let lowerModalOpeners = document.querySelectorAll(".open-lower");

let saveUpper = document.getElementById("save-upper");

let ifSummary = document.getElementById("if-summary");

let sendNotification = document.getElementById("send-notification");
let inputName = document.getElementById("input-name");
let nameIsRequired = document.getElementById("name-is-required");

init_lower_modal();
close_modal(upperModal);
// close_modal(lowerModal);

function init_lower_modal() {
  if (!inputName.value) {
    nameIsRequired.classList.remove("invisible");
  }
}

inputName.addEventListener("change", function () {
  check_if_lower_modal_save_button_should_be_actived();
  check_if_name_alert_should_be_shown();
});

function check_if_lower_modal_save_button_should_be_actived() {
  let lowerModalSaveButton = document.getElementById("lower-modal-save-button");
  if (inputName.value) {
    lowerModalSaveButton.removeAttribute("disabled");
  } else {
    lowerModalSaveButton.setAttribute("disabled", "");
  }
}

function check_if_name_alert_should_be_shown() {
  if (!inputName.value) {
    nameIsRequired.classList.remove("invisible");
    inputName.classList.add("alert");
  } else {
    nameIsRequired.classList.add("invisible");
    inputName.classList.remove("alert");
  }
}

ifOpener.addEventListener("click", () => open_modal(upperModal));
thenOpener.addEventListener("click", () => open_modal(upperModal, "then"));
elseOpener.addEventListener("click", () => open_modal(upperModal, "else"));

upperModalClosers.forEach(function (single) {
  single.addEventListener("click", function () {
    close_modal(upperModal);
  });
});

lowerModalOpeners.forEach(function (single) {
  single.addEventListener("click", function () {
    open_modal(lowerModal);
  });
});

lowerModalClosers.forEach(function (single) {
  single.addEventListener("click", function () {
    close_modal(lowerModal);
  });
});

saveUpper.addEventListener("click", function () {
  let mode = saveUpper.dataset.mode;
  save_upper_modal(mode);
  persist_rules_state(mode);
  close_modal(upperModal);
});

function close_modal(node) {
  node.style.opacity = 0;
  node.style.visibility = "hidden";
  //first child of modal (should be modal body)
  node.children[0].style.transform = "translate(0,-100px)";
}

function open_modal(node, mode = "if") {
  let operator = document.getElementById("operator");
  let saveUpper = document.getElementById("save-upper");
  node.style.opacity = 100;
  node.style.visibility = "visible";
  //first child of modal (should be modal body)
  node.children[0].style.transform = "translate(0,0)";
  if (mode == "if") {
    // nothing
    saveUpper.dataset.mode = "if";
  } else if (mode == "then") {
    operator.innerHTML = `<optgroup label="Default value">
    <option>defaults to</option>
    <option>defaults to a generated value</option>
    <option>defaults to a concatenated value</option>
</optgroup>
<optgroup label="Change value">
    <option>equals</option>
    <option>equals a concatenated value</option>
</optgroup>
<optgroup label="Validation">
    <option>is required</option>
    <option>is not valid</option>
    <option>must contain the pattern</option>
    <option>must be unique</option>
    <option>must be greater than</option>
    <option>must be equal to</option>
    <option>must be greater than or equal to</option>
    <option>must be less than</option>
    <option>must be less than or equal to</option>
    <option>must be between</option>
    <option>must have a minimum length of</option>
    <option>must have a maximum length of</option>
</optgroup>
<optgroup label="User defined script"></optgroup>
<optgroup label="External action">
    <option>start workflow</option>
</optgroup>`;
    saveUpper.dataset.mode = "then";
  } else if (mode == "else") {
    operator.innerHTML = `<optgroup label="Default value">
    <option>defaults to</option>
    <option>defaults to a generated value</option>
    <option>defaults to a concatenated value</option>
</optgroup>
<optgroup label="Change value">
    <option>equals</option>
    <option>equals a concatenated value</option>
</optgroup>
<optgroup label="Validation">
    <option>is required</option>
    <option>is not valid</option>
    <option>must contain the pattern</option>
    <option>must be unique</option>
    <option>must be greater than</option>
    <option>must be equal to</option>
    <option>must be greater than or equal to</option>
    <option>must be less than</option>
    <option>must be less than or equal to</option>
    <option>must be between</option>
    <option>must have a minimum length of</option>
    <option>must have a maximum length of</option>
</optgroup>
<optgroup label="User defined script"></optgroup>
<optgroup label="External action">
    <option>start workflow</option>
</optgroup>`;
    saveUpper.dataset.mode = "else";
  }
}

/* START notification toggle */
sendNotification.addEventListener("change", function () {
  let notificationReceiver = document.getElementById("notification-receiver");
  if (!sendNotification.checked) {
    notificationReceiver.setAttribute("disabled", "");
  } else {
    notificationReceiver.removeAttribute("disabled");
  }
});
/* END notification toggle */

/* START operator change events */
let operator = document.getElementById("operator");
let operatorValue = document.getElementById("operator-value");
let operatorValueLabel = document.getElementById("operator-value-label");
operator.addEventListener("change", function () {
  operatorValueLabel.innerHTML = operator.options[operator.selectedIndex].text;
});

// START change second attribute when operator value change
let secondAttribute = document.getElementById("second-attribute");
let secondAttributeOrginalInnerHTML = secondAttribute.innerHTML;
operatorValue.addEventListener("change", function () {
  let secondAttributeDiv = document.getElementById("second-attribute-div");
  if (operatorValue.value == "Blank") {
    secondAttributeDiv.style.display = "none";
  } else if (operatorValue.value == "Attribute") {
    secondAttributeDiv.style.display = "block";

    let newElem = document.createElement("select");
    newElem.setAttribute("id", "second-attribute");
    newElem.setAttribute(
      "class",
      "w-full p-2 bg-white border border-[#cccccc] rounded"
    );
    newElem.innerHTML = secondAttributeOrginalInnerHTML;
    secondAttribute = document.getElementById("second-attribute");
    secondAttribute.parentNode.replaceChild(newElem, secondAttribute);
    check_if_second_attribute_alert_should_be_shown();
  } else if (operatorValue.value == "Attribute value") {
    secondAttributeDiv.style.display = "block";

    let newElem = document.createElement("input");
    newElem.setAttribute("id", "second-attribute");
    newElem.setAttribute(
      "class",
      "w-full p-2 bg-white border border-[#cccccc] rounded"
    );
    secondAttribute = document.getElementById("second-attribute");
    secondAttribute.parentNode.replaceChild(newElem, secondAttribute);
    check_if_second_attribute_alert_should_be_shown();
  }
});

function check_if_second_attribute_alert_should_be_shown() {
  let secondAttribute = document.getElementById("second-attribute");
  let valueIsRequired = document.getElementById("value-is-required");
  secondAttribute.addEventListener("change", function () {
    check_if_second_attribute_alert_should_be_shown();
  });
  if (operatorValue.value == "Attribute value") {
    if (!secondAttribute.value) {
      secondAttribute.classList.add("alert");
      valueIsRequired.classList.remove("invisible");
    } else {
      secondAttribute.classList.remove("alert");
      valueIsRequired.classList.add("invisible");
    }
  } else {
    valueIsRequired.classList.add("invisible");
  }
}

// END change second attribute when operator value change

/* END operator change events */
function save_upper_modal(mode = "if") {
  let conditionSentence;
  let selects = upperModal.querySelectorAll("select");
  let secondAttribute = upperModal.querySelector("#second-attribute");
  conditionSentence = selects[0].value + " " + selects[1].value;
  switch (selects[2].value) {
    case "Attribute value":
      conditionSentence = conditionSentence + " " + secondAttribute.value;
      break;
    case "Attribute":
      conditionSentence = conditionSentence + " " + selects[3].value;
      break;
    case "Blank":
      conditionSentence = conditionSentence + " Blank";
      break;
    default:
      conditionSentence = conditionSentence + " " + selects[3].value;
  }
  let conditionState = {
    id: unique_id_generator(),
    attribute: selects[0].value,
    operator: selects[1].value,
    operatorValue: selects[2].value,
    secondAttribute: secondAttribute.value ,
    sentence: conditionSentence,
    mode: mode,
  };
  localStorage.setItem(latestId, JSON.stringify(conditionState));
}

function persist_rules_state(mode = "if") {
  if (mode == "if") {
    // START if
    let newIfSentence = "";
    let ifSentences = document.getElementById("if-sentences");
    ifSentences.innerHTML = "";
    for (let index = 0; index <= latestId; index++) {
      if (
        localStorage.getItem(index) &&
        !document.getElementById(JSON.parse(localStorage.getItem(index)).id) &&
        JSON.parse(localStorage.getItem(index)).mode == mode
      ) {
        create_new_sentence_and_append(ifSentences, index);
      }
    }

    // ifSummary.innerHTML += newIfSentence + " AND ";
    // END if
  } else if (mode == "then") {
    // START then
    let thenSentences = document.getElementById("then-sentences");
    for (let index = 0; index <= latestId; index++) {
      if (
        localStorage.getItem(index) &&
        !document.getElementById(JSON.parse(localStorage.getItem(index)).id) &&
        JSON.parse(localStorage.getItem(index)).mode == mode
      ) {
        create_new_sentence_and_append(thenSentences, index);
      }
    }
    // END then
  } else if (mode == "else") {
    // START else
    let elseSentences = document.getElementById("else-sentences");
    for (let index = 0; index <= latestId; index++) {
      if (
        localStorage.getItem(index) &&
        !document.getElementById(JSON.parse(localStorage.getItem(index)).id) &&
        JSON.parse(localStorage.getItem(index)).mode == mode
      ) {
        create_new_sentence_and_append(elseSentences, index);
      }
    }
    // END else
  }
}

function create_new_sentence_and_append(parentNode, index) {
  let newElem = document.createElement("div");
  newElem.classList.add("sentence");
  newElem.innerHTML = JSON.parse(localStorage.getItem(index)).sentence;
  newElem.id = JSON.parse(localStorage.getItem(index)).id;
  parentNode.appendChild(newElem);
}


function load_upper_modal(id){
  data = JSON.parse(localStorage.getItem(id));
  let attribute = document.getElementById("attribute");
  let operator = document.getElementById("operator");
  let operatorValue = document.getElementById("operator-value");
  let secondAttribute = document.getElementById("second-attribute");
  attribute.value = data.attribute;
}


/* START Context menu */
let ifContextMenu = document.getElementById("if-context-menu");
let ifSentencesContainer = document.getElementById("if-sentences-container");
ifSentencesContainer.addEventListener("contextmenu", show_if_context_menu);
document.body.addEventListener("click", hide_if_context_menu);

let latestElementRightClick;
function show_if_context_menu(e) {
  latestElementRightClick = e.target.id;
  e.preventDefault();
  e.stopPropagation();
  if (ifContextMenu.style.display === "none") {
    ifContextMenu.style.display = "block";
  }
  ifContextMenu.style.top = e.clientY + "px";
  ifContextMenu.style.left = e.clientX + "px";
}

function hide_if_context_menu(e) {
  e.stopPropagation();
  ifContextMenu.style.display = "none";
}

let addMenu = document.getElementById("add");
let editMenu = document.getElementById("edit");
let deleteMenu = document.getElementById("delete");
let groupMenu = document.getElementById("group");
let ungroupMenu = document.getElementById("ungroup");

deleteMenu.addEventListener("click", function () {
  localStorage.removeItem(latestElementRightClick);
  persist_rules_state("if");
});

addMenu.addEventListener("click", function () {
  open_modal(upperModal);
});

editMenu.addEventListener("click", function () {
  open_modal(upperModal);
  load_upper_modal(latestElementRightClick);
});

/* END Context menu */

/* data structure of if conditions

{
    NOR : false,
    operator : AND,
    nodes : [1,2,3],
    childs : {
        NOR : true
        operator : OR,
        nodes : [5,6],
        childs : {
            NOR : false,
            operator : AND
            nodes : [7,9],
            childs : false,
        }
    }
}

result is 
    (1 AND 2 AND 3 AND !(5 OR 6 OR (7 AND 9)))

*/
