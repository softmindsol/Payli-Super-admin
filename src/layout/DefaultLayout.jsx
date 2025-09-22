import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <main className=''>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default DefaultLayout;
