import { Video } from "lucide-react"
import { EmptyStateProps } from ".."

const EmptyState = ({icon:Icon,title,description}:EmptyStateProps) => {
  return (
    <section className="empty-state">
        <div>
            <Icon className="h-16 w-16 text-red-600 fill-red-600 "/>
        </div>
        <article>
            <h1>{title}</h1>
            <p >{description}</p>
        </article>
    </section>
  )
}

export default EmptyState