import { navItems } from "../../data/teacherConfig.jsx";

export default function MobileNav({active,setActive}){

    return(

        <nav className="mobile-nav">

            {navItems.map(item=>

                <button

                    key={item.id}

                    onClick={()=>setActive(item.id)}

                >

                    {item.icon}

                </button>

            )}

        </nav>

    )

}