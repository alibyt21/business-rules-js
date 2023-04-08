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
console.log(latestId);
/* END helper functions */

// for opening upper modal just add class open-upper to element and so on...

let lowerModal = document.querySelector("#lower-modal");
let upperModal = document.querySelector("#upper-modal");

let upperModalClosers = document.querySelectorAll(".close-upper");
let upperModalOpeners = document.querySelectorAll(".open-upper");

let lowerModalClosers = document.querySelectorAll(".close-lower");
let lowerModalOpeners = document.querySelectorAll(".open-lower");

let saveUpper = document.getElementById("save-upper");

let ifSentences = document.getElementById("if-sentences");

let sendNotification = document.getElementById("send-notification");

close_modal(upperModal);
close_modal(lowerModal);

upperModalOpeners.forEach(function (single) {
  single.addEventListener("click", function () {
    open_modal(upperModal);
  });
});

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
  save_upper_modal();
  persist_if_condition_state();
  close_modal(upperModal);
});

function close_modal(node) {
  node.style.opacity = 0;
  node.style.visibility = "hidden";
  //first child of modal (should be modal body)
  node.children[0].style.transform = "translate(0,-100px)";
}

function open_modal(node) {
  node.style.opacity = 100;
  node.style.visibility = "visible";
  //first child of modal (should be modal body)
  node.children[0].style.transform = "translate(0,0)";
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
  }
});
// END change second attribute when operator value change

/* END operator change events */
function save_upper_modal() {
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
      // nothing!
      break;
    default:
      conditionSentence = conditionSentence + " " + selects[3].value;
  }
  let conditionState = {
    id: unique_id_generator(),
    sentence: conditionSentence,
  };
  localStorage.setItem(latestId, JSON.stringify(conditionState));
}

function persist_if_condition_state() {
  let ifMainSentence = "";
  let test = document.querySelector(".sentences");
  for (let index = 0; index <= latestId; index++) {
    if (
      localStorage.getItem(index) &&
      !document.getElementById(JSON.parse(localStorage.getItem(index)).id)
    ) {
      let newElem = document.createElement("div");
      newElem.classList.add("sentence");
      newElem.innerHTML = JSON.parse(localStorage.getItem(index)).sentence;
      newElem.id = JSON.parse(localStorage.getItem(index)).id;
      test.appendChild(newElem);
      ifMainSentence = ifMainSentence + newElem.innerHTML;
    }
  }
  ifSentences.innerHTML += ifMainSentence + " AND ";
}


let ifContextMenu = document.getElementById("if-context-menu");
let ifContainer = document.getElementById("ifContainer");
ifContainer.addEventListener("contextmenu", show_if_context_menu);
document.body.addEventListener("click",hide_if_context_menu);

function show_if_context_menu(e){
    e.preventDefault();
    e.stopPropagation();
    if(ifContextMenu.style.display === "none"){
        ifContextMenu.style.display = "block"
    }
    ifContextMenu.style.top = e.clientY + "px";
    ifContextMenu.style.left = e.clientX + "px";
}

function hide_if_context_menu(e){
    e.stopPropagation();
    ifContextMenu.style.display = "none"
}

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
