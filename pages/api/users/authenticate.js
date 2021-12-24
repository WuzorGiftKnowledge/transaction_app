const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import getConfig from 'next/config';
import { PrismaClient } from '@prisma/client'

import { apiHandler, usersRepo } from 'helpers/api';

const prisma =new PrismaClient();
const { serverRuntimeConfig } = getConfig();

export default apiHandler({
    post: authenticate
});

async function authenticate(req, res) {
    const { username, password } = req.body;
   // const user = usersRepo.find(u => u.username === username);


   // const{username}=req.body;
    if(username==null) throw new Error('Username is not defined');
    
    const user = await prisma.user.findUnique({
        where: {
          username
        }
        
      })

     

      
    // validate
    if (!(user && bcrypt.compareSync(password, user.password))) {
        throw 'Username or password is incorrect';
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic user details and token
    return res.status(200).json({
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastame: user.lastname,
        eur_balance:user.eur_balance,
        ngn_balance:user.ngn_balance,
        usd_balance:user.usd_balance,
        token
    });
}
