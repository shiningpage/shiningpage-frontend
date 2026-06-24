import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ReviewPage from './pages/ReviewPage';
import LoginPage from './pages/LoginPage';
import RubyPage from './pages/RubyPage';
import SocialMediaPage from './components/SocialMedia';
import LatestPage from './pages/LatestPage';
import NotificationPage from './pages/NotificationPage';
import ChatListPage from './pages/ChatListPage';

import WebPage from './pages/WebPage';
import PublisherPage from './pages/PublisherPage';
import PSPage from './pages/PSPage';
import ContentPage from './pages/ContentPage';
import ProjectsPage from './pages/ProjectsPage';
import BookingPage from './pages/BookingPage';
// import PjPage from './pages/PjPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';

import ToSPage from './pages/ToSPage';
import PrivacyPage from './pages/PrivacyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import SitemapPage from './pages/SitemapPage';

import Page404 from './pages/Page404';

class AppRoutes extends React.Component {
  render() {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/web/:username" element={<WebPage />} />
        <Route path="/publisher/:username" element={<PublisherPage />} />
        <Route path="/user/:username" element={<PublisherPage />} />
        <Route path="/ps/:id" element={<PSPage />} />
        <Route path="/publisher/:username/:slug" element={<ContentPage />} />
        <Route path="/projects/:username" element={<ProjectsPage />} />
        <Route path="/booking/:username" element={<BookingPage />} />
        {/* <Route path="/pj/:id" element={<PjPage />} /> */}
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/404" element={<Page404 />} />
        <Route path="/ruby" element={<RubyPage />} />
        {/* <Route path="/social-media" element={<SocialMediaPage />} /> */}
        <Route path="/latest" element={<LatestPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/tos" element={<ToSPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />

        {/* مسیر پیش‌فرض برای 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    );
  }
}

export default AppRoutes;
