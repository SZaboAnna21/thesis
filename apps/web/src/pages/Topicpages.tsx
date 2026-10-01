import { getTopic } from "@fotoc/content"
import { useParams } from "react-router-dom"
import { TheoryRenderer } from "../components/Theoryrenderer";
import { modules } from "../modules";

export function Topicpages() {

    const {topicID} = useParams();
    const topic = getTopic(topicID!);

    if (!topic){
        return(
            <div>No topic found</div>
        )
    }

    const renderModule = topic.meta.module ? modules[topic.meta.module] : undefined;

    return (
        <div>
            <h1>{topic.meta.title.hu}</h1>
            <p>{topic.meta.summary.hu}</p>
            <p>Csoport: {topic.meta.group}</p>
            <p>Előadások: {topic.meta.lectures.join(", ")}</p>
            <TheoryRenderer blocks={topic.content} />
            {renderModule && (
                <section>
                    <h2>Próbáld ki!</h2>
                    {renderModule()}
                </section>
            )}
        </div>
    )
}
