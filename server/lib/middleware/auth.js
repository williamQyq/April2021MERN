import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#root/config.js';

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

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