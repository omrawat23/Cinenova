import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "@/pages/Home"; // Page components
import Layout from './Layout';
import TvSeries from './pages/TvSeries';
import Movies from './pages/Movies';
import VideoPage from './components/VideoPage';
import TvVideoPage from './components/TvVideoPage';

const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/tv-series" element={<TvSeries />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/videopage/:movieId" element={<VideoPage />} />
          <Route path="/tv-videopage/:movieId" element={<TvVideoPage />} />
          
          {/* <Route path="/porn" element={<VideoPage1 />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
