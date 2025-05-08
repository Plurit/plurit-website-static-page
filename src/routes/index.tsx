import { Route, Routes } from "react-router";
import Home from "../pages/home";
import EventDetailPage from "../pages/event/detail";

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="event" element={<EventDetailPage />}>
        <Route path=":eventId" element={<EventDetailPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
