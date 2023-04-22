const {verify} = require('jsonwebtoken'); 

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    console.log(accessToken);

    if(!accessToken) return Error({error: "User not logged in!"});

    try {
        const validToken = verify(accessToken, "importantsecret");
        
        req.user = validToken;

        if(validToken){
            return next();
        }
    }catch (err) {
        return res.json({error: err});
    }
};

module.exports = {validateToken};