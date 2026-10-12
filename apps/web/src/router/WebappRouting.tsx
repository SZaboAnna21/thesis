import { createHashRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Homepage } from "../pages/Homepage";
import { Topicpages } from "../pages/Topicpages";


export const router = createHashRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Homepage />
            },
            {
                path: "/topics/:topicID",
                element: <Topicpages />
            }
        ]
    }
]);
