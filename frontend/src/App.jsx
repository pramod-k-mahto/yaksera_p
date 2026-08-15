import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./components/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import RouteTransition from "./components/RouteTransition";
function App() {
  return (
    <div className="bg-white w-full max-w-full overflow-x-hidden">
      <>
        <ScrollToTop />
        <RouteTransition />
        <Header />
        <AppRoutes />
        <Footer />
      </>
    </div>
  );
}

export default App;
