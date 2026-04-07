import React from 'react';
import { Info, Film, Sparkles, Scissors, Mic, Type, Download, Globe, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection = ({ onStartEditing }) => {
  const features = [
    { icon: <Film className="w-6 h-6" />, title: "Professional Browser Editing", desc: "Full-featured multi-track editing right in your browser." },
    { icon: <Sparkles className="w-6 h-6" />, title: "AI-Powered Features", desc: "Auto-subtitles, noise removal, and smart cropping." },
    { icon: <Scissors className="w-6 h-6" />, title: "Timeline Editing", desc: "Drag, drop, split, and arrange clips with precision." },
    { icon: <Mic className="w-6 h-6" />, title: "Audio Mixing", desc: "Control volume, add background music, and record voiceovers." },
    { icon: <Type className="w-6 h-6" />, title: "Text Overlays", desc: "Add beautiful, customizable text and titles to your videos." },
    { icon: <Download className="w-6 h-6" />, title: "One-Click Export", desc: "Fast rendering and export to standard MP4 formats." },
    { icon: <Globe className="w-6 h-6" />, title: "No Installation", desc: "Works entirely in your browser without downloading heavy software." },
    { icon: <Play className="w-6 h-6" />, title: "Free to Use", desc: "Access premium editing features completely free of charge." },
  ];

  const useCases = [
    "YouTube Creators", "TikTok/Instagram Reels", "Podcasters (Video format)", 
    "Educational Content", "Marketing Videos", "Business Presentations", "Personal Projects"
  ];

  const benefits = [
    "Save hours of editing time with AI tools.",
    "No need for expensive hardware or software.",
    "Edit anywhere, anytime on any device.",
    "Intuitive interface for beginners and pros.",
    "Secure processing (files stay in your browser).",
    "Create engaging content that stands out.",
    "Constantly updated with new features."
  ];

  return (
    <div className="info-section-wrapper animate-fade-in">
      <h2 className="info-section-title text-indigo-800">
        <Info className="w-8 h-8 text-indigo-600" />
        About Video Studio Pro
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Video Studio Pro is a powerful, browser-based video editing platform that brings professional-grade tools directly to your fingertips. With advanced AI features, multi-track timeline editing, and seamless export capabilities, you can create stunning videos without the need for expensive software or heavy downloads.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {features.map((feat, idx) => (
            <div key={idx} className="info-card group">
              <div className="feature-icon-wrapper group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{feat.title}</h4>
              <p className="text-gray-600 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                    {useCases.map((useCase, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                            {useCase}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Use Video Studio Pro?</h3>
                <ul className="space-y-3">
                {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                    </li>
                ))}
                </ul>
            </div>
        </div>

        <div className="text-center mt-8">
            <Button size="lg" className="h-12 px-8 text-base rounded-full" onClick={onStartEditing}>
                Start Editing Now
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;