import {createPortal} from "react-dom";
export const Home = () => {
    
  return createPortal(
    
    <div className="fixed inset-0 flex items-center justify-center">Home</div>
  ,document.getElementById("portal"))
}
