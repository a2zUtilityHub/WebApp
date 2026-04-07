import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    { q: "What video formats are supported?", a: "We primarily support MP4 and WebM formats for reliable browser-based editing. For best results, use H.264 encoded MP4 files." },
    { q: "Is there a file size limit?", a: "Currently, we recommend keeping individual video files under 500MB for optimal browser performance. Larger files may cause the editor to run slowly." },
    { q: "Which browsers are supported?", a: "Video Studio Pro works best on modern, Chromium-based browsers like Google Chrome, Microsoft Edge, and Brave. Firefox and Safari are also supported but may have slight performance variations." },
    { q: "Is my data secure?", a: "Yes. The core editing process happens entirely within your browser. Your video files are not uploaded to our servers unless you specifically save a project to the cloud." },
    { q: "Can I edit multiple videos at once?", a: "Yes, you can add multiple video clips to the timeline, trim them, and arrange them in sequence to create a cohesive final video." },
    { q: "How long does export take?", a: "Export time depends on your computer's processing power, the length of the video, and the complexity of the edits (like AI features). A 1-minute 720p video usually takes 1-3 minutes." },
    { q: "Can I save my project and come back later?", a: "Project saving is available for authenticated users. Your timeline state is saved, but you may need to re-link local video files if you clear your browser cache." },
    { q: "Is there a maximum video duration?", a: "While there is no hard limit, we recommend keeping final exports under 15 minutes to prevent browser memory crashes." },
    { q: "Can I use copyrighted music?", a: "You can upload any audio file, but you are solely responsible for ensuring you have the rights to use the music in your final exported video." },
    { q: "How does the voiceover recording work?", a: "The voiceover tool accesses your computer's microphone. It records audio directly into the timeline synchronized with your video playback." },
    { q: "How accurate are the AI auto-subtitles?", a: "Our AI subtitle generation is highly accurate for clear, English speech. However, you can always manually edit the generated text before exporting." },
    { q: "Is it really free to use?", a: "Yes! Video Studio Pro offers robust editing features completely free. We may introduce premium tiers for extended AI usage or cloud storage in the future." }
  ];

  return (
    <div className="info-section-wrapper animate-fade-in">
      <h2 className="info-section-title text-indigo-800">
        <HelpCircle className="w-8 h-8 text-indigo-600" />
        Frequently Asked Questions
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-indigo-700">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQSection;