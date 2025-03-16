import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/InputNote.css";

function EditNote() {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        isbn: "",
        note: "",
    });

    const [coverUrl, setCoverUrl] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/book/${id}`)
            .then(response => {
                setFormData(response.data);
                setCoverUrl(response.data.coverurl);  
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:8080/update-book/${id}`, {
                title: formData.title,
                author: formData.author,
                genre: formData.genre,
                isbn: formData.isbn,
                cover_url: coverUrl,
                note: formData.note,
            });

            navigate("/library");
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="bookInput">
                <h2 className="inputTitle">Edit Book</h2>
                <form onSubmit={handleUpdate}>
                    <div className="inputBox">
                        <input className="inputs" type="text" name="title" value={formData.title} onChange={handleChange} required />
                        <input className="inputs" type="text" name="author" value={formData.author} onChange={handleChange} required />
                        <input className="inputs" type="text" name="genre" value={formData.genre} onChange={handleChange} />
                        <input className="inputs" type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
                    </div>

                    {coverUrl && <img src={coverUrl} alt="Book Cover" className="bookCover" style={{ width: "150px", marginTop: "10px" }} />}

                    <div className="notesInput">
                        <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
                        <button type="submit" className="addBookBtn">Update Book</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditNote;
