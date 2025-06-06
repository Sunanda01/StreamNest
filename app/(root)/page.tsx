import Header from "@/Components/header"
import VideoCard from "@/Components/VideoCard"
import { dummyCards } from "@/constants"

const HomePage = () => {
  return (
    <main className="wrapper page">
      <Header subHeader="Public Library" title="All videos"/>
      <section className="video-grid">
        {dummyCards.map((card)=>(
        <VideoCard key={card.id} {...card}/>
      ))}
      </section>
    </main>
  )
}

export default HomePage