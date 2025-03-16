import React, {useEffect, useState} from "react";
import axios from "axios";
import '../styles/BookInfo.css'
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function LibraryInfo({searchQuery}) {

    const navigate = useNavigate();
    const [books,setBooks] = useState([]);
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        axios.get("http://localhost:8080/my-books", { headers: { email: userEmail }}).then(response => {
            setBooks(response.data);
        });
    },[userEmail]);

    const goToBookDetails = (bookId) => {
        navigate(`/book/${bookId}`);  
    };

    const goToEditBook = (bookId) => {
        navigate(`/edit-book/${bookId}`);  
    };

    const deleteBook = async (bookId) => {
        try {
            await axios.delete("http://localhost:8080/delete-book", { data: { bookId } });
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        } catch (error) {
            console.error("Error deleting book:", error.response ? error.response.data : error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div>
            {filteredBooks.length === 0 ? (
                <p>No books found in your library.</p>
            ) : (
                filteredBooks.map((book) => (
                    <div className="bookInfoBox" key={book.id}>
                        <div className="bookCoverImg">
                            <img src={book.coverurl} alt={book.title} />
                        </div>

                        <div className="infoText">
                            <div className="basicInfo">
                                <div className="aboutBook">
                                    <h1>{book.title}</h1>
                                    <h3>Author: {book.author}</h3>
                                    <h3>
                                        Published by: YOU, {book.created_at ? new Date(book.created_at).toLocaleDateString() : "N/A"}
                                    </h3>
                                </div>
                                <div className="actions">
                                    <button className="readBtn" onClick={() => goToBookDetails(book.id)}>
                                        Read all
                                    </button>
                                    <FaEdit className="icon" onClick={() => goToEditBook(book.id)}/>
                                    <MdDelete className="icon" onClick={() => deleteBook(book.id)} />
                                </div>
                            </div>
                            <div className="info">
                                <article className="text">
                                    {book.note || "No notes available."}
                                </article>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}


export default LibraryInfo;