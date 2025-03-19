require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.headers('Authorization');

    if(!token){
        return res.status(401).json({message: 'Acceso denegado, no hay token.'});
    }

    token = token.split(" ")[1];

    try{
        const decode = jwt.verify(token, process_params.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        console.error("Error al verificar el token: ", error.message);
        res.status(401),json({message: 'Token inválido'});

    }
};

module.exports = authMiddleware;