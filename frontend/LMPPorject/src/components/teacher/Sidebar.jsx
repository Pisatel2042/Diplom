import { navItems } from "../../data/teacherConfig.jsx";

export default function Sidebar({active,setActive}){

    return(

        <aside className="sidebar">

            <div className="sidebar-logo">

                <div className="avatar">
                    T
                </div>

                <div>

                    <h3>Преподаватель</h3>

                    <span>Панель управления</span>

                </div>

            </div>

            <nav>

               {navItems.map((item) => {
    const Icon = item.icon;

    return (
        <button
            key={item.id}
            className={
                active === item.id
                    ? "sidebar-item active"
                    : "sidebar-item"
            }
            onClick={() => setActive(item.id)}
        >
            <span className="sidebar-icon">
                <Icon size={22} />
            </span>

            <span>{item.label}</span>
        </button>
    );
})}

            </nav>

        </aside>

    )

}