import { userService } from '../services';
import { Link } from '../components';

export default Home;

function Home() {
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {userService.userValue?.firstname}!</h1>
                <p>You&apos;re Welcome</p>
                </div>
                <div className="container">
                <h6><Link href={`/users/${userService.userValue?.id}`}><a>View Transactions</a></Link></h6>
            </div>
        
        
         <div className="container">
             <h5> Account Balance  </h5>
             <p> USD: <span> {userService.userValue?.usd_balance} </span> </p>
             <p> NGN: <span> {userService.userValue?.ngn_balance}</span> </p>
             <p> EUR: <span> {userService.userValue?.eur_balance}</span> </p>
             </div>
     </div>
    );
}
