const shareBtn = document.querySelector('btn-open');
const form = document.querySelector('.fact-form');
const factsList = document.querySelector('.facts-list')

//clear html temp data
factsList.innerHTML = "";

loadFacts()
async function loadFacts() {
    const res = await fetch("https://.supabase.co/rest/v1/facts", {
    headers: {
        apikey: "",
        authorization: "Bearer "
    },
    })
    const data = await res.json();
    const filteredData = data.filter(fact)
    createFactsList(data)
}

function createFactsList(dataArray) {
    const htmlArr = dataArray.map(fact => `<li class="fact"><p>${fact.text}
    <a class="source" href="${fact.source}" target="_blank">(Source)</a></p>
    <span class="tag" style="background-color: ${CATEGORIES.find(cat => cat.name === fact.category).color}">${fact.category}</span></li>`)
    const html = htmlArr.join('')
} 

//toggle form visibility
shareBtn.addEventListener('click', function() {
    if(form.classList.contains('hidden')) {
        form.classList.remove('hidden')
        shareBtn.textContent = "Close";
    } else {
        (form.classList.add('hidden'))
        shareBtn.textContent = "Share a fact"
    }
})

// ran npx create-react-app today-i-learned



// function calcFactAge(year) {
//     const currentYear = new Date().getFullYear();
//     const age = currentYear - year
//     return age;
// }
// const age1 = calcFactAge(2015)
// console.log(age1)

// const factAges = initialFacts.map(el => calcFactAge(el.createdIn))


// //Ternary Operator
// let text = 'Lisbon is the capital of Portugal'
// let totalUpvotes = 24
// let votesFalse = 77

// const str = `The current fact is "${text}". It is ${calcFactAge(2015)} years old.
//             It is probably ${
//                 totalUpvotes > votesFalse ? "correct" : "not true"
//             }.`;
// console.log(str)

// const calcFactAge2 = (year) =>
// // if statement
// year <= new Date().getFullYear() 
// // if positive value
// ? new Date().getFullYear() - year
// // if 0 or negetive value
// : `Impossible year. Year needs to be less or equal ${new Date().getFullYear()}`;

// // destructuring 

//console.dir(btn) classList is an array of all the classes applied to that btn

//list.insertAdjacentHTML("afterbegin", "<li>text</li>") //adds as first item in list
//list.insertAdjacentHTML("afterend", "<li>text</li>") //there is a way to add at the end
