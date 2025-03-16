import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const saltRounds = 10;
dotenv.config();

const db = new pg.Client(
    {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    }
);

db.connect();

const app = express();
app.use(express.json())

const corsOptions = {
    origin:"http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE"
};
const PORT = 8080;

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/register", async (req,res) => {
    const {username, email, password} = req.body;

    try {
        const checkResult = await db.query("SELECT * FROM userInfo WHERE email = $1", [email]);


        if(checkResult.rows.length>0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const newUser = await db.query("INSERT INTO userInfo (username,email,password) VALUES ($1, $2, $3) RETURNING *", [username,email,hashedPassword]);
        res.status(201).json({email:newUser.rows[0].email}); 
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/login", async (req,res) => {
    const {email,password} = req.body;

    try {
       const userResult = await db.query("SELECT * FROM userInfo WHERE email = $1", [email]);
       
       if(userResult.rows.length===0) {
        return res.status(400).json({message: "User not found."});
       }

       const user = userResult.rows[0];

       const match = await bcrypt.compare(password,user.password);

       if(!match) {
            return res.status(400).json({message: "Invalid password."});
       }

       res.status(200).json({email: user.email});

    } catch(error) {
        res.status(500).json({ error: "Internal server error"});
    }
});

app.get("/books", async (req,res) => {

    try {
        const books = await db.query(`
            SELECT bookInfo.id, bookInfo.title, bookInfo.author, bookInfo.coverurl, 
                   userInfo.username, notes.note, notes.created_at
            FROM bookInfo
            LEFT JOIN notes ON bookInfo.id = notes.book_id
            JOIN userInfo ON bookInfo.user_id = userInfo.id;
        `);

        res.status(200).json(books.rows);
    }catch(error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/my-books", async (req,res) => {

    const userEmail = req.headers.email; 

    try {

        const userResult = await db.query("SELECT id FROM userInfo WHERE email = $1", [userEmail]);
        const userId = userResult.rows[0].id;

        const books = await db.query(`
            SELECT bookInfo.id, bookInfo.title, bookInfo.author, bookInfo.coverurl, notes.note, notes.created_at
            FROM bookInfo
            LEFT JOIN notes ON bookInfo.id = notes.book_id AND notes.user_id = $1
            WHERE bookInfo.user_id = $1;
        `, [userId]);

        res.status(200).json(books.rows);
    }catch(error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/add-book", async (req,res) => {
    const { title, author, genre, isbn, cover_url, note, email } = req.body;

    try {

        const userResult = await db.query("SELECT id FROM userInfo WHERE email = $1", [email]);
        const userId = userResult.rows[0].id;


        const newBook = await db.query(
            "INSERT INTO bookInfo (title, author, genre, isbn, coverurl, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, author, genre, isbn, cover_url, userId]
        );

        const bookId = newBook.rows[0].id;

        if (note) {
            await db.query(
                "INSERT INTO notes (user_id, book_id, note) VALUES ($1, $2, $3)",
                [userId,bookId, note]
            );
        }

        res.status(201);
    }  catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/favourite", async (req,res) => {
    const { email, bookId } = req.body;

    try {
        const userResult = await db.query("SELECT id FROM userInfo WHERE email = $1", [email]);
        const userId = userResult.rows[0].id;

        await db.query(
            "INSERT INTO favourites (user_id, book_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
            [userId, bookId]
        );

        res.status(201);
    }catch(error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/unfavourite", async (req,res) => {
    const { email, bookId } = req.body;

    try {
        const userResult = await db.query("SELECT id FROM userInfo WHERE email = $1", [email]);
        const userId = userResult.rows[0].id;

        await db.query(
            "DELETE FROM favourites WHERE user_id=$1 AND book_id=$2 RETURNING *;",
            [userId, bookId]
        );

        res.status(200);
    }catch(error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/favourites", async (req,res) => {
    const email = req.headers.email;

    try {
        const userResult = await db.query("SELECT id FROM userInfo WHERE email = $1", [email]);
        const userId = userResult.rows[0].id;

        const favorites = await db.query(`
            SELECT bookInfo.id, bookInfo.title, bookInfo.author, bookInfo.coverurl, userInfo.username, notes.note, notes.created_at
             FROM favourites
            JOIN bookInfo ON favourites.book_id = bookInfo.id
            JOIN userInfo ON bookInfo.user_id = userInfo.id
            LEFT JOIN notes ON bookInfo.id = notes.book_id
            WHERE favourites.user_id = $1;
`,[userId]);

        res.status(200).json(favorites.rows);
    }catch(error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/book/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const book = await db.query(`
            SELECT bookInfo.id, bookInfo.title, bookInfo.author, bookInfo.genre, bookInfo.isbn, bookInfo.coverurl, 
                   userInfo.username, notes.note, notes.created_at
            FROM bookInfo
            LEFT JOIN notes ON bookInfo.id = notes.book_id
            JOIN userInfo ON bookInfo.user_id = userInfo.id
            WHERE bookInfo.id = $1;
        `, [id]);

        res.status(200).json(book.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/update-book/:id", async (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre, isbn, cover_url, note } = req.body;

    try {
        await db.query(
            "UPDATE bookInfo SET title=$1, author=$2, genre=$3, isbn=$4, coverurl=$5 WHERE id=$6",
            [title, author, genre, isbn, cover_url, bookId]
        );

        await db.query(
            "UPDATE notes SET note=$1 WHERE book_id=$2",
            [note, bookId]
        );

        res.status(200);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/delete-book", async (req, res) => {
    const { bookId } = req.body;

    try {
        await db.query("DELETE FROM notes WHERE book_id = $1", [bookId]);
        await db.query("DELETE FROM favourites WHERE book_id = $1", [bookId]);
        await db.query("DELETE FROM bookInfo WHERE id = $1", [bookId]);

        res.status(200);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

