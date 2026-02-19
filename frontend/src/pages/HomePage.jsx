import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function HomePage (){
 
     return (
        <>
          <Navbar />
          <div className="relative z-10 flex items-start justify-between px-6 pt-5 pb-3">
        {/* Left text */}
        <div>
          <h2 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Prove Your Progress!
          </h2>
          <p className="text-[12.5px] text-gray-500 dark:text-gray-400 mt-0.5 max-w-xs">
            Turn video insights into mastery. Test your skills, and listen to Widitutor.
          </p>
        </div>
        </div>
            

          <Footer />
        
        </> 
     )

}