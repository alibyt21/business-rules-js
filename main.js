/* START helper functions */
let latestId = -1;
let unique_id_generator = function (s) {
    return function () {
        s += 1;
        latestId = s;
        localStorage.setItem("latestId",latestId);
        return s;
    }
}(latestId);
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
close_modal(upperModal);


upperModalOpeners.forEach(function (single) {
    single.addEventListener("click", function () {
        open_modal(upperModal);
    })
})

upperModalClosers.forEach(function (single) {
    single.addEventListener("click", function () {
        close_modal(upperModal);
    })
})

lowerModalOpeners.forEach(function (single) {
    single.addEventListener("click", function () {
        open_modal(lowerModal);
    })
})

lowerModalClosers.forEach(function (single) {
    single.addEventListener("click", function () {
        close_modal(lowerModal);
    })
})

saveUpper.addEventListener("click",function(){
    save_upper_modal();
    persist_if_condition_state();
    close_modal(upperModal); 
})

function close_modal(node) {
    node.style.opacity = 0;
    node.style.visibility = "hidden";
    //first child of modal (should be modal body)
    node.children[0].style.transform = "translate(0,-100px)"
}

function open_modal(node) {
    node.style.opacity = 100;
    node.style.visibility = "visible";
    //first child of modal (should be modal body)
    node.children[0].style.transform = "translate(0,0)"
}

function save_upper_modal() {
    let conditionSentence;
    let selects = upperModal.querySelectorAll("select");
    conditionSentence = selects[0].value + " " + selects[1].value;
    switch (selects[2].value) {
        case "Attribute value":
            // TODO
            break;
        case "Attribute":
            conditionSentence = conditionSentence + " " + selects[3].value
            break;
        case "Blank":
            // nothing!
            break;
        default:
            conditionSentence = conditionSentence + " " + selects[3].value
    }
    let conditionState = {
        id : unique_id_generator(),
        sentence : conditionSentence,
    }
    localStorage.setItem(latestId,JSON.stringify(conditionState))
}

function persist_if_condition_state(){
    let test = document.querySelector(".sentences");
    for (let index = 0; index <= latestId; index++) {
        if(localStorage.getItem(index) && !document.getElementById(JSON.parse(localStorage.getItem(index)).id)){
            console.log("ajab");
            let newElem = document.createElement("div");
            newElem.classList.add("sentence");
            newElem.innerHTML = JSON.parse(localStorage.getItem(index)).sentence;
            newElem.id = JSON.parse(localStorage.getItem(index)).id;
            console.log(JSON.parse(localStorage.getItem(index)).id)
            test.appendChild(newElem)
        }
    }
}

