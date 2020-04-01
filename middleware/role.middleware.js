const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (req, res, next, roles) => {
    try {
        if (req.method === 'OPTIONS') {
            return next();
        }
    
        const rolesList = [
            {name: 'admin', id: '5e25ff721c9d440000dd41a1'},
            {name: 'specialist', id: '5e25ff7b1c9d440000dd41a2'},
            {name: 'storage', id: '5e78e35b1c9d44000007ece8'}
        ];

        let accessedRoles = [];

        roles.forEach(item => {
            let role = rolesList.find(elem => elem.name === item);
            if (role) {
                accessedRoles.push(role);
            }
        });
 
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' });
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded
        let role = decoded.role

        let access = accessedRoles.some(elem => elem.id === role);
        if (access) {
            next();
        } else throw new Error('Недостаточно прав');
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Недостаточно прав' });
    }
}