"use client";
import Logo from "./Logo";
import UserControl from "./UserControl";
import Categories from "./Categories";



export default function Navbar() {

 
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white ">
       <div className="flex items-center justify-start">
         <Logo/>
        <Categories/>
       </div>
        <UserControl/>
    </nav>
        

  );
}
