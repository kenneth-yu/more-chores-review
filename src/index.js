document.addEventListener('DOMContentLoaded', () => {
  const newChoreForm = document.querySelector('#new-chore-form')
  // debugger
  const choreList = document.querySelector('#chore-list')

  newChoreForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const chore = {
      title: newChoreForm.title.value,
      priority: newChoreForm.priority.value,
      duration: newChoreForm.duration.value
    }
    postNewChoreFetch(chore)
  })

  const putChoreOnDom = chore => {
    const string = formatChore(chore) //this is a string
    choreList.innerHTML += string
  }

  function postNewChoreFetch(chore){
    fetch("http://localhost:3000/chores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chore)
    }).then(res => res.json())
      .then(chore => putChoreOnDom(chore))
  }

  function updateFetch(event){
    // console.log(event.target.value);
    const text = event.target.value

    console.log(event.target.parentNode.dataset.choreId);
    fetch(`http://localhost:3000/chores/${event.target.parentNode.dataset.choreId}`, {
      method: "PATCH",
      body: JSON.stringify({priority: text}),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }

  function formatChore(chore) {
    // return (`
      const div = document.createElement("div")
      div.className = "chore-card"
      div.dataset.choreId = chore.id
      div.innerHTML =
        `<button class="delete-button">x</button>
        <h3>${chore.title}</h3>
        <p>${chore.duration}</p>
        <input type="text" value= "${chore.priority}" class="priority-input">
        `
      choreList.append(div)

    // let choreCard = document.querySelector(`div[data-chore-id="${chore.id}"]`)
    let inputField = div.querySelector(".priority-input")
    inputField.addEventListener("blur", updateFetch)
    console.log(inputField)


  }

  function showAllChores(){
    return fetch("http://localhost:3000/chores")
    .then(res => res.json())
    .then(chores => {
      chores.forEach(formatChore)
    })
  }

  // function showAllChores(){
  //   return fetch("http://localhost:3000/chores")
  //   .then(res => res.json())
  //   .then(chores => {
  //     choreList.innerHTML = chores.map(formatChore).join("")
  //   })
  // }

  // const deleteFetch = choreId => {
  //   fetch(`http://localhost:3000/chores/${choreId}`, {
  //     method: "DELETE"
  //   }).then(showAllChores)
  // }
  const deleteFetch = choreId => {
    return fetch(`http://localhost:3000/chores/${choreId}`, {
      method: "DELETE"
    })
  }

  const deleteChore = event => {
    if (event.target.className === "delete-button") {
      const choreLocation = event.target.parentNode
      const choreId = choreLocation.dataset.choreId
      deleteFetch(choreId)
      .then(choreLocation.remove())
    }
  }

  const addDelegationToChoreList = () => {
    choreList.addEventListener("click", deleteChore)
  }


showAllChores()
addDelegationToChoreList()






})
