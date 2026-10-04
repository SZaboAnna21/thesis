import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Homepage } from "../pages/Homepage";
import { Topicpages } from "../pages/Topicpages";


export const router = createBrowserRouter([
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
