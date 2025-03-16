import React, {useState} from "react";
import Navbar from "../components/Navbar";
import "../styles/MyLibrary.css"
import { useNavigate } from "react-router-dom";
import LibraryInfo from "../components/LibraryInfo";

function MyLibrary() {

const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState("");

const handleInput = () => {
    navigate("/input");
}


return (
    <div>
    <Navbar onSearch={setSearchQuery}/>
    <div className="btn" onClick={handleInput}><button className="addBtn">Add a note</button></div>
    <LibraryInfo searchQuery={searchQuery}/>
    </div>
);
}

export default MyLibrary;