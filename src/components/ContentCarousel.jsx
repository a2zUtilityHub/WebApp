import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';

// This is the main application component that renders the ContentCarousel.
// All components, styles, and logic are included in this single file for a runnable example.
const App = () => {
  // Mock data for the carousel to demonstrate functionality.
  // The Swiper warning about the loop will not appear here because we have more than 5 items.
  const carouselItems = [
    { id: 1, title: 'Item 1', description: 'Description for item 1.' },
    { id: 2, title: 'Item 2', description: 'Description for item 2.' },
    { id: 3, title: 'Item 3', description: 'Description for item 3.' },
    { id: 4, title: 'Item 4', description: 'Description for item 4.' },
    { id: 5, title: 'Item 5', description: 'Description for item 5.' },
    { id: 6, title: 'Item 6', description: 'Description for item 6.' },
    { id: 7, title: 'Item 7', description: 'Description for item 7.' },
    { id: 8, title: 'Item 8', description: 'Description for item 8.' },
  ];

  // A simple CardComponent for the carousel to render.
  const PostCard = ({ post }) => (
    <div className="p-4 rounded-lg bg-gray-800 shadow-md h-full">
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-400">{post.description}</p>
    </div>
  );

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen p-8">
      <ContentCarousel
        title="Recent Posts"
        icon={ArrowRight} // Using ArrowRight as a placeholder icon from lucide-react
        link="/posts"
        items={carouselItems}
        CardComponent={PostCard}
      />
    </div>
  );
};

// ==================== Dependencies included in one file ====================

// Simple Swiper-like component for demonstration
const Swiper = ({ children, navigation, ...props }) => (
  <div className="swiper-container relative">
    <div className="swiper-wrapper flex overflow-x-auto gap-4 scrollbar-hide">
      {children}
    </div>
  </div>
);
const SwiperSlide = ({ children }) => (
  <div className="swiper-slide min-w-[200px] max-w-[calc(100%/5-1rem)]">{children}</div>
);

// Mock components for demonstration purposes
const Button = ({ asChild, variant, children }) => {
  const styles = 'px-4 py-2 rounded-md font-medium';
  const variantStyles = variant === 'outline' ? 'border border-gray-600 text-gray-200' : 'bg-blue-500 text-white';
  return asChild ? <div className={`${styles} ${variantStyles}`}>{children}</div> : <button className={`${styles} ${variantStyles}`}>{children}</button>;
};

const Link = ({ to, children }) => <a href={to}>{children}</a>;
const ArrowRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

// The original ContentCarousel component you provided.
const ContentCarousel = ({ title, icon: Icon, link, items, CardComponent }) => {
  // Check if there are items to render. If not, return null.
  if (!items || items.length === 0) {
    return null;
  }

  // Determine the prop name for the CardComponent based on its name.
  // This is a dynamic way to pass the data, which is a good pattern.
  const propName = CardComponent.name === 'CouponCard' ? 'coupon' : 'post';
  // Determine the number of slides to show per view.
  // The 'Swiper' warning you saw is related to this and the 'items.length'.
  const slidesPerView = Math.min(items.length, 5);

  return (
    <div className="full-width-container py-16">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          {/* Render the icon if it exists. */}
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          {title}
        </h2>
        {/* The 'Show All' button is a link to the full list of items. */}
        <Button asChild variant="outline">
          <Link to={link}>
            Show All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      {/*
        This is a simplified Swiper component for demonstration. In a full app,
        you'd use the actual Swiper library. The logic here mirrors the original,
        conditionally enabling 'loop' based on the number of items.
      */}
      <Swiper
        modules={[]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        loop={items.length > slidesPerView}
        breakpoints={{
          640: { slidesPerView: Math.min(items.length, 2), spaceBetween: 20 },
          768: { slidesPerView: Math.min(items.length, 3), spaceBetween: 30 },
          1024: { slidesPerView: Math.min(items.length, 4), spaceBetween: 30 },
          1280: { slidesPerView: slidesPerView, spaceBetween: 30 },
        }}
        className="w-full"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="h-auto">
            <CardComponent {...{ [propName]: item }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Render the application to the document.
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);