import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, onValue, push,ref} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"



const endorsementTextarea = document.getElementById("endorsement-textarea")
const endorsementsEl = document.getElementById("endorsements")
const inputFromEl = document.getElementById("input-from")
const inputToEl = document.getElementById("input-to")
const publishBtn = document.getElementById("publish-btn")

const appSettings = {
    databaseURL:"https://realtime-database-66aa6-default-rtdb.europe-west1.firebasedatabase.app/"
}


const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database,"endorsements") 

publishBtn.addEventListener("click",handlePublishBtnClick)



function handlePublishBtnClick(){

    const textareaValue = endorsementTextarea.value
    const inputFromValue = inputFromEl.value
    const inputToValue = inputToEl.value

    if(textareaValue && inputToValue && inputFromValue){
        const endorsement = {
            text: textareaValue,
            from: inputFromValue,
            to: inputToValue,
        }
        push(endorsementsInDB,endorsement)
        clearInputs()
    }
}



function clearInputs(){
    endorsementTextarea.value = ""
    inputFromEl.value = ""
    inputToEl.value = ""
}


onValue(endorsementsInDB, function(snapshot){
    if(snapshot.exists()){
        clearEndorsements()
        const endorsementsObject = snapshot.val()
        const endorsementArr = Object.values(endorsementsObject)
        endorsementArr.reverse()
        endorsementArr.forEach(function(obj){

            appendObjectToEndorsementsEl(obj)
        })
    }
})

function clearEndorsements(){
    endorsementsEl.innerHTML = ""
}

function appendObjectToEndorsementsEl(obj){

    const endorsementDivEl = createElWithClass("div","endorsement")
    const endorsementTextEl = createElWithClass("p", "endorsement-text")
    const fromPEl = createElWithClass("p", "endorsement-name")
    const toPEl = createElWithClass("p", "endorsement-name")


    
    toPEl.textContent = "To " + obj.to
    endorsementTextEl.textContent = obj.text
    fromPEl.textContent ="From " +  obj.from
    endorsementDivEl.append(toPEl,endorsementTextEl,fromPEl)
    endorsementsEl.appendChild(endorsementDivEl)
}

function createElWithClass(tagName, className){
    const el = document.createElement(tagName)
    el.classList.add(className)
    return el
}