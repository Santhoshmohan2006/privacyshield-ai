import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiSettings } from './storage';
import { analyzePrivacyRisk } from './nlp';

export const isGeminiOffline = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const localKey = getApiSettings();
  const isValidKey = (key) => key && key.trim() !== '' && key !== 'your_gemini_api_key_here';
  const offline = !isValidKey(localKey) && !isValidKey(envKey);
  console.log("isGeminiOffline check:", { envKey, localKey, offline });
  return offline;
};

export const getGeminiModel = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const localKey = getApiSettings();
  const isValidKey = (key) => key && key.trim() !== '' && key !== 'your_gemini_api_key_here';
  
  const apiKey = isValidKey(localKey) ? localKey.trim() : (isValidKey(envKey) ? envKey.trim() : null);
  
  if (!apiKey) throw new Error("Gemini API key is missing. Please set it in Settings.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// --- OFFLINE/SIMULATION FALLBACK GENERATORS ---

const getLocalFallbackChatResponse = (prompt) => {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('gdpr') || lower.includes('regulation') || lower.includes('law') || lower.includes('ccpa')) {
    return `### GDPR Compliance Principles (Offline Simulation Mode)

Under the **General Data Protection Regulation (GDPR)**, organizations must adhere to seven core principles:

1. **Transparency & Lawfulness:** Process data legally and be transparent with users.
2. **Purpose Limitation:** Only collect data for specified, legitimate purposes.
3. **Data Minimization:** Limit collection to what is strictly necessary.
4. **Accuracy:** Keep data accurate and up-to-date.
5. **Storage Limitation:** Retain data only as long as necessary.
6. **Integrity & Confidentiality (Security):** Implement robust encryption and controls.
7. **Accountability:** Be able to demonstrate compliance.

*Tip: Add your **Gemini API Key** in Settings to connect to the live Gemini LLM.*`;
  }
  
  if (lower.includes('federated') || lower.includes('decentralized') || lower.includes('edge') || lower.includes('machine learning')) {
    return `### Federated Learning & Edge AI (Offline Simulation Mode)

**Federated Learning** is a decentralized machine learning approach that trains models on edge devices without collecting raw user data:

- **Local Optimization:** Devices compute parameter updates locally based on user interactions.
- **Secure Aggregation:** Only encrypted weights/gradients are transmitted to a central server.
- **Key Benefit:** Raw user data never leaves the source, ensuring compliance with **Privacy by Design** principles.

*Tip: Add your **Gemini API Key** in Settings to connect to the live Gemini LLM.*`;
  }
  
  if (lower.includes('differential') || lower.includes('noise') || lower.includes('epsilon')) {
    return `### Differential Privacy (Offline Simulation Mode)

**Differential Privacy (DP)** is a mathematical framework that adds controlled noise to guarantee user anonymity:

- **Concept:** It ensures individual records cannot be identified, even if an attacker has auxiliary data.
- **Epsilon (ε) Parameter:** Controls the privacy budget (lower epsilon = more privacy but less utility).
- **Noise Injection:** Uses Laplace or Gaussian distributions to mask queries or training gradients.

*Tip: Add your **Gemini API Key** in Settings to connect to the live Gemini LLM.*`;
  }
  
  if (lower.includes('pii') || lower.includes('personal') || lower.includes('sensitive') || lower.includes('identifier')) {
    return `### Personally Identifiable Information (PII) (Offline Simulation Mode)

**Personally Identifiable Information (PII)** is any data that can trace an individual's identity:

- **High Risk:** SSNs, credit card numbers, health records, passport IDs.
- **Medium Risk:** Location traces, IP addresses, full names, email addresses.
- **Action Item:** Encrypt all PII using AES-256 and implement strict role-based access control.

*Tip: Add your **Gemini API Key** in Settings to connect to the live Gemini LLM.*`;
  }
  
  if (lower.includes('homomorphic') || lower.includes('encryption') || lower.includes('cryptography')) {
    return `### Homomorphic Encryption (Offline Simulation Mode)

**Homomorphic Encryption** enables computations directly on encrypted text:

- **No Decryption Required:** Cloud servers can compute data statistics or train models without ever seeing the plaintext data.
- **Use Case:** Secure medical diagnosis aggregation, outsourced database processing.
- **Limitation:** Highly CPU-intensive compared to standard encryption methods.

*Tip: Add your **Gemini API Key** in Settings to connect to the live Gemini LLM.*`;
  }
  
  if (lower.includes('quiz') || lower.includes('score') || lower.includes('encouragement') || lower.includes('feedback')) {
    return `Fantastic effort completing this privacy assessment! You have demonstrated a strong understanding of compliance benchmarks and threat management. For further progress, study localized anonymization techniques and check out our interactive CYOA simulations.`;
  }
  
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('help')) {
    return `Hello! I am your **AI Privacy Assistant** (currently running in Offline Simulation Mode).

Feel free to ask me anything about:
- **GDPR Principles**
- **Differential Privacy & Noise**
- **Federated Learning & Edge AI**
- **Personally Identifiable Information (PII)**
- **Homomorphic Encryption**

*Tip: Add your **Gemini API Key** in Settings to connect to the live Gemini LLM.*`;
  }
  
  return `### Offline AI Simulator

I am running in **Offline Simulation Mode** because no active Gemini API key was detected in Settings.

Regarding your prompt: *"${prompt}"*

**General Privacy Recommendation:**
- When designing AI systems, always enforce **Privacy by Design** and ensure compliance with regulations like GDPR and CCPA.
- Run a scan in the **Risk Analyzer** page to test your inputs for sensitive PII.

*Tip: To receive live, dynamic responses directly from Gemini, please enter a valid **Gemini API Key** in your Profile Settings.*`;
};

