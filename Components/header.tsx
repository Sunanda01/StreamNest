import { Search, UploadIcon, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import DropdownList from "./DropdownList";

const Header = ({subHeader,title,userImg}:SharedHeaderProps) => {
  return (
    <header className="header">
        <section className="header-container">
            <div className="details">
                {userImg && (
                    <Image src={userImg} alt="user" height={66} width={66} className="rounded-full"/>
                )}
                <article>
                    <p className="tracking-normal">{subHeader}</p>
                    <h1 className="tracking-normal">{title}</h1>
                </article>
            </div>
            <aside>
                <Link href="/upload">
                    <UploadIcon className="h-5 w-5"/>
                    <span className="text-lg">Upload a video</span>
                </Link>
                <div className="record">
                    <button className="primary-btn">
                        <Video className="h-5 w-5 "/>
                        <span className="text-lg">Record a video</span>
                    </button>
                </div>
            </aside>
        </section>
        <section className="search-filter">
            <div className="search">
                <input type="text" placeholder="Search for video, tags, folders...."/>
                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <DropdownList/>
        </section>
    </header>
  )
}

export default Header