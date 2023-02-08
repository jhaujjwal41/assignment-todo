import React, {useEffect, useState, useRef} from "react";
// import {useEffect} from "react";
import ReactDOM from "react-dom";
import { v4 as uuid} from 'uuid';
import './index.css'
import { FcTodoList } from 'react-icons/fc';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';




const App= ()=>{
    const [startDate, setStartDate] = useState(new Date());
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [mode, setMode]= useState("normal");
    const [category, setCategory] = useState([{id:uuid(), name: "default"}, {id:uuid(), name: "default2"}, {id:uuid(), name: "default3"}]);
    const [showModal, setShowModal]= useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategory, setShowCategory] = useState(false);
    const [state, setState] = useState({
        selection: {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        },
        compare: {
          startDate: new Date(),
          endDate: addDays(new Date(), 3),
          key: 'compare'
        }
      });
      

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('todos'));
        if (items) {
         setTodos(items);
        }
      }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]); 


    const addTodo = ()=>{
        if(todo.trim().length>0 && selectedCategory!==null){
        const id = uuid();
        setTodos([...todos, {id:id, text: todo, status:false, category: selectedCategory,
         date: startDate.toDateString()}]);
        setSelectedCategory(null);
        setMode("normal");
       }
        else alert("Type something or select a categgory");
    };
    
    const deleteTodo = (id) => {
        setTodos(todos.filter((t) => t.id!==id));
    };
    
    const markDown = (id) => {
           setTodos(todos.map(item =>{
            if(item.id===id){
                item.status= !item.status;
            }
            return item;
           }))
    };
   
    const search = (tsk)=>{
        console.log(tsk);
        if(tsk.trim().length>0){
         setSearchResult(todos.filter (t => t.text.includes(tsk)));
         setMode('search');
         
         }
         else setMode('normal');

    };

    const searchByCat = (tsk)=>{
        setShowCategory(prev => !prev);
        console.log(tsk);
        if(tsk.trim().length>0){
         setSearchResult(todos.filter (t => (t.category.name===tsk)));
         setMode('search');
         
         }
         else setMode('normal');

    };
    
    const searchByDate = (tsk1, tsk2)=>{
         console.log(tsk1.getTime(), tsk2);
         setSearchResult(todos.filter ( t => (new Date(t.date).getTime()>=tsk1.getTime() && new Date(t.date).getTime()<=tsk2.getTime())));
         console.log(searchResult);
         setMode('search');

         
         
        //  else setMode('normal');

    };
    const setCat = (cat) => {
       setSelectedCategory(cat) ;
       setShowModal(false);
    };

    return (
       <>
       
       <div className="container  mt-20 p-2 w-[65%]  h-235 over rounded-xl mx-auto bg-stone-300 shadow">
       
            <div className="row m-1 p-4">
                <div className="col">
                    <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
                        <h1 className="flex gap-4 items-center justify-center">
                        <FcTodoList />
                        <span>My Todo-s</span>
                      </h1>
                    </div>
                </div>
            </div>
            <div className="flex justify-center h-8">
            <input 
             onChange ={ (e) => search(e.target.value)}  class="rounded-xl md-4 bg-white px-4 text-center " type="text" name="" id="search-task" placeholder="search here" />
           </div>

        <div class="mt-6 w-full todo-form flex justify-center h-10">
         <input 
          value={todo}
          onChange ={ (e) => setTodo(e.target.value) }
          type="text" className="rounded-l-xl md-4 bg-white px-4 w-[30%]" />
          <div className="md-4 bg-white  w-[20%]">
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          </div>

          {/* adding ctaeggories  */}
          <div className="relative h-full">
        
            <button onClick={()=> setShowModal(prev=> !prev)}> Categories
            </button> 
            { showModal ?
            <div className="absolute top-10 w-36 h-36 bg-red-300">
                {
                    category.map( (cat) =>{
                        return (
                        <div onClick={()=>setCat(cat)} key={cat.id}>
                            <h3 >{cat.name}</h3>
                        </div>
                        )
                    })
                }
            </div> : null
            }
          </div>
          <button onClick={addTodo} className="rounded-r-xl bg-white px-4">Add</button>
          </div>
          
          <div>
          <div className="relative h-full">
        
           <button onClick={()=> setShowCategory(prev=> !prev)}> Categories
          </button> 
          { showCategory ?
          <div className="absolute top-10 w-36 h-36 bg-red-300">
            {
                category.map( (cat) =>{
                    return (
                    <div onClick={()=>searchByCat(cat.name)} key={cat.id}>
                        <h3 >{cat.name}</h3>
                    </div>
                    )
                })
            }
           </div> : null
           }
          </div>
          </div>

          {/* search within date range  */}


        <div className="w-full justify-center">
        <label htmlFor="my-modal" className="btn justify-center ">Select Date</label>

{/* Put this part before </body> tag */}
<input type="checkbox" id="my-modal" className="modal-toggle" />
  <div className="modal w-full">
  <div className="modal-box">
    
    <DateRangePicker
             onChange={item => setState({ ...state, ...item })}
            months={1}
            minDate={addDays(new Date(), -300)}
            maxDate={addDays(new Date(), 900)}
            direction="vertical"
            scroll={{ enabled: true }}
            ranges={[state.selection, state.compare]}
        />
    <div className="modal-action">
      <label htmlFor="my-modal" onClick={()=> searchByDate(state.selection.startDate, state.selection.endDate)} className="btn">Yay!</label>
    </div>
  </div>
</div>
        </div>


          <div >
            {mode==="normal"?
            <ol className="list-none py-8 todos mt-4 flex flex-col justify-center px-6 w-[100%] gap-3">
                { todos.map(
                    (todo)=>{
                        return (
                            
                            <li key={todo.id} className="flex gap-3 items-center rounded-xl h-10 bg-white px-4" >
                                <div className="flex flex-1 gap-6">
                                <input type="checkbox" onClick = {()=> {markDown(todo.id)}} />
                                {todo.status===true ? <s>{todo.text}</s> :todo.text}
                                </div>
                                <div>
                                    {todo.category.name}
                                </div>
                                <div>
                                    {todo.date}
                                </div>
                                <div>
                                <button className="ml-4 text-red-400" onClick={()=> deleteTodo(todo.id)}>Delete</button>
                                </div>
                            </li>
                    
                        )
                    }
                )
                }
            </ol>
             : null}

           {mode==="search" ?
            <ol className="list-none py-8 todos mt-4 flex  flex-col justify-center px-6 w-[100%] gap-3">
                { searchResult.map(
                    (todo)=>{
                        return (
                            
                            <li key={todo.id} className="flex items-center rounded-xl gap-3 h-10 bg-white px-4" >
                                <div className="flex flex-1 gap-6">
                                <input type="checkbox" onClick = {()=> {markDown(todo.id)}} />
                                {todo.status===true ? <s>{todo.text}</s> :todo.text}
                                </div>
                                <div className="mr-3">
                                    {todo.category.name}
                                </div>
                                <div>
                                    {todo.date}
                                </div>
                                <div>
                                <button className="ml-4 text-red-400" onClick={()=> deleteTodo(todo.id)}>Delete</button>
                                </div>
                            </li>
                    
                        )
                    }
                )
                }
            </ol>
             : null}

          </div>
          </div>
       </>
    )
}

ReactDOM.render( <App />, document.getElementById("root"));