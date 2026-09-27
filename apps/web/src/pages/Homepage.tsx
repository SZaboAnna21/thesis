import {topics} from "@fotoc/content"

export function Homepage(){
    return(
        <div>
            {topics.map((topic) =>(
                <div key = {topic.meta.id}>{topic.meta.title.hu}</div>
            ))}
            </div>
    );
}