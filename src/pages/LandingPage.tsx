import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white bg-neutral-950">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-5">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Auction Bay logo" className="w-auto h-15 rounded-2xl" />
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="transition text-neutral-300 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 font-medium transition rounded-lg bg-rose-800 hover:bg-rose-700"
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              to="/auctions"
              className="px-5 py-2 font-medium transition rounded-lg bg-rose-800 hover:bg-rose-700"
            >
              Browse Auctions
            </Link>
          )}
        </div>
      </header>

      {/* BODY */}
      <main className="flex flex-col items-center gap-20 px-8 mt-20">
        {/* TOP SECTION */}
        <section className="max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold">
            Welcome to <span className="text-rose-700">Auction Bay</span>
          </h1>

          <p className="mb-10 text-lg text-neutral-400">
            Buy and sell items through real-time auctions. Discover value, bid
            with confidence, and win.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 text-lg font-semibold transition rounded-xl bg-rose-800 hover:bg-rose-700"
          >
            Start bidding
          </button>
        </section>

        {/* BOTTOM SECTION */}
        <section className="flex justify-center w-full">
          <div className="w-[70%] rounded-3xl bg-black p-2 shadow-2xl">
            {/* PLACEHOLDER FOR SCREENSHOT */}
            <div className="flex items-center justify-center w-full h-105 rounded-2xl bg-neutral-800 text-neutral-500">
              App screenshot goes here
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
