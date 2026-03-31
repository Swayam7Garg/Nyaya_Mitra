const fs = require('fs');
const path = require('path');
const files = {};

// ─── locales/en/common.json ─────────────────────────────────────────────────
files['locales/en/common.json'] = JSON.stringify({
  nav: {
    situations: "Situations",
    lawyers: "Lawyers",
    about: "About",
    home: "Home"
  },
  home: {
    hero_title: "Know Your Rights",
    hero_title_hi: "अपना हक जानिए",
    hero_sub: "India's free AI-powered legal aid platform — plain language rights for every citizen.",
    cta: "Get Started",
    trust1_num: "45M+",
    trust1_label: "Pending cases in India",
    trust2_num: "Free",
    trust2_label: "Legal Aid for all",
    trust3_num: "Article 39A",
    trust3_label: "Constitutionally Guaranteed"
  },
  disclaimer: {
    text: "This platform provides legal information, not legal advice. For complex matters, consult a qualified lawyer. Content is sourced from official Indian law databases.",
    dismiss: "Dismiss"
  },
  situations: {
    page_title: "What situation are you facing?",
    page_sub: "Select the category that best matches your situation",
    landlord: { name: "Landlord Dispute", desc: "Illegal eviction, deposit refusals, uninhabitable conditions." },
    consumer: { name: "Consumer Complaint", desc: "Defective products, unfair practices, overcharging." },
    workplace: { name: "Workplace Harassment", desc: "Sexual harassment, wrongful termination, discrimination." },
    fir: { name: "FIR Filing", desc: "File a First Information Report with the police." },
    rti: { name: "RTI Application", desc: "Get information from any government office." },
    domestic: { name: "Domestic Violence", desc: "Abuse by a spouse, partner, or family member." },
    property: { name: "Property Dispute", desc: "Land ownership, inheritance, illegal encroachment." }
  },
  explain: {
    tabs: {
      rights: "Your Rights",
      checklist: "Document Checklist",
      procedure: "Step-by-Step",
      help: "Get Legal Help"
    },
    plain_title: "In simple terms:",
    law_title: "Original Law",
    source: "Source: indiacode.nic.in",
    ai_badge: "AI summary + verified law text",
    view_law: "View Original Law",
    checklist_title: "Documents you will need",
    progress: "{{done}} of {{total}} documents ready",
    download_checklist: "Download Checklist as PDF",
    step_time: "Est. time:",
    get_help_title: "Need legal assistance?",
    find_lawyer: "Find a Pro Bono Lawyer Near You",
    generate_docs: "Generate My Documents",
    loading: "Loading AI explanation...",
    fallback: "Could not load AI explanation — showing default content."
  },
  generate: {
    page_title: "Generate Document",
    step1: "Personal Details",
    step2: "Incident Details",
    step3: "Preview & Download",
    name: "Full Name",
    address: "Address",
    phone: "Phone Number",
    date: "Date",
    incident_date: "Date of Incident",
    description: "Description",
    amount: "Amount (if applicable)",
    respondent_name: "Respondent Name",
    respondent_address: "Respondent Address",
    authority: "Public Authority / Department",
    info_requested: "Information Requested",
    next: "Next",
    back: "Back",
    download_pdf: "Download as PDF",
    download_hindi: "Download in Hindi",
    copy: "Copy to Clipboard",
    copied: "Copied!",
    preview_title: "Document Preview",
    disclaimer: "This is a template. Review before submission. Platform is not responsible for legal outcomes.",
    generating: "Generating..."
  },
  lawyers: {
    page_title: "Pro Bono Legal Aid Lawyers",
    page_sub: "Connect with lawyers who provide free legal services",
    filter_city: "Filter by City",
    filter_area: "Practice Area",
    filter_lang: "Language",
    all_cities: "All Cities",
    all_areas: "All Areas",
    all_langs: "All Languages",
    verified: "Verified",
    pro_bono: "Available for Pro Bono",
    experience: "yrs exp",
    languages: "Languages",
    contact: "Contact Lawyer",
    no_results: "No lawyers found. Try a different city or practice area.",
    disclaimer: "Listing here is not an endorsement. Verify credentials independently.",
    nalsa_id: "NALSA/Bar Council ID"
  },
  about: {
    title: "About NyayaSaathi",
    mission_title: "Our Mission",
    mission: "NyayaSaathi exists to bridge the justice gap for India's first-generation litigants — citizens who face legal problems but have never engaged with the legal system. We provide plain-language rights information, AI-powered explanations, and free document templates.",
    how_title: "How It Works",
    tech_title: "Technology Used",
    sources_title: "Law Sources",
    ai_title: "Responsible AI",
    ai_text: "Every AI-generated explanation is shown alongside the original law text from IndiaCode. We use dual-display to ensure transparency — you always see both the simplified version and the source law.",
    team_title: "Built For",
    team_text: "This platform was built as a hackathon project to demonstrate responsible, accessible, bilingual AI for legal aid in India."
  },
  common: {
    loading: "Loading...",
    error: "Something went wrong. Please try again.",
    back: "Back",
    required: "Required",
    optional: "Optional"
  }
}, null, 2);