const getLocalRiskExplanation = (text, riskScore) => {
  const localAnalysis = analyzePrivacyRisk(text);
  if (localAnalysis.matches.length === 0) {
    return "This document has a clean audit signature. No common PII patterns or regulatory keywords were found in the scanned text.";
  }
  
  const categoriesFound = Array.from(new Set(localAnalysis.matches.map(m => m.category))).join(', ');
  const riskTerms = localAnalysis.matches.slice(0, 3).map(m => `"${m.term}"`).join(', ');
  
  return `Privacy Scan Warning: This document exposes sensitive data under categories: ${categoriesFound} (specifically terms like ${riskTerms}). Under GDPR Article 4, transmitting or storing un-hashed personal identifiers constitutes a high privacy risk. We recommend applying cryptographic masking or differential noise to sanitize this content before cloud ingestion.`;
};

const getLocalComplianceReport = (policyText) => {
  const lower = policyText.toLowerCase();
  
  const hasRights = lower.includes('erasure') || lower.includes('forget') || lower.includes('delete') || lower.includes('purge');
  const hasRetention = lower.includes('retain') || lower.includes('retention') || lower.includes('limit');
  const hasSharing = lower.includes('share') || lower.includes('third party') || lower.includes('disclosure');
  const hasContact = lower.includes('contact') || lower.includes('email') || lower.includes('@');
  const hasDpo = lower.includes('dpo') || lower.includes('protection officer');
  
  let report = `### Heuristic Compliance Audit (Offline Fallback Report)

Based on a static analysis of your Privacy Policy text, we identified the following regulatory issues:

`;

  if (!hasRights) {
    report += `- ⚠️ **Missing Data Subject Rights:** The policy does not clearly state how users can exercise their GDPR rights, such as the Right to Erasure (Article 17) or the Right to Access (Article 15).\n`;
  } else {
    report += `-  **Data Subject Rights:** Mentioned. Ensure there is a simple, automated workflow for users to request data deletion.\n`;
  }
  
  if (!hasRetention) {
    report += `- ⚠️ **Vague Retention Limits:** The guidelines do not specify a maximum storage period, violating the GDPR Principle of Storage Limitation (Article 5(1)(e)).\n`;
  } else {
    report += `-  **Storage Limitation:** Addressed. Ensure specific timelines are documented for each category of personal data.\n`;
  }

  if (!hasSharing) {
    report += `- ⚠️ **Third-Party Disclosures:** There is no explicit list or mention of categories of third-party processors, which is required under GDPR and CCPA transparency rules.\n`;
  } else {
    report += `-  **Third-Party Disclosures:** Described. Ensure all analytics and ad-tech tracking partners are listed.\n`;
  }

  if (!hasDpo) {
    report += `- ⚠️ **Data Protection Officer (DPO):** No DPO contact information is listed. Large scale processors or public bodies are legally mandated to appoint and publish DPO details.\n`;
  } else {
    report += `-  **Data Protection Officer:** Mentioned. Confirm DPO contact channels are directly reachable.\n`;
  }

  if (!hasContact) {
    report += `- ⚠️ **Missing General Inquiries Contact:** No valid email or physical address was found for compliance inquiries.\n`;
  }

  report += `\n**Key Recommendations:**
1. **Automate Deletion:** Provide an automated button or link inside settings to allow users to trigger instant account deletion.
2. **Clarify Timelines:** Define specific retention periods (e.g., '12 months after inactivity') rather than 'indefinitely'.
3. **Appoint a Contact:** Publish a dedicated privacy contact email (e.g., privacy@company.com).

*For a more advanced, context-rich analysis, configure a **Gemini API Key** in settings.*`;

  return report;
};

