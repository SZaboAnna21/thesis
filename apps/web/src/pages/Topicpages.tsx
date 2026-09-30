import { getTopic } from "@fotoc/content"
import { useParams } from "react-router-dom"
import { TheoryRenderer } from "../components/Theoryrenderer";

export function Topicpages() {

    const {topicID} = useParams();
    const topic = getTopic(topicID!);

    if (!topic){
        return(
            <div>No topic found</div>
        )
    }
    return (
        <h1><h1>{topic.meta.title.hu}</h1>
            <p>{topic.meta.summary.hu}</p>
            <p>Csoport: {topic.meta.group}</p>
            <p>Előadások: {topic.meta.lectures.join(", ")}</p>
            <TheoryRenderer blocks={topic.content} />
        </h1>
    )
}