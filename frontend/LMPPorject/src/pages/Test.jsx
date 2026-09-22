import { Button } from "@chakra-ui/react"
import CardNav from "../components/CardNav"
import SpotlightCard from '../components/SpotlightCard'

function Test() {
  const items = [
    {
      label: "Products",
      bgColor: "#000",
      textColor: "#fff",
      links: [
        {
          label: "All Products",
          href: "#"
        }
      ]
    },

    {
      label: "Services",
      bgColor: "#1e293b",
      textColor: "#fff",
      links: [
        {
          label: "Our Services",
          href: "#"
        }
      ]
    },

    {
      label: "About",
      bgColor: "#334155",
      textColor: "#fff",
      links: [
        {
          label: "Company",
          href: "#"
        }
      ]
    }
  ]

  return (
    <section className="min-h-screen bg-slate-100 relative">
        <div className="min-h-screen bg-gray-100">
         <header className="bg-white shadow">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
                <CardNav
                    logo="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                    items={items}
                    baseColor="#ffffff"
                    menuColor="#000000"
                    buttonBgColor="#000000"
                    buttonTextColor="#ffffff"
                  />


             </div>
            

         </header>
       <main className="max-w-6xl mx-auto px-4 py-10">
          <section className="grid md:grid-cols-2 gap-10 items-center">

                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)"
>
                            <h1 className="text-3xl font-bold text-white">Как это работает сука</h1>
                </SpotlightCard>

          </section>


       </main>
         

        </div>
    </section>
  )
}

export default Test