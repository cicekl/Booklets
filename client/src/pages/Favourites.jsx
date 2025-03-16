import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import '../styles/BookInfo.css';
import { IoMdHeartDislike } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const userEmail = localStorage.getItem("email");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/favourites", { headers: { email: userEmail } })
            .then(response => {
                setFavourites(response.data);
            });
    }, [userEmail]);

    const removeFromFavourites = (bookId) => {
        axios.post("http://localhost:8080/unfavourite", { email: userEmail, bookId })
        .then(() => {setFavourites(prevFavourites => prevFavourites.filter(book => book.id !== bookId));
        });
    };

    const goToBookDetails = (bookId) => {
        navigate(`/book/${bookId}`);  
    };

    const filteredFavourites = favourites.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div>
            <Navbar onSearch={setSearchQuery}/>
            {filteredFavourites.length === 0 ? (
                <p>No favorite books added yet.</p>
            ) : (
                filteredFavourites.map((book) => (
                    <div className="bookInfoBox" key={book.id}>
                        <div className="bookCoverImg">
                            <img src={book.coverurl} alt={book.title} />
                        </div>

                        <div className="infoText">
                            <div className="basicInfo">
                                <div className="aboutBook">
                                    <h1>{book.title}</h1>
                                    <h3>Author: {book.author}</h3>
                                    <h3>Published by: {book.username}</h3>
                                </div>
                                <div className="actions">
                                    <button className="readBtn" onClick={() => goToBookDetails(book.id)}>Read all</button>
                                    <IoMdHeartDislike className="icon" onClick={() => removeFromFavourites(book.id)}/>
                                </div>
                            </div>
                            <div className="info">
                                <article className="text">{book.note || "No notes available"}</article>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Favourites;