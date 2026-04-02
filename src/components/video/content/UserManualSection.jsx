
import React from 'react';
import { BookOpen, ListOrdered, Lightbulb, Shield } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const UserManualSection = () => {
  const steps = [
    { title: "Sign Up/Login", desc: "Create an account or log in to save your progress and access advanced features." },
    { title: "Upload Video", desc: "Drag and drop your video files into the upload area or click to browse. We support common formats like MP4, WebM, and MOV." },
    { title: "Preview", desc: "Use the built-in player to watch your uploaded video. You can play, pause, and scrub through the timeline." },
    { title: "Basic Editing", desc: "Select a clip in the timeline to trim, split, or delete sections you don't need." },
    { title: "Timeline Editing", desc: "Arrange multiple clips by dragging them along the timeline. Adjust their order to create your story." },
    { title: "Add Music", desc: "Click the 'Add Music' tool to overlay background tracks. Adjust the volume of the original video and the music track separately." },
    { title: "Add Text", desc: "Use the 'Add Text' tool to place titles, subtitles, or lower thirds on your video. Customize the font, size, and color." },
    { title: "Record Voiceover", desc: "Use the 'Voiceover' tool to record narration directly over your video timeline using your microphone." },
    { title: "Apply AI Features", desc: "Explore the 'AI Tools' panel to automatically generate subtitles, remove background noise, or enhance colors." },
    { title: "Export", desc: "Once satisfied, go to the Export panel, choose your resolution and format, and click 'Export & Download'." }
  ];

  const tips = [
    "Use keyboard shortcuts (Space to play/pause) to speed up your editing workflow.",
    "Always preview your AI-generated subtitles and correct any spelling mistakes before exporting.",
    "Keep background music volume lower than your voiceover for clarity.",
    "Split large videos into smaller segments for easier manipulation on the timeline."
  ];

  const troubleshooting = [
    { issue: "Video won't upload", fix: "Ensure your file is a supported format (MP4, WebM) and under the size limit. Refresh the page and try again." },
    { issue: "Export is failing or slow", fix: "Complex edits and high resolutions take time. Keep the browser tab active during export." },
    { issue: "Audio is out of sync", fix: "Try splitting the clip near the out-of-sync area and nudging it slightly." }
  ];

  return (
    <div className="info-section-wrapper animate-fade-in animation-delay-200">
      <h2 className="info-section-title text-indigo-800">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        User Manual
      </h2>
      
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-indigo-600" />
            Step-by-Step Guide
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {steps.map((step, index) => (
              <AccordionItem key={index} value={`step-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-indigo-700">
                  <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{index + 1}</span>
                      {step.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pl-9 pb-4">
                  {step.desc}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-indigo-600" />
                Tips & Tricks
            </h3>
            <div className="flex flex-col gap-3">
                {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/60 p-3 rounded-xl backdrop-blur-sm">
                    <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-indigo-900 text-sm">{tip}</span>
                </div>
                ))}
            </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-500" />
                Troubleshooting
            </h3>
            <div className="flex flex-col gap-4">
                {troubleshooting.map((item, idx) => (
                <div key={idx} className="border-l-2 border-red-200 pl-4 py-1">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.issue}</h4>
                    <p className="text-sm text-gray-600">{item.fix}</p>
                </div>
                ))}
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserManualSection;
