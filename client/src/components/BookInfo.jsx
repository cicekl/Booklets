import React, {useEffect, useState} from "react";
import axios from "axios";
import '../styles/BookInfo.css'
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


function BookInfo({searchQuery}) {

    const [books,setBooks] = useState([]);
    const userEmail = localStorage.getItem("email");
    const navigate = useNavigate(); 

    const goToBookDetails = (bookId) => {
        navigate(`/book/${bookId}`);  
    };


    useEffect(() => {
        axios.get("http://localhost:8080/books").then(response => {
            setBooks(response.data);
        });
    },[]);


    const addToFavourites = (bookId) => {
        axios.post("http://localhost:8080/favourite", { email: userEmail, bookId });
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
             {filteredBooks.map((book) => (
            <div className="bookInfoBox" key={book.id}>
                <div className="bookCoverImg">
                    <img src={book.coverurl} alt={book.title}></img>
                </div>

                <div className="infoText">
                    <div className="basicInfo">
                       <div className="aboutBook">
                            <h1>{book.title}</h1>
                            <h3>Author: {book.author}</h3>
                            <h3>Published by: {book.username}, {new Date(book.created_at).toLocaleDateString()}</h3>
                        </div> 
                        <div className="actions">
                            <button className="readBtn" onClick={() => goToBookDetails(book.id)}>Read all</button>
                            <FaHeart className="icon" onClick={() => addToFavourites(book.id)}/>
                        </div>
                    </div>
                    <div className="info">
                        <article className="text">{book.note || "No notes available"}</article>
                    </div>
                </div>
            </div>))}
        </div>
    );
}

export default BookInfo;