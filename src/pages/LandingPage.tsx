import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Auction Bay</h1>
      <p>Buy and sell items in real-time auctions.</p>

      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>

      <br />
      <Link to="/auctions">Browse Auctions</Link>
    </div>
  );
}

export default LandingPage;
