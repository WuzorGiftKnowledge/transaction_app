const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'helpers/api';
import { prisma} from '../../../lib/prisma';

export default apiHandler({
    post: register
});

async function register(req, res) {
try{
    await prisma.$transaction(async (prisma) => {
    // split out password from user details 
   
        
    const { password, ...user } = req.body

    const username=req.body.username
    if(username==null) throw new Error('Email is not defined')

    const users = await prisma.user.findUnique({
        where: {
          username
        }
       
      })


    // validate
    if (users)
        throw `User with the email "${username}" already exists`;

    // hash password
    user.password = bcrypt.hashSync(password, 10);    
      user.usd_balance=1000;

      const newuser = await prisma.user.create({
        data: {
            firstname:user.firstname,
            lastname:user.lastname,
            username:user.username,
            address:user.address,
            usd_balance:user.usd_balance,
            password:user.password,
            
           
        }
      })
 // const result=usersRepo.create(user);

   const receiver=newuser.username;
   const sender = await prisma.transaction.create({
     data: {
       amount: 1000,
       status:true,
       currency:"USD",
       receiver: { connect: { username: receiver } }
     }
   })

    })
    return res.status(200).json({});
} catch (err) {
    // Handle the rollback...
console.log(""+err)
    return res.status(401).json(JSON.parse(JSON.stringify(err)));
  }
  // return res.status(200).json({result});
}