// --- PUBLIC API EXPORTS ---

export const chatWithGemini = async (prompt, history = []) => {
  if (isGeminiOffline()) {
    // Delay slightly to simulate AI model response time
    await new Promise(resolve => setTimeout(resolve, 800));
    return getLocalFallbackChatResponse(prompt);
  }
  
  try {
    const model = getGeminiModel();
    // Filter history so it starts with a 'user' message to comply with Google Gen AI SDK requirements
    const firstUserIdx = history.findIndex(msg => msg.role === 'user');
    const validHistory = firstUserIdx !== -1 ? history.slice(firstUserIdx) : [];

    const formattedHistory = validHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));
    
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error, falling back:", error);
    return `### ⚠️ Gemini API Connection Error
    
Failed to connect to the live Gemini LLM:
*${error.message}*

**Troubleshooting:**
1. Check your internet connection.
2. Verify that your Gemini API Key in **Profile & Settings** is correct and active.
3. Make sure the API key has access to the model \`gemini-1.5-flash\`.

---
${getLocalFallbackChatResponse(prompt)}`;
  }
};

export const analyzeRiskExplanation = async (text, riskScore) => {
  if (isGeminiOffline()) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return getLocalRiskExplanation(text, riskScore);
  }
  
  try {
    const model = getGeminiModel();
    const prompt = `You are a privacy expert. I have analyzed the following text and calculated a privacy risk score of ${riskScore.toFixed(2)} out of 10. Explain why this text might be risky regarding data privacy, GDPR, or general safety. Keep it concise, around 3 sentences. Text: "${text}"`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return `### ⚠️ Gemini API Connection Error
    
Failed to generate AI analysis: *${error.message}*

---
${getLocalRiskExplanation(text, riskScore)}`;
  }
};

export const analyzeCompliance = async (policyText) => {
  if (isGeminiOffline()) {
    await new Promise(resolve => setTimeout(resolve, 750));
    return getLocalComplianceReport(policyText);
  }
  
  try {
    const model = getGeminiModel();
    const prompt = `Act as a legal and privacy expert. Analyze this privacy policy for GDPR and CCPA compliance. Provide a summary of missing areas and recommendations. Format as plain text with clear bullet points. Policy: "${policyText.substring(0, 5000)}"`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Compliance Error:", error);
    return `### ⚠️ Gemini API Connection Error
    
Failed to generate AI compliance report: *${error.message}*

---
${getLocalComplianceReport(policyText)}`;
  }
};
