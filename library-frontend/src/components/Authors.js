import React from "react";
import { Link } from "react-router-dom";

export const Authors = ({ authors }) => {
 


  console.log("from authors page to say authors", authors);

  return (
    <div>
      <div className='grid grid-cols-5 gap-2 list-none'>
      {authors.map((a) => (
            <li key={a.name}>
             <Link to={`/authorDetail/${a.id}`}  >  {a.name} </Link>
          </li>
          ))}
      </div>
      
    </div>
  );
};


