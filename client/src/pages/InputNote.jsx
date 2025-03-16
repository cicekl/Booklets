import React, {useState} from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/InputNote.css"

function InputNote() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        note: "",
    });

    const [coverUrl, setCoverUrl] = useState("");


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const fetchCover = async () => {
        if (formData.isbn){
            const coverUrl = `https://covers.openlibrary.org/b/isbn/${formData.isbn}-M.jpg`;   
            setCoverUrl(coverUrl);
        }
        else{
            const coverUrl = `https://covers.openlibrary.org/b/isbn/0281023484-M.jpg`;   
            setCoverUrl(coverUrl);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const email = localStorage.getItem("email");

        try {
            const response = await axios.post("http://localhost:8080/add-book", {
                title: formData.title,
                author: formData.author,
                genre: formData.genre,
                isbn: formData.isbn,
                cover_url: coverUrl, 
                note: formData.note,
                email: email,
            });
    
            navigate("/library");

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="bookInput">
                <div className="inputTitle"><h2>Add a New Book</h2></div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input className="inputs" type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                                <input className="inputs" type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
                                <input className="inputs" type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} />
                                <input className="inputs" type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} onBlur={fetchCover} required />
                            </div>
                        
                            {coverUrl && <img src={coverUrl} alt="Book Cover" className="bookCover" style={{ width: "150px", marginTop: "10px" }} />}

                            <div className="notesInput">
                                <textarea name="note" placeholder="Your notes about this book..." value={formData.note} onChange={handleChange}></textarea>
                                <button type="submit" className="addBookBtn">Add Book</button>
                            </div>
                        
                        </form>
                    </div>
            </div>
        </div>
    );
}

export default InputNote;