import Navbar from "./Navbar"
import { AppHeader } from "./AppHeader"

export const AppLayout = ({ children }) => {

  return (
    <>
      <AppHeader />
      <div className="container">
        {children}
      </div>
    </>
  )
}