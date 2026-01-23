import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Routes from "./routes"; // Import Routes for routing
import { Toaster } from "sonner"; // Toaster component for toast notifications
import { ModalProvider } from "./context/modal/index"; // Import ModalProvider
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { Provider } from "react-redux";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            {/* Wrap Routes with BrowserRouter for routing */}
            <Routes />
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
