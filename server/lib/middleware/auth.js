import jwt from 'jsonwebtoken';
import config from "config";



const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    const JWT_SECRET = config.get("JWT_SECRET");
    if (!token)
        return res.status(401).json({ msg: "authorization denied." })

    try {
        //Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        //Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' })
    }
}

export default auth;