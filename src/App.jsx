import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Routes from "./routes"; // Import Routes for routing
import { Toaster } from "sonner"; // Toaster component for toast notifications
import { ModalProvider } from "./context/modal/index"; // Import ModalProvider


const App = () => {
  return (
    
    <BrowserRouter>
      <ModalProvider>
 {/* Wrap Routes with BrowserRouter for routing */}
      <Routes />
      <Toaster position="top-right" richColors closeButton duration={4000} />
        </ModalProvider>

    </BrowserRouter>
  );
};

export default App;
