import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "../pages/Homepage";
import { Topicpages } from "../pages/Topicpages";


export const router = createBrowserRouter([
    {
        path: "/",
        element: < Homepage />
    },
    {
        path: "/topics/:topicID",
        element: < Topicpages /> 
    }
]);