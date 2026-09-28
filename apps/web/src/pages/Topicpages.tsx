import { getTopic } from "@fotoc/content"

const topic = getTopic("alapfogalmak")
export function Topicpages() {
    return (
        <h1>
            {topic?.meta.title.hu}
        </h1>
    )
}