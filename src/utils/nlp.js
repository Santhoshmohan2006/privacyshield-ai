// Advanced Privacy NLP Engine with Multi-Category Classification & Regex Validation

// 50+ privacy risk keywords classified by category and severity
export const RISK_CATEGORIES = {
  PERSONAL: {
    name: 'Personal PII',
    color: '#aeb784', // primary sage green
    keywords: [
      'name', 'address', 'phone number', 'telephone', 'mobile number', 'email address', 
      'date of birth', 'dob', 'birthdate', 'place of birth', 'mother\'s maiden', 
      'age', 'signature', 'biometric', 'fingerprint', 'facial recognition'
    ],
    severity: 'High'
  },
  FINANCIAL: {
    name: 'Financial PII',
    color: '#ef4444', // danger red
    keywords: [
      'credit card', 'debit card', 'bank account', 'routing number', 'cvv', 'card number', 
      'ssn', 'social security', 'tax id', 'salary', 'income', 'pin code', 'billing address'
    ],
    severity: 'High'
  },
  HEALTH: {
    name: 'Health & Medical PII',
    color: '#f59e0b', // warning orange
    keywords: [
      'medical record', 'health insurance', 'prescription', 'diagnosis', 'disease', 
      'blood type', 'genetic data', 'clinical trials', 'patient ID', 'hospital records', 'medical history'
    ],
    severity: 'High'
  },
  IDENTITY: {
    name: 'Identity & Credentials',
    color: '#e3dbbb', // secondary warm cream
    keywords: [
      'passport', 'driver license', 'driver\'s license', 'national id', 'birth certificate', 
      'visa number', 'citizenship', 'state id', 'username', 'password', 'security question'
    ],
    severity: 'High'
  },
  NETWORK: {
    name: 'Network & Location',
    color: '#f8f3e1', // accent ivory
    keywords: [
      'location data', 'gps', 'coordinates', 'latitude', 'longitude', 'ip address', 
      'mac address', 'device id', 'imei', 'browser history', 'wifi network'
    ],
    severity: 'Medium'
  },
  CONSENT: {
    name: 'Privacy & Consent Risks',
    color: '#e3dbbb', // secondary warm cream
    keywords: [
      'sell data', 'share data', 'third party', 'advertisers', 'cookies', 'tracking pixels', 
      'data broker', 'analytics', 'marketing profiling', 'behavioral targeting', 'cloud backup'
    ],
    severity: 'Medium'
  }
};

// Regex patterns for structural PII validation
export const REGEX_PATTERNS = [
  { name: 'SSN', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, category: 'FINANCIAL', severity: 'High' },
  { name: 'Credit Card', pattern: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, category: 'FINANCIAL', severity: 'High' },
  { name: 'Email Address', pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, category: 'PERSONAL', severity: 'High' },
  { name: 'Phone Number', pattern: /\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, category: 'PERSONAL', severity: 'High' },
  { name: 'IP Address', pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, category: 'NETWORK', severity: 'Medium' }
];

export const analyzePrivacyRisk = (text) => {
  if (!text || text.trim() === '') {
    return {
      score: 0,
      scoreOutOf10: 0,
      matches: [],
      categoryBreakdown: {},
      level: 'Low',
      highlightedText: ''
    };
  }

  const matches = [];
  const categoryBreakdown = {};
  const highlightedTerms = new Set();

  // Initialize category counts
  Object.keys(RISK_CATEGORIES).forEach(cat => {
    categoryBreakdown[cat] = 0;
  });

  let rawScore = 0;
  const lowercaseText = text.toLowerCase();

  // 1. Structural Regex PII Extraction
  REGEX_PATTERNS.forEach(({ name, pattern, category, severity }) => {
    const rxMatches = text.match(pattern);
    if (rxMatches) {
      rxMatches.forEach(match => {
        matches.push({
          term: match,
          type: name,
          category: RISK_CATEGORIES[category].name,
          severity,
          isRegex: true
        });
        categoryBreakdown[category]++;
        highlightedTerms.add(match);
        rawScore += severity === 'High' ? 25 : 15;
      });
    }
  });

  // 2. Keyword-based Dictionary Search
  Object.entries(RISK_CATEGORIES).forEach(([catKey, catVal]) => {
    catVal.keywords.forEach(keyword => {
      // Use regex boundary word checking to prevent false positives inside other words
      const safeKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${safeKeyword}s?\\b`, 'gi');
      const kwMatches = text.match(regex);
      
      if (kwMatches) {
        kwMatches.forEach(match => {
          // Avoid double-counting if regex already captured it
          if (!Array.from(highlightedTerms).some(t => t.toLowerCase() === match.toLowerCase())) {
            matches.push({
              term: match,
              type: 'Keyword',
              category: catVal.name,
              severity: catVal.severity,
              isRegex: false
            });
            categoryBreakdown[catKey]++;
            highlightedTerms.add(match);
            rawScore += catVal.severity === 'High' ? 12 : 7;
          }
        });
      }
    });
  });

  // 3. Score Normalization (Range 0 - 100)
  const finalScore = Math.min(rawScore, 100);
  const scoreOutOf10 = Number((finalScore / 10).toFixed(1));

  let riskLevel = 'Low';
  if (finalScore >= 35 && finalScore < 70) {
    riskLevel = 'Medium';
  } else if (finalScore >= 70) {
    riskLevel = 'High';
  }

  // 4. HTML Text Highlighting
  // Sort terms by length (descending) so we don't break subwords during replace
  const sortedHighlightTerms = Array.from(highlightedTerms).sort((a, b) => b.length - a.length);
  let highlightedText = text;

  sortedHighlightTerms.forEach(term => {
    // Find the item details to select appropriate color class
    const matchItem = matches.find(m => m.term === term);
    const severity = matchItem ? matchItem.severity.toLowerCase() : 'low';
    
    // Replace occurrences safely
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const replaceRegex = new RegExp(`(${escapedTerm})`, 'gi');
    highlightedText = highlightedText.replace(replaceRegex, `<mark class="risk-${severity}">$1</mark>`);
  });

  return {
    score: finalScore,
    scoreOutOf10,
    matches,
    categoryBreakdown,
    level: riskLevel,
    highlightedText
  };
};

export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += Math.pow(vecA[i], 2);
    normB += Math.pow(vecB[i], 2);
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
