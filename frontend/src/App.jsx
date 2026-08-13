import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./components/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
function App() {
  return (
    <div className="bg-white">
      <>
        <ScrollToTop />
        <Header />
        <AppRoutes />
        <Footer />
      </>
    </div>
  );
}

export default App;
