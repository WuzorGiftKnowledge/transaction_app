import { userService } from '../services';
import { Link } from '../components';

export default Home;

function Home() {
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {userService.userValue?.firstname}!</h1>
                <p>You&apos;re logged in with Next.js & JWT!!</p>
                <p><Link href={`/users/${userService.userValue?.id}`}>Manage Users</Link></p>
            </div>
        </div>
    );
}
