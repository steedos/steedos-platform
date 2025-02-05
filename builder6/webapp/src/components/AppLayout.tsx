import Navbar from "./Navbar"

export const AppLayout = ({ children }) => {

  return (
    <>
      <Navbar />
      <div className="container">
        {children}
      </div>
    </>
  )
}