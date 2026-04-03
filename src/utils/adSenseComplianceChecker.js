
/**
 * Utility to verify AdSense policy compliance during development.
 */

// 1. Minimum 300 words
export const checkContentLength = (content) => {
  if (!content) return { valid: false, wordCount: 0, message: 'Content is empty' };
  
  const text = content.replace(/<[^>]*>?/gm, ''); // strip HTML
  const wordCount = text.trim().split(/\s+/).length;
  
  return {
    valid: wordCount >= 300,
    wordCount,
    message: wordCount >= 300 ? 'Content length meets minimum requirements' : `Content too short (${wordCount}/300 words)`
  };
};

// 2. Prohibited Content
export const checkProhibitedContent = (content) => {
  if (!content) return { valid: true, matches: [] };
  
  const prohibitedKeywords = [
    'violence', 'hate speech', 'illegal', 'adult content', 'gambling', 'hack', 'crack'
  ]; // Simplified list for demonstration
  
  const lowerContent = content.toLowerCase();
  const matches = prohibitedKeywords.filter(keyword => lowerContent.includes(keyword));
  
  return {
    valid: matches.length === 0,
    matches,
    message: matches.length === 0 ? 'No prohibited content detected' : 'Potential prohibited content found'
  };
};

// 3. Ad Placement Density
export const checkAdPlacement = (adCount, contentLength) => {
  // Generally, ads should not exceed content. 
  // A rough metric: 1 ad per 300 words maximum.
  const maxAds = Math.max(1, Math.floor(contentLength / 300));
  
  return {
    valid: adCount <= maxAds,
    adCount,
    maxAllowed: maxAds,
    message: adCount <= maxAds ? 'Ad density is acceptable' : 'Too many ads for the given content length'
  };
};

// 4. Page Structure
export const checkPageStructure = (pageDOMString) => {
  const hasNavigation = pageDOMString.includes('<nav') || pageDOMString.includes('role="navigation"');
  const hasH1 = pageDOMString.includes('<h1');
  
  return {
    valid: hasNavigation && hasH1,
    hasNavigation,
    hasH1,
    message: (hasNavigation && hasH1) ? 'Structure valid' : 'Missing essential structure (nav or h1)'
  };
};

// 5. Full Report
export const generateComplianceReport = (pagesData) => {
  return pagesData.map(page => {
    const lengthCheck = checkContentLength(page.content);
    const probCheck = checkProhibitedContent(page.content);
    const adCheck = checkAdPlacement(page.adCount || 0, lengthCheck.wordCount);
    
    return {
      pageId: page.id || page.url,
      isCompliant: lengthCheck.valid && probCheck.valid && adCheck.valid,
      details: {
        contentLength: lengthCheck,
        prohibitedContent: probCheck,
        adPlacement: adCheck
      }
    };
  });
};
