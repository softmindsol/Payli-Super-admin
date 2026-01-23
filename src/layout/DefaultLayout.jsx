import { Outlet } from "react-router-dom";
import { ModalProvider } from "../context/modal";
import ModalRoot from "../components/Modals";

const DefaultLayout = () => {
  return (
    <ModalProvider>
      {/* <Header /> */}
      <main className="">
        <Outlet />
      </main>
      {/* <Footer /> */}
      <ModalRoot />
    </ModalProvider>
  );
};

export default DefaultLayout;
