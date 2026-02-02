// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BalapanLanding from './BalapanLanding';
import Register from './Register';
import Login from './Login';
import Password from './Password';
import Newpass from './Newpass';
import Language from './Language';
import Lesson from './Lesson';
import Profile from './Profile';
import Edit from './Edit';
import Les from './Les';
import Set from './Set';
import Podcasts from './Podcasts';
import PodcastPlayer from './PodcastPlayer';
import PodcastVideoPlayer from './PodcastVideoPlayer';
import VideoLessons from './VideoLessons';
import VideoPlayer from './VideoPlayer';
import Stories from './Stories';
import StoryReader from './StoryReader';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<BalapanLanding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password" element={<Password />} />
        <Route path="/newpass" element={<Newpass />} />

        {/* Language Selection */}
        <Route path="/language" element={<Language />} />

        {/* Main Learning */}
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/les" element={<Les />} />
        <Route path="/set" element={<Set />} />

        {/* Podcasts */}
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/podcast/:podcastId" element={<PodcastPlayer />} />
        <Route path="/podcast-video/:id" element={<PodcastVideoPlayer />} />

        {/* Video Lessons */}
        <Route path="/videos" element={<VideoLessons />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />

        {/* Stories */}
        <Route path="/stories" element={<Stories />} />
        <Route path="/story/:storyId" element={<StoryReader />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </Router>
  );
}

export default App;