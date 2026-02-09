import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white bg-neutral-950 overflow-x-hidden">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto w-full">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Auction Bay logo"
            className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shadow-lg shadow-rose-900/20"
          />
          <span className="hidden sm:inline font-bold text-xl tracking-tight">
            Auction<span className="text-rose-600">Bay</span>
          </span>
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-3 md:gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="transition text-neutral-400 hover:text-white text-sm md:text-base font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 md:px-6 md:py-2.5 font-bold transition rounded-xl bg-rose-800 hover:bg-rose-700 text-sm md:text-base shadow-lg shadow-rose-900/40 active:scale-95"
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              to="/auctions"
              className="px-6 py-2.5 font-bold transition rounded-xl bg-rose-800 hover:bg-rose-700 shadow-lg shadow-rose-900/40 active:scale-95"
            >
              Browse Auctions
            </Link>
          )}
        </div>
      </header>

      {/* BODY */}
      <main className="flex flex-col items-center gap-12 md:gap-24 px-4 mt-12 md:mt-24 max-w-7xl mx-auto">
        {/* TOP SECTION */}
        <section className="max-w-4xl text-center px-2">
          <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">
              Auction Bay
            </span>
          </h1>

          <p className="mb-8 md:mb-12 text-base md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Buy and sell items through real-time auctions. Discover value, bid
            with confidence, and win.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-8 py-4 text-lg font-bold transition rounded-2xl bg-rose-800 hover:bg-rose-700 shadow-xl shadow-rose-900/30 active:scale-95 transform"
          >
            Start bidding today
          </button>
        </section>

        {/* BOTTOM SECTION */}
        <section className="w-full pb-20">
          <div className="relative w-full max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-linear-to-r from-rose-600 to-amber-500 rounded-4xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative aspect-video w-full rounded-4xl bg-neutral-900 p-2 shadow-2xl border border-white/5 overflow-hidden">
              {/* PLACEHOLDER FOR SCREENSHOT */}
              <div className="flex items-center justify-center w-full h-full rounded-3xl bg-neutral-800/50 backdrop-blur-sm text-neutral-500 border border-white/5">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-neutral-700 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt=""
                      className="w-8 h-8 opacity-50"
                    />
                  </div>
                  <p className="font-medium">App Dashboard Preview</p>
                  <p className="text-sm opacity-50 mt-1">
                    Real-time auction management interface
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
