export const IntentMatcher = {
  keywordMatcher(message, intents) {
    if (!message || !intents) return [];
    
    const messageWords = message.toLowerCase().split(/\s+/);
    const matches = [];

    intents.forEach(intent => {
      if (!intent.keywords || intent.keywords.length === 0) return;
      
      let matchCount = 0;
      intent.keywords.forEach(keyword => {
        if (messageWords.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        // Simple confidence: ratio of matched keywords to total keywords (or message length)
        // Adjust logic as needed.
        const confidence = Math.min(matchCount / intent.keywords.length, 1.0) * 0.8; // Max 0.8 for keyword only
        matches.push({ intent, confidence, method: 'keyword' });
      }
    });

    return matches;
  },

  fuzzyMatcher(message, intents) {
     if (!message || !intents) return [];
     const matches = [];
     // Simplified "fuzzy" using substring for now to avoid heavy levenshtein in pure JS without deps
     // Or a simple implementation of Levenshtein if critical.
     // Let's do simple inclusion checks for examples.
     
     const lowerMsg = message.toLowerCase();
     
     intents.forEach(intent => {
        if (!intent.examples) return;
        
        let bestScore = 0;
        intent.examples.forEach(ex => {
            const lowerEx = ex.toLowerCase();
            if (lowerMsg === lowerEx) bestScore = 1.0;
            else if (lowerMsg.includes(lowerEx) || lowerEx.includes(lowerMsg)) bestScore = Math.max(bestScore, 0.7);
        });
        
        if (bestScore > 0) {
            matches.push({ intent, confidence: bestScore, method: 'fuzzy' });
        }
     });
     
     return matches;
  },

  exampleMatcher(message, intents) {
    // Placeholder for more complex NLP similarity
    // This often overlaps with fuzzy in frontend-only implementations
    return [];
  },

  combinedMatcher(message, intents) {
    if (!message || !intents) return null;

    const keywordMatches = this.keywordMatcher(message, intents);
    const fuzzyMatches = this.fuzzyMatcher(message, intents);
    
    // Combine results
    const allMatches = [...keywordMatches, ...fuzzyMatches];
    
    if (allMatches.length === 0) return null;

    // Sort by confidence
    allMatches.sort((a, b) => b.confidence - a.confidence);
    
    const bestMatch = allMatches[0];
    
    // Check threshold (default 0.6 if not set on intent)
    const threshold = bestMatch.intent.confidence_threshold || 0.6;
    
    if (bestMatch.confidence >= threshold) {
        return bestMatch.intent;
    }
    
    return null;
  }
};