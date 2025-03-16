import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/BookDetails.css"; 


function BookDetails() {
    const { id } = useParams();  
    const [book, setBook] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/book/${id}`)
            .then(response => {
                setBook(response.data);
            });
    }, [id]);

    if (!book) return <p>Loading...</p>;

    return (
        <div>
            <Navbar />
            <div className="bookDetailContainer">
                <div className="bookCoverImgDetails">
                    <img className="imgDetails" src={book.coverurl} alt={book.title} />
                </div>
                <div className="bookInfoDetails">
                    <div className="bookBasicDetails">
                        <h1>{book.title}</h1>
                        <h3>Author: {book.author}</h3>
                        <h3>Published by: {book.username}, {new Date(book.created_at).toLocaleDateString()}</h3>
                    </div>
                    <div className="bookNotesDetails">
                         {book.note ? (
                            book.note.split("\n").map((paragraph, index) => (
                            <p key={index} className="fullText">{paragraph}</p>))) : (
                            <p className="fullText">No additional details available.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetails;