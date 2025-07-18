// hash.js
import bcrypt from "bcryptjs";

const password = "Yeshua@7"; // 👈 use your desired password

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        console.log("Your hashed password is:\n", hash);
    });
});