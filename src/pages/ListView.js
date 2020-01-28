import React, { useEffect, useState } from "react";
import "../scss/App.scss";


function List({list, index, removeList}){
  return (
    <li>{list.name}<button onClick={() => removeList(index)}>X</button></li>

  )

}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    console.log("+++");
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
        ></input>
        <button></button>
      </form>
    </div>
  );
}

function ListView(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList([
      {
        name: "Jean"
      },
      {
        name: "Marie"
      },
      {
        name: "Léo"
      },
      {
        name: "Adrien"
      },
      {
        name: "Marguerite"
      }
    ]);
  }, []);

  const addTodo = name => {
    const newValue = [...list, { name }];
    setList(newValue);
  };

  const removeList = index => {
    console.log(index);
    const newValue = [...list];
    newValue.splice(index, 1);
    setList(newValue);
  };

  return (
    <div>
      <h1>LIST</h1>
      <TodoForm addTodo={addTodo} />
      <ul>
        {list.map((item, index) => (
          <List 
          key={index}
          index={index}
          list={item}
          removeList={removeList}
          />
        ))}
      </ul>
    </div>
  );
}

export default ListView;

