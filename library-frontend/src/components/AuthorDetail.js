import React from "react";
import { useNavigate } from "react-router-dom";
import { EDIT_AUTHOR, ALL_AUTHORS, ONE_AUTHOR } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const AuthorDetail = () => {
  const navigate = useNavigate();
  const id = useParams().id;

  const navigateToHome = () => {
    navigate("/");
  };

  const [born, setBorn] = useState("");
  const [nationality, setNationality] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const { loading, error, data } = useQuery(ONE_AUTHOR, {
    variables: { id },
  });

  console.log("from authorDetail to say data in order to check to get the books", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const author = data.oneAuthor;

  console.log("Author data:", author);


  const submit = (event) => {
    event.preventDefault();

    const bornNumber = parseInt(born, 10);
    

    // console.log("bornNumber", bornNumber);
    // console.log("nationalityIs", nationality);

    editAuthor({
      variables: { name: author.name, born: bornNumber , nationality: nationality},
    });
    setBorn("");
    setNationality("");
  };

  return (
      <div className="flex-cols justify-stretch">
        <div className="flex justify-center">
          <h1>{author.name}</h1>
        </div>
        <div className="flex justify-center  mt-4">
          <h1>Born: {author.born}</h1>
        </div>
        <div className="flex justify-center mt-4">
          <h1>Nationality: {author.nationality}</h1>
        </div>
        <div className="flex justify-center mt-4">
            Authored books:
        </div>
        <div className="flex justify-center mt-4" >
          {author.books.map((book) => (
            <li key={book.title}>{book.title}</li>
          ))}
      </div>
      <form onSubmit={submit}>
        <div className="flex justify-center mt-4" >
         
          <input
            value={born}
            onChange={(event) => setBorn(event.target.value)}
            placeholder="        Do you know when the author was born? --> Enter the year here"
            className="w-1/2 bg-white rounded-tl-lg border border-bg-gray-100 placeholder:italic placeholder:opacity-50 "
          />
        </div>
        <div className="flex justify-center mt-4">
        
          <input
            value={nationality}
            onChange={(event) => setNationality(event.target.value)}
            placeholder="           Do you know the author's nationality? --> Enter it here"
            className="w-1/2 bg-white rounded-tl-lg border border-bg-gray-100 placeholder:italic placeholder:opacity-50 "
          />
        </div>
        <div className="flex justify-center mt-4 " > <button  type="submit"> UPDATE</button></div>
        <div className="flex justify-center mt-4"> <button  onClick={navigateToHome}>BACK</button> </div>

       
      </form>
      
   
    </div>
  );
};


