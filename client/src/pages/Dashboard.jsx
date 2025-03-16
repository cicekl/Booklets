import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import BookInfo from "../components/BookInfo";


function Dashboard() {

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div>
            <Navbar onSearch={setSearchQuery}/>
            <BookInfo searchQuery={searchQuery}/>
        </div>
    );
}

export default Dashboard;