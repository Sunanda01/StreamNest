import Header from "@/Components/header"
import { ParamsWithSearch } from "@/index"

const page = async ({ params }: ParamsWithSearch) => {
    const { id } = await params;
    return (
        <div className="wrapper page">
            <Header subHeader="a@gmail.com" title="Sunanda" userImg="/assets/images/dummy.jpg"/>
            <h1 className="text-2xl font-karla tracking-wide">UserId:{id}</h1>
            
        </div>
    )
}

export default page