import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import HotelList from "./pages/HotelList";
import HotelForm from "./pages/HotelForm";
import HotelDetail from "./pages/HotelDetail";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main hotel listing */}
                <Route
                    path="/"
                    element={<HotelList />}
                />

                {/* Add hotel */}
                <Route
                    path="/hotels/new"
                    element={<HotelForm />}
                />

                {/* Hotel details */}
                <Route
                    path="/hotels/:id"
                    element={<HotelDetail />}
                />

                {/* Edit hotel */}
                <Route
                    path="/hotels/:id/edit"
                    element={<HotelForm />}
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;