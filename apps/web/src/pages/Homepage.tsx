import {topics} from "@fotoc/content"
import { Link } from "react-router-dom";

export function Homepage(){
    return(
        <div>
            {topics.map((topic) =>(
               <Link key={topic.meta.id} to={`/topics/${topic.meta.id}`}>
                    {topic.meta.title.hu}
                    </Link>
                 ))}
            </div>
    );
}