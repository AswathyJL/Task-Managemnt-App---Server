const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.registerController = async (req,res)=>{
    console.log("Inside Register Controller");
    console.log(req.body);
    const {firstName, lastName, email, password, phone} = req.body
    try {
        const existingUser = await users.findOne({email})
        if(existingUser)
        {
            res.status(406).json('Already existing user... Please Login!!!') 
        }
        else
        {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create and save the new user
            const newUser = new users({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            });

            await newUser.save();

            // Send response back to client
            res.status(200).json(newUser);
        }
    } catch (err) {
        res.status(401).json(err)
    }   
}

exports.loginController = async (req,res)=>{
    console.log(`Inside loginController`);
    console.log(req.body);
    const {email, password} = req.body
    try{
        const existingUser = await users.findOne({email})
        if(!existingUser)
        {
            res.status(404).json("Incorrect Email / password!!!")
        }

         // Compare the provided password with the hashed password
         const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
         
         if(!isPasswordCorrect)
        {
            res.status(404).json("Incorrect Email / password!!!")
        }

        // token generation
        const token = jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)

        res.status(200).json({
            user:existingUser,token
        })
        
    }
    catch(err)
    {
        res.status(401).json(err)
    }
}