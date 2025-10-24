"use client";
import Logo from "./Logo";
import UserControl from "./UserControl";
import Categories from "./Categories";



export default function Navbar() {

 
  return (
    <nav className="flex justify-between  items-center p-4 bg-black text-white relative">
      <div className="lg:flex-row lg:justify-between lg:gap-x-58 lg:items-center flex flex-col items-center justify-center  max-w-[1800px] mx-auto">
         <div className="flex items-center justify-start ">
         <Logo/>
         <Categories/>
        </div>
         <UserControl/>
      </div>
    </nav>
        

  );
}
