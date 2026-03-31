import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignInPage";
import UploadPage from "@/pages/UploadPage";
import SearchResultsPage from "@/pages/SearchResults";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/samples" element={<SearchResultsPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
