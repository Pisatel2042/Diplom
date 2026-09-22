import CardNav from "./CardNav";

const navItems = [
  {
    label: "Обо мне",
    bgColor: "#ff6b6b",
    textColor: "#fff",
    links: [
      { label: "Кто я", href: "#about" },
      { label: "Опыт", href: "#about" },
    ],
  },
  {
    label: "Программы",
    bgColor: "#f59e0b",
    textColor: "#fff",
    links: [
      { label: "Общий английский", href: "#programs" },
      { label: "Бизнес‑английский", href: "#programs" },
      { label: "IELTS", href: "#programs" },
    ],
  },
  {
    label: "Контакты",
    bgColor: "#6366f1",
    textColor: "#fff",
    links: [
      { label: "Консультация", href: "#schedule" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export default function Navbar() {
  return (
    <CardNav
      logoAlt="Англиский.Про"
      items={navItems}
      baseColor="#ffffff"
      menuColor="#2d2d3a"
      buttonBgColor="#ff6b6b"
      buttonTextColor="#fff"
    />
  );
}
