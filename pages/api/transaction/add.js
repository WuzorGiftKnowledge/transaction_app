import { prisma } from '../../../lib/prisma'
//const prisma = new PrismaClient()
import { apiHandler, usersRepo } from 'helpers/api';


export default apiHandler({
  post: transfer
});

async function transfer(req, res) {


  const trans=req.body;


  console.log(JSON.parse(JSON.stringify(req.body)));


let  amount=trans.amount;




   
   let sender=await prisma.user.findUnique({
    where:{
      id:Number(trans.senderId)
    }
   })
if (!sender)
throw new Error("sender not found");

let receiver=await prisma.user.findUnique({
  where:{
    id:Number(trans.receiverId)
  }
 })

 console.log(JSON.parse(JSON.stringify(receiver))); 

if (!receiver)
throw new Error("receiver not found");




try{


 
if (trans.senderAccountCurrency != trans.receiverAccountCurrency){

// set endpoint and your access key
const endpoint = 'live';
const access_key = 'fe3ac0aece81082cbc663e3245bbb2d8';

// define from currency, to currency, and amount
const from = trans.senderAccountCurrency;
const to = trans.receiverAccountCurrency;


// execute the conversion using the "convert" endpoint:

   const url= 'http://api.currencylayer.com/' + endpoint + '?access_key=' + access_key+'&source='+from+'&currencies='+to;   
    const res= await fetch(url);
   
     const data= await res.json();
     if(!data){
      
      throw new Error("error in currency conversion");
     }
     const aobj=Object.values(data.quotes);
     amount=aobj[0];
     amount=JSON.parse(JSON.stringify(aobj[0]));
     amount=Number(amount)*trans.amount;
     console.log(amount); 
    
       
      // amount=data.result;  
      }
     
   //  console.log(JSON.parse(JSON.stringify(res))); 
   
        // access the conversion result in json.result
      
                




 return await prisma.$transaction(async (prisma) => {
       

if (trans.senderAccountCurrency==="USD"){

  if( sender.usd_balance < trans.amount){
    throw new Error("Your USD account has insufficient balance")
  }
   const sender1 = await prisma.user.update({
      data: {
        usd_balance: {
          decrement: trans.amount,
        },
      },
      where: {
        id: Number(trans.senderId),
      }
    })
    
  
  
}else if (trans.senderAccountCurrency==="NGN"){


  if( sender.ngn_balance < trans.amount){
    throw new Error("Your NGN account has insufficient balance");
  }
  const sender1 = await prisma.user.update({
      data: {
        ngn_balance: {
          decrement: trans.amount,
        },
      },
      where: {
        id: Number(trans.senderId),
      }
    })
  }
  
else if (trans.senderAccountCurrency==="EUR"){
  if( sender.eur_balance < trans.amount)
    throw new Error("Your EUR account has insufficient balance");
    const sender1 = await prisma.user.update({
      data: {
        eur_balance: {
          decrement: trans.amount,
        },
      },
      where: {
        id: Number(trans.senderId),
      }
    })

  }





 
  //update receivers record
  if (trans.receiverAccountCurrency==='NGN'){

    const receiver2 = await prisma.user.update({
     
       data: {
         ngn_balance: {
           increment:amount,
         },
        
       },
       where: {
         id: Number(trans.receiverId),
       },
     })
    }  
 else if (trans.receiverAccountCurrency==="USD"){
  
    const receiver2 = await prisma.user.update({
     
      data: {
        usd_balance: {
          increment:amount,
        }
       
      },
      where: {
        id: Number(trans.receiverId),
      }
    })
    
    
  
  } 
  else if (trans.receiverAccountCurrency==="EUR"){
   
    const receiver2 = await prisma.user.update({
      where: {
        id: Number(trans.receiverId),
      },
      data: {
        eur_balance: {
          increment:amount,
        },
       
      },
    })
       
      }
  
    

    const  tran = await prisma.transaction.create({
     data:{
        amount:amount,
        status:true,
        currency:trans.receiverAccountCurrency,
        receiver: { connect: { username: receiver.username } },
        sender: { connect: { username: sender.username } }
       
        
    }});
   
   
   //await prisma.$transaction([sender, receiver]);
  
 return res.status(200).json({});
  })


  
  
} catch (err) {
  // Handle the rollback...


console.log(""+err)
  return res.status(401).json(JSON.parse(JSON.stringify(err)));

}

}

  
  