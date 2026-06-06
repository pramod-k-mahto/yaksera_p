import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./components/AppRoutes";
import ComingSoon from "./pages/ComingSoon";
function App() {
  let isComing = false;
  return (
    <div className="bg-white">
      {isComing ? (
        <ComingSoon />
      ) : (
        <>
          <Header />
          <AppRoutes />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
