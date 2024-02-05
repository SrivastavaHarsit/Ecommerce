import { verifyToken } from "../utils/veriftToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";

export const isLoggedIn = (req, res, next)=>{
    // get token from header
    const token = getTokenFromHeader(req);
    // verify the token
    const decodedUser = verifyToken(token);
    //save the user info req obj
    if(!decodedUser){
        throw new Error('Invalid/Expired token, please login again')
    } else{
        req.userAuthId = decodedUser?.id;
        next();
    }
    
}