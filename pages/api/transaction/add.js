import { prisma } from '../../../lib/prisma'
//const prisma = new PrismaClient()

export default apiHandler({
    get: transfer
});


async function transfer(req, res) {





try{


  return await prisma.$transaction(async (prisma) => {


    const {trans}=req.body;
let amount=trans.amount;
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
if (!sender)
throw new Error("sender not found");


if (trans.senderAccountCurrency != trans.receiverAccountCurrency){



}


if (trans.senderAccountCurrency=="USD"){
  if( sender.usd_balance <trans.amount)
    throw new Error("Your USD account has insufficient balance")

    sender = await prisma.user.update({
      data: {
        usd_balance: {
          decrement: trans.amount,
        },
      },
      where: {
        id: Number(trans.senderId),
      }
    })
    
  
  
}else if (trans.senderAccountCurrency=="NGN"){
  if( sender.ngn_balance <trans.amount)
    throw new Error("Your NGN account has insufficient balance");
    sender = await prisma.user.update({
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
  
else if (trans.senderAccountCurrency=="EUR"){
  if( sender.eur_balance <trans.amount)
    throw new Error("Your EUR account has insufficient balance");
    sender = await prisma.user.update({
      data: {
        eur_balance: {
          decrement: trans.amount,
        },
      },
      where: {
        id: Number(trans.senderId),
      }
    })

  }else{

    throw new Error("invalid account type ( Currency)");
  }




  //update receivers record

  if (trans.receiverAccountCurrency=="USD"){
  
     receiver = await prisma.user.update({
        data: {
          usd_balance: {
            inccrement: amount,
          },
        },
        where: {
          id: Number(trans.receiverId),
        }
      })
      
    
    
  }else if (trans.senderAccountCurrency=="NGN"){
   
     receiver = await prisma.user.update({
        data: {
          ngn_balance: {
            decrement: amount,
          },
        },
        where: {
          id: Number(trans.receiverId),
        }
      })
    }
    
  else if (trans.receiverAccountCurrency=="EUR"){
   
      receiver = await prisma.user.update({
        data: {
          eur_balance: {
            decrement: amount,
          },
        },
        where: {
          id: Number(trans.receiverId),
        }
      })
  
    }else{
  
      throw new Error("invalid account type ( Currency)");
    }


// create transaction

    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        status:true,
        currency:trans.receiverAccountCurrency,
        receiver: { connect: { username: receiver.username } }
      }
    })
 
return res.status(200).json({});
  })
  
} catch (err) {
  // Handle the rollback...
  const failedtransaction = await prisma.transaction.create({
    data: {
      amount: amount,
      status:false,
      currency:trans.receiverAccountCurrency,
      receiver: { connect: { username: receiver.username } }
    }
  })

console.log(""+err)
  return res.status(401).json(JSON.parse(JSON.stringify(err)));
}

}

  
  