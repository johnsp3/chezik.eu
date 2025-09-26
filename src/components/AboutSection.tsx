/**
 * About Section Component
 * 
 * Displays comprehensive information about John Chezik with stats, timeline, and skills.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 */

'use client';

import React from 'react';
import { 
  Music, 
  BookOpen, 
  Award, 
  Users, 
  Clock, 
  Heart 
} from 'lucide-react';

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = () => {
  const stats = [
    { icon: Music, value: '6', label: 'Albums Released', color: 'text-blue-400' },
    { icon: BookOpen, value: '2', label: 'Books Published', color: 'text-green-400' },
    { icon: Award, value: 'Platinum', label: 'Selling Status', color: 'text-yellow-400' },
    { icon: Users, value: 'Decades', label: 'Of Creating', color: 'text-purple-400' }
  ];

  const timeline = [
    {
      year: '2025',
      title: 'Upcoming Releases',
      description: 'Released "Don&apos;t Say It&apos;s Over" - a heartfelt plea about enduring love, and preparing "The Visual Man" book exploring psychology and attraction for release.'
    },
    {
      year: '2024',
      title: 'Leadership & Rock',
      description: 'Published "The Alpha Code" - a bold guide for personal development and leadership, and released "The Visual Man" album exploring seduction and connection.'
    },
    {
      year: '2023',
      title: 'Blues Instrumental Mastery',
      description: 'Dropped "The Revealing" - a hard rock/blues/instrumental journey about embracing vulnerability and letting inner feelings shine.'
    },
    {
      year: '2022',
      title: 'Dark Rock Power',
      description: 'Released "Look At Me" - a dark and haunting exploration of fear, power, and psychological pursuit that showcases my harder edge.'
    },
    {
      year: '2021',
      title: 'Personal Reflection',
      description: 'Created "My Life" - a reflective anthem about the highs and lows of chasing the rock &apos;n&apos; roll dream and finding purpose in music.'
    },
    {
      year: '2020',
      title: 'My Favorite Ballads',
      description: 'Released "Something More" - a heartfelt ballad about enduring love and the strength it brings through life&apos;s challenges.'
    }
  ];

  return (
    <section id="about" className="section about-section">
      <div id="section-about" className="anchor-marker"></div>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Heart size={16} />
            <span>About Me</span>
          </div>
          
          <h2 className="section-title">Creative Journey</h2>
          
          <p className="section-description">
            A career spanning decades as a songwriter-singer and author, creating works that have 
            reached platinum status and critical acclaim across multiple creative disciplines.
          </p>
        </div>
        
        <div className="about-content">
          {/* Main Story */}
          <div className="story-section">
            <div className="story-card">
              <h3 className="story-title">About Me</h3>
              <p className="story-paragraph">
                From those early days of picking up my first guitar to hearing my songs on the radio, it&apos;s been an incredible ride of constant growth and discovery. Rock music gave me my foundation, but I found myself drawn to writing as another way to share what I&apos;ve learned along the way.
              </p>
              <p className="story-paragraph">
                Over the decades, I&apos;ve collaborated with Grammy Award-winning artists and contributed to countless projects. My six solo albums represent my personal artistic vision, while my collaborations showcase the breadth of my musical journey. The two books I&apos;ve written explore many of the same themes that drive my music - human connection, personal power, and the psychology behind what moves us.
              </p>
              <p className="story-paragraph">
                Getting that platinum certification was surreal - not just because of the sales, but because it meant the music I poured my heart into actually connected with people. Whether I&apos;m writing a song or a book, it all comes from the same place - this need to understand people and share what I&apos;ve discovered about life, relationships, and finding your own strength.
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="stat-card" style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}>
                    <div className={`stat-icon ${stat.color}`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Latest News */}
          <div className="news-section">
            <h3 className="news-title">
              <span className="news-icon">📰</span>
              Latest News & Updates
            </h3>
            
            <div className="news-grid">
              <div className="news-item">
                <div className="news-header">
                  <div className="news-category music">🎵 In the Studio</div>
                  <div className="news-date">Current</div>
                </div>
                <h4 className="news-item-title">Recording Album #7</h4>
                <p className="news-description">
                  Currently in pre-production for my 7th studio album, working with incredible session musicians to explore new sonic territories. The creative energy is electric, and I&apos;m pushing boundaries I&apos;ve never touched before.
                </p>
              </div>
              
              <div className="news-item">
                <div className="news-header">
                  <div className="news-category book">📚 New Book</div>
                  <div className="news-date">Spring 2026</div>
                </div>
                <h4 className="news-item-title">What Women Really Want</h4>
                <p className="news-description">
                  Putting the finishing touches on my upcoming book exploring authentic masculinity and genuine connection. A deep dive into understanding relationships from a psychological perspective.
                </p>
              </div>
              
              <div className="news-item">
                <div className="news-header">
                  <div className="news-category studio">🏗️ Studio Expansion</div>
                  <div className="news-date">2025</div>
                </div>
                <h4 className="news-item-title">Home Studio Renovation</h4>
                <p className="news-description">
                  Breaking ground on a major renovation of my home studio complex. Adding a full performance room with vintage acoustics and expanding the mixing suite for a creative sanctuary unlike anything I&apos;ve built before.
                </p>
              </div>
              
              <div className="news-item">
                <div className="news-header">
                  <div className="news-category gear">🎸 New Acquisition</div>
                  <div className="news-date">Recent</div>
                </div>
                <h4 className="news-item-title">Vintage Gibson Les Paul</h4>
                <p className="news-description">
                  Just acquired a rare 1970s Gibson Les Paul that&apos;s become my new go-to guitar. The tone is absolutely haunting - perfect for the darker material I&apos;m developing.
                </p>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="timeline-section">
            <h3 className="timeline-title">
              <Clock size={20} />
              My Creative Timeline
            </h3>
            
            <div className="timeline">
              {timeline.map((item, index) => (
                <div key={index} className="timeline-item" style={{ '--delay': `${index * 150}ms` } as React.CSSProperties}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">{item.year}</div>
                    <h4 className="timeline-item-title">{item.title}</h4>
                    <p className="timeline-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skills & Expertise */}
          <div className="skills-section">
            <h3 className="skills-title">Skills & Expertise</h3>
            
            <div className="skills-grid">
              <div className="skill-category">
                <h4 className="category-title">Musical Performance</h4>
                <ul className="skill-list">
                  <li>Professional Guitar Player</li>
                  <li>Professional Singer</li>
                  <li>Songwriter & Composer</li>
                  <li>Music Arrangement & Orchestration</li>
                </ul>
              </div>
              
              <div className="skill-category">
                <h4 className="category-title">Music Production</h4>
                <ul className="skill-list">
                  <li>Mixing & Mastering</li>
                  <li>Sound Design & Synthesis</li>
                  <li>Music Theory & Composition</li>
                  <li>Pro Tools & Studio Engineering</li>
                </ul>
              </div>
              
              <div className="skill-category">
                <h4 className="category-title">Writing & Publishing</h4>
                <ul className="skill-list">
                  <li>Creative Writing & Storytelling</li>
                  <li>E-book Design & Formatting</li>
                  <li>Content Strategy & Development</li>
                  <li>Digital Publishing Platforms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
