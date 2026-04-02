export const calculateSEOScore = (settings, content = '') => {
    if (!settings) return 0;
    let score = 0;
    
    // Title
    if (settings.title) {
        if (settings.title.length >= 30 && settings.title.length <= 60) score += 20;
        else if (settings.title.length > 0) score += 10;
    }

    // Description
    if (settings.description) {
        if (settings.description.length >= 120 && settings.description.length <= 160) score += 20;
        else if (settings.description.length > 0) score += 10;
    }

    // Keywords
    if (settings.keywords && settings.keywords.length > 0) score += 10;
    
    // OG Image
    if (settings.og_image) score += 10;
    
    // Canonical
    if (settings.canonical_url) score += 10;
    
    // Robots
    if (settings.robots && settings.robots.includes('index')) score += 10;

    // Content Length (Basic check)
    if (content.length > 300) score += 10;
    if (content.length > 1000) score += 10;

    return Math.min(score, 100);
};

export const generateSlug = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const extractExcerpt = (htmlContent, length = 150) => {
    if (!htmlContent) return '';
    const text = htmlContent.replace(/<[^>]*>/g, ''); // Strip HTML
    return text.length > length ? text.substring(0, length) + '...' : text;
};