// ─── locales/hi/common.json ─────────────────────────────────────────────────
files['locales/hi/common.json'] = JSON.stringify({
  nav: {
    situations: "स्थितियां",
    lawyers: "वकील",
    about: "हमारे बारे में",
    home: "होम"
  },
  home: {
    hero_title: "अपना हक जानिए",
    hero_title_hi: "Know Your Rights",
    hero_sub: "भारत का निःशुल्क AI-आधारित कानूनी सहायता मंच — हर नागरिक के लिए सरल भाषा में अधिकार।",
    cta: "शुरू करें",
    trust1_num: "4.5 करोड़+",
    trust1_label: "भारत में लंबित मामले",
    trust2_num: "निःशुल्क",
    trust2_label: "सभी के लिए कानूनी सहायता",
    trust3_num: "अनुच्छेद 39A",
    trust3_label: "संवैधानिक रूप से गारंटीकृत"
  },
  disclaimer: {
    text: "यह मंच कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। जटिल मामलों के लिए किसी योग्य वकील से परामर्श करें।",
    dismiss: "बंद करें"
  },
  situations: {
    page_title: "आप किस स्थिति में हैं?",
    page_sub: "वह श्रेणी चुनें जो आपकी स्थिति से सबसे अच्छी तरह मेल खाती हो",
    landlord: { name: "मकान मालिक विवाद", desc: "अवैध बेदखली, जमानत राशि न देना, रहने योग्य न होने की स्थिति।" },
    consumer: { name: "उपभोक्ता शिकायत", desc: "दोषपूर्ण उत्पाद, अनुचित व्यापार प्रथाएं, अधिक शुल्क।" },
    workplace: { name: "कार्यस्थल उत्पीड़न", desc: "यौन उत्पीड़न, गलत बर्खास्तगी, भेदभाव।" },
    fir: { name: "FIR दर्ज करना", desc: "पुलिस के साथ प्रथम सूचना रिपोर्ट दर्ज करें।" },
    rti: { name: "RTI आवेदन", desc: "किसी भी सरकारी कार्यालय से जानकारी प्राप्त करें।" },
    domestic: { name: "घरेलू हिंसा", desc: "पति/पत्नी, साथी या परिवार के सदस्य द्वारा दुर्व्यवहार।" },
    property: { name: "संपत्ति विवाद", desc: "भूमि स्वामित्व, विरासत, अवैध कब्जा।" }
  },
  explain: {
    tabs: {
      rights: "आपके अधिकार",
      checklist: "जरूरी दस्तावेज़",
      procedure: "कदम-दर-कदम",
      help: "कानूनी मदद"
    },
    plain_title: "सरल भाषा में:",
    law_title: "मूल कानून",
    source: "स्रोत: indiacode.nic.in",
    ai_badge: "AI सारांश + सत्यापित कानून पाठ",
    view_law: "मूल कानून देखें",
    checklist_title: "आवश्यक दस्तावेज़",
    progress: "{{total}} में से {{done}} दस्तावेज़ तैयार",
    download_checklist: "PDF में चेकलिस्ट डाउनलोड करें",
    step_time: "अनुमानित समय:",
    get_help_title: "कानूनी सहायता चाहिए?",
    find_lawyer: "अपने पास निःशुल्क वकील खोजें",
    generate_docs: "मेरे दस्तावेज़ बनाएं",
    loading: "AI स्पष्टीकरण लोड हो रहा है...",
    fallback: "AI स्पष्टीकरण लोड नहीं हो सका — डिफ़ॉल्ट सामग्री दिखाई जा रही है।"
  },
  generate: {
    page_title: "दस्तावेज़ बनाएं",
    step1: "व्यक्तिगत विवरण",
    step2: "घटना विवरण",
    step3: "पूर्वावलोकन और डाउनलोड",
    name: "पूरा नाम",
    address: "पता",
    phone: "फोन नंबर",
    date: "तारीख",
    incident_date: "घटना की तारीख",
    description: "विवरण",
    amount: "राशि (यदि लागू हो)",
    respondent_name: "प्रतिवादी का नाम",
    respondent_address: "प्रतिवादी का पता",
    authority: "सार्वजनिक प्राधिकरण / विभाग",
    info_requested: "मांगी गई जानकारी",
    next: "अगला",
    back: "वापस",
    download_pdf: "PDF डाउनलोड करें",
    download_hindi: "हिंदी में डाउनलोड करें",
    copy: "क्लिपबोर्ड पर कॉपी करें",
    copied: "कॉपी हो गया!",
    preview_title: "दस्तावेज़ पूर्वावलोकन",
    disclaimer: "यह एक टेम्पलेट है। जमा करने से पहले समीक्षा करें।",
    generating: "बनाया जा रहा है..."
  },
  lawyers: {
    page_title: "निःशुल्क कानूनी सहायता वकील",
    page_sub: "उन वकीलों से जुड़ें जो मुफ्त कानूनी सेवाएं प्रदान करते हैं",
    filter_city: "शहर से फ़िल्टर करें",
    filter_area: "अभ्यास क्षेत्र",
    filter_lang: "भाषा",
    all_cities: "सभी शहर",
    all_areas: "सभी क्षेत्र",
    all_langs: "सभी भाषाएं",
    verified: "सत्यापित",
    pro_bono: "निःशुल्क सेवा के लिए उपलब्ध",
    experience: "वर्ष अनुभव",
    languages: "भाषाएं",
    contact: "वकील से संपर्क करें",
    no_results: "कोई वकील नहीं मिला। किसी अन्य शहर या क्षेत्र का प्रयास करें।",
    disclaimer: "यहाँ सूचीबद्ध करना समर्थन नहीं है। स्वतंत्र रूप से प्रमाणपत्र सत्यापित करें।",
    nalsa_id: "NALSA/बार काउंसिल ID"
  },
  about: {
    title: "NyayaSaathi के बारे में",
    mission_title: "हमारा मिशन",
    mission: "NyayaSaathi भारत के पहली पीढ़ी के वादियों के लिए न्याय की खाई को पाटने के लिए है।",
    how_title: "यह कैसे काम करता है",
    tech_title: "उपयोग की गई तकनीक",
    sources_title: "कानून स्रोत",
    ai_title: "जिम्मेदार AI",
    ai_text: "हर AI-जनित स्पष्टीकरण मूल कानून पाठ के साथ दिखाया जाता है।",
    team_title: "किसके लिए बनाया गया",
    team_text: "यह प्लेटफॉर्म भारत में कानूनी सहायता के लिए जिम्मेदार, सुलभ, द्विभाषी AI प्रदर्शित करने के लिए बनाया गया था।"
  },
  common: {
    loading: "लोड हो रहा है...",
    error: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    back: "वापस",
    required: "आवश्यक",
    optional: "वैकल्पिक"
  }
}, null, 2);

Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created:', filePath);
});
console.log('BATCH 2 DONE');
