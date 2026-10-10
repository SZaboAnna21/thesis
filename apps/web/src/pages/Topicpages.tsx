import { getTopic, type TopicGroup } from "@fotoc/content"
import { useParams } from "react-router-dom"
import { TheoryRenderer } from "../components/Theoryrenderer";
import { QuizView } from "../components/QuizView";
import { modules } from "../modules";

const groupLabels: Record<TopicGroup, string> = {
    foundations: "Alapok",
    regular: "Reguláris nyelvek",
    "context-free": "Környezetfüggetlen nyelvek",
    "context-sensitive": "Környezetfüggő nyelvek",
    computability: "Kiszámíthatóság",
};

export function Topicpages() {

    const {topicID} = useParams();
    const topic = getTopic(topicID!);

    if (!topic){
        return(
            <div>No topic found</div>
        )
    }

    const renderModule = topic.meta.module ? modules[topic.meta.module] : undefined;
    const course = topic.meta.group === "computability" ? "Számításelmélet II" : "Számításelmélet I";

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
            <p className="text-sm font-semibold italic text-slate-500">
                {course} &gt; {groupLabels[topic.meta.group]} &gt; {topic.meta.title.hu}
            </p>
            <h1 className="mt-12 mb-16 text-center text-4xl font-bold text-slate-900 sm:text-5xl">
                {topic.meta.title.hu}
            </h1>
            <TheoryRenderer blocks={topic.content} />
            {renderModule && (
                <section className="mt-16">
                    <h2 className="mb-6 text-3xl font-bold text-brand-700">Próbáld ki!</h2>
                    {renderModule()}
                </section>
            )}
            {topic.quiz && topic.quiz.length > 0 && (
                <section className="mt-16">
                    <h2 className="mb-6 text-3xl font-bold text-brand-700">Teszteld magad!</h2>
                    <QuizView questions={topic.quiz} />
                </section>
            )}
        </div>
)
}
