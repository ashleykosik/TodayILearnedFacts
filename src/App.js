import { useState, useEffect } from "react";
import supabase from "./supabase";
import './style.css';
import {CATEGORIES} from './data.js';

function App() {
  const [showForm, setShowForm] = useState(false)
  const [facts, setFacts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCategory, setCategory] = useState('all')

  //fetches data only once
  useEffect(function() {
    async function getFacts() {
      setIsLoading(true)

      let query = supabase.from('facts').select('*')

      if(currentCategory !== 'all')
      query = query.eq('category', currentCategory)

    const { data: facts, error } = await query
    .order('votesInteresting', {ascending: false})
    .limit(10)

    if(!error) setFacts(facts)
    else alert('There was a problem loading this page')
    setIsLoading(false)
  }
  getFacts()
 }, 
 [currentCategory]
 );

  return (
    <> 
    {/* enabled use state defined above */}
  <Header showForm={showForm} setShowForm={setShowForm}/>

{/* use state variable */}
{showForm ? (
  <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> 
  ) : null}

<main> 
<CategoryFilter setCurrentCategory={setCategory}/>

  {isLoading ? <Loader/> 
    : <FactList facts={facts} setFacts={setFacts}/>}

</main>
</>
  )
}
// data / functions can only be passed down to functions below not up

function Loader() {
  return <p className="message">Loading ...</p>
}



function Header({showForm, setShowForm}) {
  const appTitle = "Today I Learned"
  return (
  <header> 
  <div className="logo"> 
      <img src="logo.png" alt="Today I Learned logo"/>
      <h1>{appTitle}</h1>
  </div>
  <button className="btn btn-large btn-open" onClick={() => setShowForm(show => !show)}>{showForm ? 'Close' : 'Share A Fact'}</button>
</header>
)}


// function isValidHttpUrl(string) {
//   let url;
//   try {
//     url = new URL(string);
//   } catch (_) {
//     return false;
//   }
//   return url.protocol === "http:" || url.protocol === "https:";
// }

//creates controlled input field
function NewFactForm({setFacts, setShowForm}){
  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [category, setCategory] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const textLength = text.length // this is set & updated from line 35 -> 44

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(text, source, category)

    //check if data is valid
    if(text && source && category && textLength <= 200) {

    //create a new fact object

      //javascript object style
      // const newFact={
      //   id: Math.round(Math.random() * 100),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // }

      setIsUploading(true)
      const {data: newFact, error } = await supabase
      .from('facts')
      .insert([{text, source, category}])
      .select()

      setIsUploading(false)

    //add the new fact to UI / state
    if (!error) setFacts(facts => [newFact[0], ...facts])

    //reset input fields to empty
     setText('')
     setSource('')
     setCategory('')
    //close form
    setShowForm(false)

    }

  }


  return (
  <form className="fact-form" onSubmit={handleSubmit}>
  <input type="text" placeholder="Share a fact with the world..." 
  // reads current value as it is typed
  value={text} onChange={(e) => setText(e.target.value)} disabled={isUploading}/>
  <span>{200 - textLength}</span>
  <input value={source} type="text" placeholder="Trustworthy source" onChange={(e) => setSource(e.target.value)} disabled={isUploading}/>
  <select value={category} onChange={ e => setCategory(e.target.value)} disabled={isUploading}> 
      <option value="">Choose Category:</option>
      {CATEGORIES.map((cat) => (
      <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>))}
      
  </select> 
  <button className="btn btn-large">Post</button>
</form>
)}

function CategoryFilter({setCurrentCategory}) {

  return <aside>
          <ul> 
          <li className="category"><button className="btn btn-all" onClick={()=>setCurrentCategory('all')}>All</button></li>
            {CATEGORIES.map(cat => (
            <li key={cat.name} className="category">
              <button className="btn btn-cat" style={{backgroundColor: cat.color}} onClick={()=>setCurrentCategory(cat.name)}>{cat.name}</button>
            </li>))}
          </ul>
        </aside>
}

function FactList({facts, setFacts}) {

  if(facts.length === 0) {
    return (
      <p className="message">No facts for this category yet! Create the first one now!</p>
  )}
  
  return (
  <section><ul className="facts-list">{
  facts.map(fact => (<Fact key={fact.id} fact={fact} setFacts={setFacts}/>))}
  </ul>
  <p>There are {facts.length} facts in the database</p>
  </section>
)}

function Fact({fact, setFacts}){
const [isUpdating, setIsUpdating] = useState(false);
const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse



  async function handleVote(columnName) {
    setIsUpdating(true);
    const {data: updatedFact, error} = await supabase
    .from('facts')
    .update({[columnName]: fact[columnName] + 1})
    .eq('id', fact.id)
    .select()
  setIsUpdating(false);

    if (!error) setFacts((facts) => facts.map(f => f.id  === fact.id ? updatedFact[0] : f ))
  }

  return (
  <li className="fact">
  <p>
    {isDisputed ? <span className="disputed"> [DISPUTED] </span> : null}
    {fact.text}
      <a className="source" href={fact.source} target="_blank">(Source)</a>
  </p>
      <span className="tag " style={{backgroundColor: CATEGORIES.find(cat => cat.name === fact.category).color,}}>{fact.category}</span>
      <div className="vote-buttons"> 
          <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>👍 {fact.votesInteresting}</button>
          <button onClick={() => handleVote("votesMindblowing")} disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
          <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>⛔️ {fact.votesFalse}</button>
      </div>
</li>
)}
export default App;

// looks for images in public folder, css in src folder
// these functions recieve props EX: Fact(props)=all of the fact objects we sent it in FactList


// sample of state
function Counter() {
  // setCount = setter function & will rerender the component
  // step 1 set state variables
  const [count, setCount] = useState(0);
  return (
    <div> 
      {/* step 2 use state variable */}
      <span style={{ fontSize: "40px" }}>{count}</span>
      {/* step 3 update state variable (onclick) */}
      <button className="btn btn-large" onClick={() => setCount(c => c + 1)}> +1 </button>
    </div>
  )
}