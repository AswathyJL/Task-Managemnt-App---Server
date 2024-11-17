
const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next) =>{
    console.log("Inside jwtMiddleware");
    const token = req.headers["authorization"].split(" ")[1]
    console.log(token);
    if(token)
    {
        try
        {
            const jwtResponse = jwt.verify(token,process.env.JWTPASSWORD)
            console.log(`jwtResponse:`, jwtResponse);
            req.userId = jwtResponse.userId
             // next() - should be called if user is authorised
            next()
        }
        catch(err)
        {
            console.error("JWT Verification Error:", err.message);
            res.status(401).json("Authorization failed... Please login!!")

        }
    }
    else
    {
        res.status(404).json("Authorization failed... Token is missng!!")
    }
}

module.exports = jwtMiddleware