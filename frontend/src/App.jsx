import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./components/AppRoutes";
function App() {
  return (
    <div className="bg-white">
      <>
        <Header />
        <AppRoutes />
        <Footer />
      </>
    </div>
  );
}

export default App;
