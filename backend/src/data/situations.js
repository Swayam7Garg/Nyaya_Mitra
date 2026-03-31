const situations = [
  // 1. HOUSING (10 Scenarios)
  {
    id: "landlord-dispute",
    category: "Housing",
    icon: "home",
    title: { en: "Landlord Dispute", hi: "मकान मालिक विवाद" },
    description: { en: "Issues with your landlord including illegal eviction or deposit refusal.", hi: "मकान मालिक के साथ समस्याएं।" },
    rights: [{ title: { en: "Illegal Eviction protection", hi: "अवैध बेदखली सुरक्षा" }, description: { en: "Cannot be evicted without a court order.", hi: "कोर्ट के बिना बेदखल नहीं कर सकते।" } }],
    laws: [{ section: "Section 106", act: "Transfer of Property Act", summary: { en: "Termination notice.", hi: "नोटिस।" }, fullText: "..." }],
    checklist: [{ item: { en: "Rent agreement", hi: "किराया समझौता" }, required: true }],
    steps: [{ stepNumber: 1, title: { en: "Legal notice", hi: "कानूनी नोटिस" }, description: { en: "Initial notice.", hi: "शुरुआती नोटिस।" }, tip: { en: "Post proof.", hi: "डार्क रसीद।" } }],
    templateType: "complaint"
  },
  {
    id: "illegal-eviction",
    category: "Housing",
    icon: "door-closed",
    title: { en: "Illegal Eviction", hi: "अवैध बेदखली" },
    description: { en: "Forced out without proper legal process.", hi: "बिना प्रक्रिया बाहर निकाला।" },
    rights: [{ title: { en: "Possession right", hi: "कब्जे का हक" }, description: { en: "Right to stay until due process.", hi: "कानूनी प्रक्रिया तक रहने का हक।" } }],
    laws: [{ section: "Section 6", act: "Specific Relief Act", summary: { en: "Suit for possession.", hi: "कब्जे का वाद।" }, fullText: "..." }],
    checklist: [{ item: { en: "Possession proof", hi: "कब्जे का प्रमाण" }, required: true }],
    steps: [{ stepNumber: 1, title: { en: "File suit", hi: "मुकदमा करें" }, description: { en: "Immediate court case.", hi: "कोर्ट में केस।" }, tip: { en: "Get injunction.", hi: "स्टे लें।" } }],
    templateType: "complaint"
  },
  { id: "deposit-refusal", category: "Housing", icon: "wallet", title: { en: "Deposit Refund refusal", hi: "जमानत वापसी मनाही" }, description: { en: "Refusing to return security deposit.", hi: "सिक्योरिटी वापस न करना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "maintenance-neglect", category: "Housing", icon: "tool", title: { en: "Maintenance Neglect", hi: "रखरखाव उपेक्षा" }, description: { en: "Basic repairs ignored.", hi: "मरम्मत काम न होना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "overcharging-rent", category: "Housing", icon: "trending-up", title: { en: "Rent Hike (Unfair)", hi: "किराया वृद्धि" }, description: { en: "Abrupt high hike.", hi: "अचानक बढ़ावा।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "utility-cutoff", category: "Housing", icon: "zap-off", title: { en: "Water/Electricity Cut", hi: "बिजली/पानी कटना" }, description: { en: "Cutting essentials to force eviction.", hi: "सुविधाएं बंद करना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "discrimination-housing", category: "Housing", icon: "user-x", title: { en: "Housing Discrimination", hi: "आवास भेदभाव" }, description: { en: "Refused home based on group.", hi: "समूह आधारित मनाही।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "encroachment-boundary", category: "Housing", icon: "map", title: { en: "Neighbor Encroachment", hi: "पड़ोसी अतिक्रमण" }, description: { en: "Neighbor took land part.", hi: "जमीन घेरना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "lease-violation", category: "Housing", icon: "file-minus", title: { en: "Lease Non-compliance", hi: "लीज का उल्लंघन" }, description: { en: "Breaking contract terms.", hi: "अनुबंध तोडना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "brokers-fraud", category: "Housing", icon: "users", title: { en: "Real Estate Broker Fraud", hi: "दलाल धोखाधड़ी" }, description: { en: "Taken money, no flat.", hi: "पैसे लिए, घर नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },

  // 2. CONSUMER (10 Scenarios)
  { id: "defective-phone", category: "Consumer Rights", icon: "smartphone", title: { en: "Defective Smartphone", hi: "खराब स्मार्टफोन" }, description: { en: "Brand new phone not working.", hi: "नया फोन खराब।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "warranty-denial", category: "Consumer Rights", icon: "check-circle", title: { en: "Warranty Claim Denial", hi: "वारंटी क्लेम मनाही" }, description: { en: "Valid warranty ignored.", hi: "वारंटी का अपमान।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "overcharging-mrp", category: "Consumer Rights", icon: "dollar-sign", title: { en: "Charged above MRP", hi: "MRP से ज्यादा पैसा" }, description: { en: "Shop charging more than printed.", hi: "लिखे दाम से ज्यादा।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "misleading-ad", category: "Consumer Rights", icon: "tv", title: { en: "Misleading Services", hi: "भ्रामक सेवा" }, description: { en: "Actually doesn't provide what's in ad.", hi: "विज्ञापन जैसा नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "insurance-rejection", category: "Consumer Rights", icon: "shield-off", title: { en: "Insurance Rejection", hi: "बीमा अस्वीकार" }, description: { en: "Fair claim denied.", hi: "क्लेम मना करना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "unauthorized-transaction", category: "Consumer Rights", icon: "credit-card", title: { en: "Unauthorized Bank Debit", hi: "अनधिकृत बैंक डेबिट" }, description: { en: "Money gone, bank not helping.", hi: "पैसे कटे, मदद नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "medical-negligence", category: "Consumer Rights", icon: "activity", title: { en: "Hospital Negligence", hi: "हॉस्पिटल लापरवाही" }, description: { en: "Wrong operation/care.", hi: "गलत इलाज।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "online-delivery-scam", category: "Consumer Rights", icon: "package", title: { en: "Fake Online Product", hi: "नकली ऑनलाइन सामान" }, description: { en: "Soap instead of phone.", hi: "फोन के बदले साबुन।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "education-refund", category: "Consumer Rights", icon: "book", title: { en: "Coaching Refund Issue", hi: "कोचिंग रिफंड" }, description: { en: "Left coaching, no refund.", hi: "पढ़ाई छोड़ी, रिफंड नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "delayed-possession", category: "Consumer Rights", icon: "building", title: { en: "Delayed Flat Possession", hi: "कब्जे में देरी" }, description: { en: "Builder delayed 2 years.", hi: "बिल्डर की देरी।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },

  // 3. EMPLOYMENT (10 Scenarios)
  { id: "harassment", category: "Employment", icon: "user-x", title: { en: "Workplace Harassment", hi: "उत्पीड़न" }, description: { en: "Bullying or sexual harassment.", hi: "यौन हिंसा या धमकाना।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "salary-delay", category: "Employment", icon: "clock", title: { en: "Salary not paid", hi: "वेतन नहीं मिला" }, description: { en: "3 months salary due.", hi: "3 महीने की पगार।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "wrongful-firing", category: "Employment", icon: "user-minus", title: { en: "Wrongful Firing", hi: "गलत बर्खास्तगी" }, description: { en: "Fired during medical leave.", hi: "बीमारी में निकाला।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "maternity-denial", category: "Employment", icon: "baby", title: { en: "Maternity Leave Denied", hi: "मातृत्व छुट्टी मना" }, description: { en: "Pregnancy leave refused.", hi: "छुट्टी नहीं मिली।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "bonus-gratuity", category: "Employment", icon: "award", title: { en: "Gratuity/Bonus Denied", hi: "ग्रेच्युटी/बोनस मना" }, description: { en: "5 years service, no benefit.", hi: "5 साल काम, कुछ नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "hazardous-work", category: "Employment", icon: "alert-octagon", title: { en: "Safety Neglect", hi: "सुरक्षा उपेक्षा" }, description: { en: "No safety gear in factory.", hi: "सुरक्षा उपकरण नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "pension-delay", category: "Employment", icon: "heart", title: { en: "Pension Delay", hi: "पेंशन देरी" }, description: { en: "Retired but no pension.", hi: "पेंशन रुकी।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "overtime-unpaid", category: "Employment", icon: "sun", title: { en: "Unpaid Overtime", hi: "बिना पैसे ओवरटाइम" }, description: { en: "Working 12 hours, paid 8.", hi: "12 घंटे काम, 8 के पैसे।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "discrimination", category: "Employment", icon: "git-branch", title: { en: "Caste/Gender Discrimination", hi: "जाति/लिंग भेदभाव" }, description: { en: "Fair pay denied.", hi: "समान वेतन नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "unregistered-work", category: "Employment", icon: "file-minus", title: { en: "Unorganized Sector help", hi: "असंगठित क्षेत्र मदद" }, description: { en: "No contract, need help.", hi: "अनुबंध नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },

  // 4. CRIMINAL (10 Scenarios)
  { id: "fake-fir", category: "Criminal", icon: "file-text", title: { en: "Fake FIR filed", hi: "फर्जी FIR" }, description: { en: "Someone filed fake case.", hi: "फर्जी केस।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "police-custody", category: "Criminal", icon: "lock", title: { en: "Illegal Detention", hi: "अवैध हिरासत" }, description: { en: "Held in lockup for 48 hours.", hi: "48 घंटे थाने में रखा।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "bribe-demand", category: "Criminal", icon: "dollar-sign", title: { en: "Police Bribe Demand", hi: "पुलिस रिश्वत की मांग" }, description: { en: "Demanding money for FIR.", hi: "FIR के लिए पैसे।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "chain-snatching", category: "Criminal", icon: "zap", title: { en: "Chain Snatching", hi: "चेन स्नेचिंग" }, description: { en: "Theft on street.", hi: "सड़क पर चोरी।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "cyber-bullying", category: "Criminal", icon: "monitor", title: { en: "Cyber Bullying", hi: "साइबर बुलिंग" }, description: { en: "Threats online.", hi: "ऑनलाइन धमकियां।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "illegal-search", category: "Criminal", icon: "shield-alert", title: { en: "Search without warrant", hi: "बिना वारंट तलाशी" }, description: { en: "Home searched without paper.", hi: "बिना कागज तलाशी।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "bail-help", category: "Criminal", icon: "key", title: { en: "Bail Procedure Help", hi: "जमानत प्रक्रिया मदद" }, description: { en: "Arrested, need bail.", hi: "जमानत चाहिए।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "missing-person", category: "Criminal", icon: "user-search", title: { en: "Missing Person", hi: "गुमशुदा व्यक्ति" }, description: { en: "Child not home 24 hrs.", hi: "बच्चा लापता।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "drunk-driving", category: "Criminal", icon: "alert-triangle", title: { en: "Drunk Driving Issue", hi: "शराब पीकर गाड़ी" }, description: { en: "Caught, need to know rights.", hi: "पकड़े गए, अधिकार बताएं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "assault-case", category: "Criminal", icon: "activity", title: { en: "Physical Assault", hi: "शारीरिक हमला" }, description: { en: "Attacked in street.", hi: "सड़क पर हमला।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },

  // 5. GOVERNMENT (10 Scenarios)
  { id: "rti-info", category: "Government", icon: "file-search", title: { en: "RTI for Road Work", hi: "सड़क काम के लिए RTI" }, description: { en: "Road broken, seek funds info.", hi: "सड़क मरम्मत जानकारी।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "rti" },
  { id: "ration-card", category: "Government", icon: "shopping-cart", title: { en: "Ration Card Delay", hi: "राशन कार्ड देरी" }, description: { en: "Applied 6 months, no card.", hi: "कार्ड नहीं मिला।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "aadhaar-problem", category: "Government", icon: "fingerprint", title: { en: "Aadhaar Correction", hi: "आधार सुधार" }, description: { en: "Rejected multiple times.", hi: "बार-बार रद्द।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "passport-verification", category: "Government", icon: "globe", title: { en: "Passport Police Issue", hi: "पासपोर्ट पुलिस मुद्दा" }, description: { en: "Police not clearing file.", hi: "पासपोर्ट अटका।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "voter-id-missing", category: "Government", icon: "check-square", title: { en: "Voter ID missing", hi: "वोटर आईडी गायब" }, description: { en: "Name not in list.", hi: "लिस्ट में नाम नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "scholarship-delay", category: "Government", icon: "award", title: { en: "Student Scholarship", hi: "छात्रवृत्ति" }, description: { en: "Money not credited.", hi: "पैसा नहीं आया।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "birth-cert", category: "Government", icon: "file-plus", title: { en: "Birth Certificate Issue", hi: "जन्म प्रमाण पत्र" }, description: { en: "Incorrect name on cert.", hi: "नाम गलत है।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "caste-cert", category: "Government", icon: "book-open", title: { en: "Caste Certificate", hi: "जाति प्रमाण पत्र" }, description: { en: "Unable to get SC/ST cert.", hi: "प्रमाण पत्र में दिक्कत।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "land-records-rti", category: "Government", icon: "map", title: { en: "RTI for Land Records", hi: "जमीन रिकॉर्ड RTI" }, description: { en: "Need old maps.", hi: "पुराने नक्शे चाहिए।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "rti" },
  { id: "corruption-report", category: "Government", icon: "alert-circle", title: { en: "Corruption Report", hi: "भ्रष्टाचार रिपोर्ट" }, description: { en: "Clerk asked for bribe.", hi: "बाबू ने पैसे मांगे।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },

  // 6. FAMILY (10 Scenarios)
  { id: "dv-support", category: "Family", icon: "heart", title: { en: "Domestic Violence", hi: "घरेलू हिंसा" }, description: { en: "Assault by spouse.", hi: "हिंसा।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "maintenance- kharcha", category: "Family", icon: "users", title: { en: "Maintenance Help", hi: "खर्चा मदद" }, description: { en: "Separated, no support.", hi: "कोई खर्चा नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "child-custody", category: "Family", icon: "users", title: { en: "Child Custody", hi: "बच्चे की कस्टडी" }, description: { en: "Wife/Husband took child.", hi: "बच्चा ले गए।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "alimony-dispute", category: "Family", icon: "dollar-sign", title: { en: "Alimony Dispute", hi: "तलाक खर्चा" }, description: { en: "One-time settlement issue.", hi: "निपटारा विवाद।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "inheritance", category: "Family", icon: "layers", title: { en: "Inheritance Right", hi: "विरासत हक" }, description: { en: "Denied share in father's land.", hi: "बाप की जमीन में हक नहीं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "dowry-harassment", category: "Family", icon: "alert-triangle", title: { en: "Dowry Harassment", hi: "दहेज उत्पीड़न" }, description: { en: "Demanding money/items.", hi: "दहेज की मांग।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "senior-citizen-neglect", category: "Family", icon: "smile", title: { en: "Parents Neglect", hi: "माता-पिता उपेक्षा" }, description: { en: "Children not feeding.", hi: "बच्चे खाना नहीं दे रहे।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "divorce-mutual", category: "Family", icon: "file-minus", title: { en: "Mutual Divorce", hi: "आपसी तलाक" }, description: { en: "Both want to separate.", hi: "दोनों अलग होना चाहते हैं।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "guardianship", category: "Family", icon: "user-plus", title: { en: "Guardianship", hi: "अभिभावकत्व" }, description: { en: "Adopted child legal help.", hi: "गोद लिया बच्चा।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" },
  { id: "inter-caste-marriage", category: "Family", icon: "heart-pulse", title: { en: "Inter-caste Marriage Help", hi: "अंतर्जातीय विवाह" }, description: { en: "Threat from family.", hi: "परिवार से खतरा।" }, rights: [], laws: [], checklist: [], steps: [], templateType: "complaint" }
];

module.exports = situations;
