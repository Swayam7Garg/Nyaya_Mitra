/**
 * Backend seed data — full 8 situations with complete rights, laws, checklist & steps.
 * These are seeded into MongoDB on first launch if the collection is empty.
 * The AI chat feature relies on this data for its system prompt context.
 */
const situations = [
  {
    id: "landlord-dispute",
    category: "Housing",
    icon: "Home",
    title: { en: "Landlord Dispute", hi: "मकान मालिक विवाद" },
    description: { en: "Issues with your landlord including illegal eviction, deposit refusal, or uninhabitable conditions.", hi: "मकान मालिक के साथ समस्याएं जैसे अवैध बेदखली, जमानत राशि न देना।" },
    rights: [
      { title: { en: "Right against Illegal Eviction", hi: "अवैध बेदखली के खिलाफ अधिकार" }, description: { en: "A landlord cannot evict you without proper legal notice and court order.", hi: "मकान मालिक बिना उचित कानूनी नोटिस और अदालत के आदेश के आपको बेदखल नहीं कर सकता।" } },
      { title: { en: "Right to Security Deposit Refund", hi: "सुरक्षा जमा वापसी का अधिकार" }, description: { en: "Your security deposit must be returned within 30 days of vacating the property.", hi: "आपकी सुरक्षा जमा राशि 30 दिनों के भीतर वापस की जानी चाहिए।" } },
      { title: { en: "Right to Habitable Conditions", hi: "रहने योग्य स्थिति का अधिकार" }, description: { en: "Landlord must maintain basic amenities — water, electricity, and structural safety.", hi: "मकान मालिक बुनियादी सुविधाएं बनाए रखने के लिए बाध्य है।" } }
    ],
    laws: [{ section: "Section 106", act: "Transfer of Property Act, 1882", summary: { en: "Landlord must give 15-day notice before terminating monthly tenancy.", hi: "किरायेदारी समाप्त करने से पहले 15 दिन का नोटिस देना होगा।" }, fullText: "In the absence of a contract or local usage to the contrary, a lease of immovable property shall be deemed to be a lease from year to year, terminable by six months notice..." }],
    checklist: [
      { id: "ld1", item: { en: "Copy of rent agreement / lease deed", hi: "किराया समझौते की प्रति" }, required: true },
      { id: "ld2", item: { en: "Rent payment receipts (last 6 months)", hi: "किराया रसीदें (पिछले 6 महीने)" }, required: true },
      { id: "ld3", item: { en: "Security deposit payment proof", hi: "सुरक्षा जमा प्रमाण" }, required: true },
      { id: "ld4", item: { en: "Photos/videos of property condition", hi: "संपत्ति की तस्वीरें/वीडियो" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Send a Legal Notice", hi: "कानूनी नोटिस भेजें" }, description: { en: "Send a written notice to your landlord via registered post citing the specific grievance.", hi: "अपने मकान मालिक को रजिस्टर्ड डाक से लिखित नोटिस भेजें।" }, tip: { en: "Keep the postal receipt as proof of delivery.", hi: "डाक रसीद रखें।" } },
      { stepNumber: 2, title: { en: "File with Rent Authority", hi: "किराया प्राधिकरण में शिकायत दर्ज करें" }, description: { en: "File a complaint with your local Rent Controller or District Court.", hi: "स्थानीय किराया नियंत्रक या जिला न्यायालय में शिकायत दर्ज करें।" }, tip: { en: "Attach all documents from the checklist.", hi: "चेकलिस्ट के सभी दस्तावेज संलग्न करें।" } },
      { stepNumber: 3, title: { en: "Seek Legal Aid", hi: "कानूनी सहायता लें" }, description: { en: "Contact the District Legal Services Authority (DLSA) for free legal aid.", hi: "जिला कानूनी सेवा प्राधिकरण से संपर्क करें।" }, tip: { en: "DLSA services are free for BPL families.", hi: "DLSA सेवाएं BPL परिवारों के लिए मुफ्त हैं।" } }
    ],
    templateType: "complaint"
  },
  {
    id: "consumer-complaint",
    category: "Consumer Rights",
    icon: "ShoppingBag",
    title: { en: "Consumer Complaint", hi: "उपभोक्ता शिकायत" },
    description: { en: "Defective products, unfair trade practices, service deficiency, or overcharging.", hi: "दोषपूर्ण उत्पाद, अनुचित व्यापार प्रथाएं, सेवा में कमी।" },
    rights: [
      { title: { en: "Right to be Protected", hi: "संरक्षण का अधिकार" }, description: { en: "You have the right to be protected against marketing of hazardous goods and services.", hi: "आपको खतरनाक वस्तुओं और सेवाओं से सुरक्षित रहने का अधिकार है।" } },
      { title: { en: "Right to Seek Redressal", hi: "निवारण का अधिकार" }, description: { en: "You can seek redressal against unfair trade practices before the Consumer Forum.", hi: "आप उपभोक्ता मंच में अनुचित व्यापार प्रथाओं के खिलाफ निवारण मांग सकते हैं।" } },
      { title: { en: "Right to be Informed", hi: "सूचित होने का अधिकार" }, description: { en: "You have the right to be informed about quality, quantity, and price of goods.", hi: "आपको वस्तुओं की गुणवत्ता, मात्रा और कीमत के बारे में सूचित होने का अधिकार है।" } }
    ],
    laws: [{ section: "Section 35", act: "Consumer Protection Act, 2019", summary: { en: "Allows filing complaint before District Consumer Forum for claims up to Rs. 1 crore.", hi: "1 करोड़ रुपये तक के दावों के लिए जिला उपभोक्ता मंच में शिकायत दर्ज कर सकते हैं।" }, fullText: "A complaint in relation to any goods sold or delivered or agreed to be sold or any service provided may be filed with a District Commission by the complainant..." }],
    checklist: [
      { id: "cc1", item: { en: "Bill / invoice / receipt of purchase", hi: "खरीद का बिल / चालान / रसीद" }, required: true },
      { id: "cc2", item: { en: "Product/service details and defect description", hi: "उत्पाद विवरण और दोष विवरण" }, required: true },
      { id: "cc3", item: { en: "Written complaint to the company", hi: "कंपनी को लिखित शिकायत" }, required: true },
      { id: "cc4", item: { en: "Company response or refusal letter", hi: "कंपनी की प्रतिक्रिया" }, required: false },
      { id: "cc5", item: { en: "Photos of defective product", hi: "दोषपूर्ण उत्पाद की तस्वीरें" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Complain to the Business", hi: "व्यापार से शिकायत करें" }, description: { en: "Write to the company customer service. Give them 30 days to respond.", hi: "कंपनी की ग्राहक सेवा को लिखें। उन्हें 30 दिन दें।" }, tip: { en: "Always communicate in writing.", hi: "हमेशा लिखित रूप में संवाद करें।" } },
      { stepNumber: 2, title: { en: "File with Consumer Forum", hi: "उपभोक्ता मंच में दर्ज करें" }, description: { en: "File at the District Consumer Disputes Redressal Commission. No lawyer required.", hi: "जिला उपभोक्ता विवाद निवारण आयोग में शिकायत दर्ज करें।" }, tip: { en: "File online at consumerhelpline.gov.in", hi: "consumerhelpline.gov.in पर ऑनलाइन दर्ज करें।" } },
      { stepNumber: 3, title: { en: "Call NCH Helpline", hi: "NCH हेल्पलाइन पर कॉल करें" }, description: { en: "Call 1915 (National Consumer Helpline) for guidance.", hi: "औपचारिक दाखिल करने से पहले 1915 पर कॉल करें।" }, tip: { en: "NCH is available in multiple languages.", hi: "NCH कई भाषाओं में उपलब्ध है।" } }
    ],
    templateType: "complaint"
  },
  {
    id: "workplace-harassment",
    category: "Employment",
    icon: "Briefcase",
    title: { en: "Workplace Harassment", hi: "कार्यस्थल उत्पीड़न" },
    description: { en: "Sexual harassment, bullying, wrongful termination, or discrimination at your workplace.", hi: "कार्यस्थल पर यौन उत्पीड़न, धमकाना, गलत बर्खास्तगी।" },
    rights: [
      { title: { en: "Right to Safe Workplace", hi: "सुरक्षित कार्यस्थल का अधिकार" }, description: { en: "Every employee has the right to work in an environment free from harassment under POSH Act 2013.", hi: "हर कर्मचारी को POSH अधिनियम 2013 के तहत उत्पीड़न मुक्त वातावरण में काम करने का अधिकार है।" } },
      { title: { en: "Right to File ICC Complaint", hi: "ICC शिकायत दर्ज करने का अधिकार" }, description: { en: "You can file a complaint with the Internal Complaints Committee (ICC) within 3 months.", hi: "आप घटना के 3 महीने के भीतर ICC में शिकायत दर्ज कर सकते हैं।" } }
    ],
    laws: [{ section: "Section 4", act: "POSH Act, 2013", summary: { en: "Every employer with 10+ employees must constitute an Internal Complaints Committee (ICC).", hi: "10+ कर्मचारियों वाले नियोक्ता को ICC बनानी होगी।" }, fullText: "Every employer of a workplace shall, by an order in writing, constitute a Committee to be known as the Internal Complaints Committee..." }],
    checklist: [
      { id: "wh1", item: { en: "Written account of incidents with dates", hi: "तारीखों के साथ घटनाओं का विवरण" }, required: true },
      { id: "wh2", item: { en: "Written/electronic evidence (emails, messages)", hi: "ईमेल, संदेश जैसे साक्ष्य" }, required: false },
      { id: "wh3", item: { en: "Witness names and contact details", hi: "गवाहों के नाम और संपर्क" }, required: false },
      { id: "wh4", item: { en: "Employment contract / offer letter", hi: "रोजगार अनुबंध / ऑफर लेटर" }, required: true }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Document Everything", hi: "सब कुछ दस्तावेज़ करें" }, description: { en: "Keep a written record of all incidents with dates. Save all relevant communications.", hi: "तारीखों के साथ सभी घटनाओं का लिखित रिकॉर्ड रखें।" }, tip: { en: "Store evidence on personal device, not company systems.", hi: "व्यक्तिगत डिवाइस में साक्ष्य रखें।" } },
      { stepNumber: 2, title: { en: "File ICC Complaint", hi: "ICC शिकायत दर्ज करें" }, description: { en: "Submit written complaint to your organization ICC within 3 months.", hi: "3 महीने के भीतर ICC को लिखित शिकायत दें।" }, tip: { en: "Request acknowledgment receipt.", hi: "रसीद मांगें।" } },
      { stepNumber: 3, title: { en: "Approach Labour Court", hi: "श्रम न्यायालय जाएं" }, description: { en: "If ICC ruling is unsatisfactory, appeal to the Labour Court or High Court.", hi: "यदि ICC निर्णय असंतोषजनक हो तो श्रम न्यायालय में अपील करें।" }, tip: { en: "You may be entitled to interim relief during proceedings.", hi: "कार्यवाही के दौरान अंतरिम राहत मिल सकती है।" } }
    ],
    templateType: "complaint"
  },
  {
    id: "fir-filing",
    category: "Criminal",
    icon: "Shield",
    title: { en: "FIR Filing", hi: "FIR दर्ज करना" },
    description: { en: "How to file a First Information Report (FIR) with police for cognizable offences.", hi: "संज्ञेय अपराधों के लिए FIR कैसे दर्ज करें।" },
    rights: [
      { title: { en: "Right to File FIR Free of Cost", hi: "निःशुल्क FIR दर्ज करने का अधिकार" }, description: { en: "Police are legally bound to register your FIR free of cost for any cognizable offence.", hi: "पुलिस निःशुल्क FIR दर्ज करने के लिए कानूनी रूप से बाध्य है।" } },
      { title: { en: "Right to a Copy of FIR", hi: "FIR की प्रति का अधिकार" }, description: { en: "You are entitled to receive a free copy of the FIR immediately after registration.", hi: "FIR दर्ज होने के तुरंत बाद मुफ्त प्रति पाने का अधिकार है।" } },
      { title: { en: "Right to Zero FIR", hi: "जीरो FIR का अधिकार" }, description: { en: "You can file a Zero FIR at any police station regardless of jurisdiction.", hi: "किसी भी पुलिस स्टेशन पर जीरो FIR दर्ज कर सकते हैं।" } }
    ],
    laws: [{ section: "Section 154", act: "Code of Criminal Procedure, 1973", summary: { en: "Police must register FIR for every cognizable offence without any conditions.", hi: "पुलिस को हर संज्ञेय अपराध के लिए FIR दर्ज करनी होगी।" }, fullText: "Every information relating to the commission of a cognisable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction..." }],
    checklist: [
      { id: "fir1", item: { en: "Personal identification proof (Aadhaar/Voter ID)", hi: "पहचान प्रमाण (आधार/मतदाता पहचान पत्र)" }, required: true },
      { id: "fir2", item: { en: "Written complaint with incident details", hi: "घटना विवरण के साथ लिखित शिकायत" }, required: true },
      { id: "fir3", item: { en: "Date, time and place of incident", hi: "घटना की तारीख, समय और स्थान" }, required: true },
      { id: "fir4", item: { en: "Names of accused (if known)", hi: "आरोपियों के नाम (यदि ज्ञात हो)" }, required: false },
      { id: "fir5", item: { en: "Any physical evidence or photographs", hi: "भौतिक साक्ष्य या तस्वीरें" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Visit the Police Station", hi: "पुलिस स्टेशन जाएं" }, description: { en: "Go to the police station having jurisdiction. e-FIR is also available online in many states.", hi: "उस क्षेत्र के पुलिस स्टेशन पर जाएं जहां अपराध हुआ।" }, tip: { en: "If police refuse, approach Superintendent of Police or Magistrate u/s 156(3).", hi: "यदि पुलिस मना करे तो SP या मजिस्ट्रेट के पास जाएं।" } },
      { stepNumber: 2, title: { en: "Give Your Statement", hi: "अपना बयान दें" }, description: { en: "The officer will record your statement. Read carefully before signing.", hi: "अधिकारी आपका बयान दर्ज करेगा। हस्ताक्षर से पहले ध्यान से पढ़ें।" }, tip: { en: "Never sign a blank or incomplete FIR.", hi: "अधूरी FIR पर कभी हस्ताक्षर न करें।" } },
      { stepNumber: 3, title: { en: "Collect FIR Copy", hi: "FIR प्रति लें" }, description: { en: "Demand and collect a signed copy of the FIR. Note the FIR number for tracking.", hi: "FIR की हस्ताक्षरित प्रति लें। FIR नंबर नोट करें।" }, tip: { en: "Track case status on state police portal using FIR number.", hi: "FIR नंबर से पुलिस पोर्टल पर ट्रैक करें।" } }
    ],
    templateType: "fir"
  },
  {
    id: "rti-application",
    category: "Government",
    icon: "FileText",
    title: { en: "RTI Application", hi: "RTI आवेदन" },
    description: { en: "File a Right to Information application to get information from government offices.", hi: "सरकारी कार्यालयों से जानकारी पाने के लिए RTI आवेदन दर्ज करें।" },
    rights: [
      { title: { en: "Right to Access Information", hi: "सूचना तक पहुंच का अधिकार" }, description: { en: "Every citizen has the right to seek information from any public authority under RTI Act 2005.", hi: "हर नागरिक RTI अधिनियम 2005 के तहत जानकारी मांग सकता है।" } },
      { title: { en: "Right to Response in 30 Days", hi: "30 दिनों में जवाब का अधिकार" }, description: { en: "Government must respond to your RTI within 30 days.", hi: "सरकार को 30 दिनों के भीतर जवाब देना होगा।" } }
    ],
    laws: [{ section: "Section 6", act: "Right to Information Act, 2005", summary: { en: "Procedure for requesting information — written application to PIO with Rs. 10 fee.", hi: "PIO को 10 रुपये शुल्क के साथ लिखित आवेदन।" }, fullText: "A person who desires to obtain any information under this Act shall make a request in writing or through electronic means in English or Hindi or in the official language of the area..." }],
    checklist: [
      { id: "rti1", item: { en: "Clearly stated information request", hi: "स्पष्ट सूचना अनुरोध" }, required: true },
      { id: "rti2", item: { en: "Rs. 10 fee (IPO / DD / Online)", hi: "10 रुपये शुल्क" }, required: true },
      { id: "rti3", item: { en: "Applicant name and address", hi: "आवेदक का नाम और पता" }, required: true },
      { id: "rti4", item: { en: "Name of the Public Authority (Department)", hi: "सार्वजनिक प्राधिकरण का नाम" }, required: true },
      { id: "rti5", item: { en: "BPL certificate (for fee waiver)", hi: "BPL प्रमाण पत्र (शुल्क छूट के लिए)" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Draft Your Application", hi: "आवेदन तैयार करें" }, description: { en: "Write a clear application to the Public Information Officer (PIO) with specific questions.", hi: "PIO को विशिष्ट प्रश्नों के साथ स्पष्ट आवेदन लिखें।" }, tip: { en: "Keep questions specific and factual.", hi: "प्रश्न विशिष्ट और तथ्यात्मक रखें।" } },
      { stepNumber: 2, title: { en: "Submit and Pay Fee", hi: "जमा करें और शुल्क दें" }, description: { en: "Submit by post, in person, or online at rtionline.gov.in. Pay Rs. 10 fee.", hi: "rtionline.gov.in पर ऑनलाइन या डाक से जमा करें।" }, tip: { en: "Online RTI at rtionline.gov.in is fastest.", hi: "ऑनलाइन RTI सबसे तेज है।" } },
      { stepNumber: 3, title: { en: "Track and Follow Up", hi: "ट्रैक करें" }, description: { en: "Await response within 30 days. If unsatisfied, file first appeal.", hi: "30 दिनों का इंतजार करें। असंतुष्ट होने पर पहली अपील दाखिल करें।" }, tip: { en: "Second appeal before Information Commission is also available.", hi: "सूचना आयोग के सामने दूसरी अपील भी उपलब्ध है।" } }
    ],
    templateType: "rti"
  },
  {
    id: "domestic-violence",
    category: "Family",
    icon: "HeartHandshake",
    title: { en: "Domestic Violence", hi: "घरेलू हिंसा" },
    description: { en: "Physical, emotional, or financial abuse by a spouse, partner, or family member.", hi: "पति/पत्नी या परिवार द्वारा शारीरिक, भावनात्मक या वित्तीय दुर्व्यवहार।" },
    rights: [
      { title: { en: "Right to Emergency Protection Order", hi: "आपातकालीन सुरक्षा आदेश का अधिकार" }, description: { en: "A Magistrate can issue an emergency protection order within 24 hours of your complaint.", hi: "मजिस्ट्रेट 24 घंटे के भीतर आपातकालीन सुरक्षा आदेश जारी कर सकता है।" } },
      { title: { en: "Right to Residence", hi: "निवास का अधिकार" }, description: { en: "You cannot be forced to leave your shared household regardless of ownership.", hi: "स्वामित्व चाहे किसी का भी हो, आपको घर छोड़ने के लिए मजबूर नहीं किया जा सकता।" } }
    ],
    laws: [{ section: "Section 12", act: "Protection of Women from Domestic Violence Act, 2005", summary: { en: "Women can file application before Magistrate for protection orders, residence orders, and maintenance.", hi: "महिलाएं सुरक्षा आदेश के लिए मजिस्ट्रेट के सामने आवेदन कर सकती हैं।" }, fullText: "An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act..." }],
    checklist: [
      { id: "dv1", item: { en: "Medical reports of any injuries", hi: "चोटों की चिकित्सा रिपोर्ट" }, required: false },
      { id: "dv2", item: { en: "Photographs of injuries or property damage", hi: "चोटों की तस्वीरें" }, required: false },
      { id: "dv3", item: { en: "Written account of incidents with dates", hi: "तारीखों के साथ घटनाओं का विवरण" }, required: true },
      { id: "dv4", item: { en: "Proof of residence", hi: "निवास का प्रमाण" }, required: true },
      { id: "dv5", item: { en: "Witness contact information", hi: "गवाह की संपर्क जानकारी" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Contact Protection Officer", hi: "संरक्षण अधिकारी से संपर्क करें" }, description: { en: "Contact the Protection Officer (PO) in your district. Call Women Helpline 181 in emergency.", hi: "अपने जिले में संरक्षण अधिकारी से संपर्क करें। आपात में 181 पर कॉल करें।" }, tip: { en: "Call Women Helpline 181 or Police 100 in emergency.", hi: "आपात स्थिति में 181 या 100 पर कॉल करें।" } },
      { stepNumber: 2, title: { en: "File for Protection Order", hi: "सुरक्षा आदेश के लिए आवेदन करें" }, description: { en: "File Form I application before the Magistrate through the Protection Officer.", hi: "संरक्षण अधिकारी के माध्यम से मजिस्ट्रेट के सामने आवेदन दाखिल करें।" }, tip: { en: "Filing is free. No court fee required.", hi: "दाखिल करना निःशुल्क है।" } },
      { stepNumber: 3, title: { en: "Seek Shelter if Needed", hi: "आश्रय लें" }, description: { en: "Government Shelter Homes (Swadhar Greh) provide free temporary housing.", hi: "स्वाधार गृह अस्थायी आवास प्रदान करते हैं।" }, tip: { en: "Shelter Home stay is free and confidential.", hi: "रहना निःशुल्क और गोपनीय है।" } }
    ],
    templateType: "complaint"
  },
  {
    id: "property-dispute",
    category: "Property",
    icon: "Landmark",
    title: { en: "Property Dispute", hi: "संपत्ति विवाद" },
    description: { en: "Disputes over land ownership, inheritance, boundary, or illegal encroachment.", hi: "भूमि स्वामित्व, विरासत, सीमा या अवैध कब्जे पर विवाद।" },
    rights: [
      { title: { en: "Right to Property Documentation", hi: "संपत्ति दस्तावेज़ का अधिकार" }, description: { en: "You have the right to obtain certified copies of land records from the revenue department.", hi: "राजस्व विभाग से भूमि अभिलेखों की प्रमाणित प्रतियां पाने का अधिकार है।" } },
      { title: { en: "Right to Peaceful Possession", hi: "शांतिपूर्ण कब्जे का अधिकार" }, description: { en: "A rightful owner cannot be dispossessed without due process of law.", hi: "कानूनी प्रक्रिया के बिना स्वामी को बेदखल नहीं किया जा सकता।" } }
    ],
    laws: [{ section: "Section 145", act: "Code of Criminal Procedure, 1973", summary: { en: "Police can intervene in land disputes likely to cause breach of peace.", hi: "पुलिस शांति भंग की संभावना वाले संपत्ति विवादों में हस्तक्षेप कर सकती है।" }, fullText: "Whenever an Executive Magistrate is satisfied from a report of a police officer or upon other information that a dispute likely to cause a breach of the peace exists concerning any land or water..." }],
    checklist: [
      { id: "pd1", item: { en: "Title deed / Sale deed", hi: "शीर्षक विलेख / बिक्री विलेख" }, required: true },
      { id: "pd2", item: { en: "Khata / Revenue records (Khasra, Khatauni)", hi: "खाता / राजस्व अभिलेख" }, required: true },
      { id: "pd3", item: { en: "Encumbrance certificate", hi: "भार प्रमाण पत्र" }, required: true },
      { id: "pd4", item: { en: "Property tax receipts", hi: "संपत्ति कर रसीदें" }, required: false },
      { id: "pd5", item: { en: "Survey / measurement reports", hi: "सर्वेक्षण रिपोर्ट" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Verify Land Records", hi: "भूमि अभिलेख सत्यापित करें" }, description: { en: "Obtain certified copies of all land records from district revenue office.", hi: "जिला राजस्व कार्यालय से भूमि अभिलेखों की प्रमाणित प्रतियां प्राप्त करें।" }, tip: { en: "Most states have online land record portals (Bhulekh, Dharani).", hi: "अधिकांश राज्यों में भूलेख पोर्टल हैं।" } },
      { stepNumber: 2, title: { en: "Issue Legal Notice", hi: "कानूनी नोटिस दें" }, description: { en: "Send a legal notice to the encroacher via registered post demanding removal within 15 days.", hi: "अतिक्रमणकर्ता को रजिस्टर्ड डाक से कानूनी नोटिस भेजें।" }, tip: { en: "A lawyer-drafted notice carries more weight.", hi: "वकील द्वारा तैयार नोटिस का अधिक प्रभाव होता है।" } },
      { stepNumber: 3, title: { en: "File Civil Suit", hi: "दीवानी मुकदमा दर्ज करें" }, description: { en: "File a civil suit for declaration of title and permanent injunction in civil court.", hi: "सिविल कोर्ट में स्वामित्व की घोषणा के लिए दीवानी मुकदमा दर्ज करें।" }, tip: { en: "You can seek interim injunction to prevent further encroachment.", hi: "मुकदमे के दौरान अंतरिम निषेधाज्ञा मांग सकते हैं।" } }
    ],
    templateType: "complaint"
  },
  {
    id: "labor-rights",
    category: "Employment",
    icon: "Briefcase",
    title: { en: "Labor Rights / Wage Theft", hi: "श्रमिक अधिकार / वेतन चोरी" },
    description: { en: "Unpaid wages, illegal deductions, denial of PF/ESI, wrongful termination, or unfair working conditions.", hi: "अवैतनिक मजदूरी, अवैध कटौती, PF/ESI से इनकार, गलत बर्खास्तगी।" },
    rights: [
      { title: { en: "Right to Minimum Wage", hi: "न्यूनतम वेतन का अधिकार" }, description: { en: "Every worker is entitled to the minimum wage set by the state government. No employer can pay less.", hi: "प्रत्येक श्रमिक को राज्य सरकार द्वारा निर्धारित न्यूनतम वेतन पाने का अधिकार है।" } },
      { title: { en: "Right to Timely Payment", hi: "समय पर भुगतान का अधिकार" }, description: { en: "Wages must be paid by the 7th of the following month. Delay is a punishable offence.", hi: "वेतन अगले महीने की 7 तारीख तक दिया जाना चाहिए।" } },
      { title: { en: "Right to Provident Fund (PF)", hi: "भविष्य निधि (PF) का अधिकार" }, description: { en: "Employees in establishments with 20+ workers are entitled to PF under EPF Act.", hi: "20+ कर्मचारी वाले प्रतिष्ठानों में कर्मचारी PF के हकदार हैं।" } },
      { title: { en: "Right Against Illegal Deductions", hi: "अवैध कटौती के खिलाफ अधिकार" }, description: { en: "No employer can make deductions from wages except those authorized by law (PF, ESI, TDS).", hi: "नियोक्ता केवल कानूनी कटौतियां ही कर सकता है।" } }
    ],
    laws: [
      { section: "Section 3", act: "Minimum Wages Act, 1948", summary: { en: "Employers must pay not less than the minimum rates fixed by government for scheduled employments.", hi: "नियोक्ता को निर्धारित न्यूनतम दरों से कम वेतन नहीं देना चाहिए।" }, fullText: "The appropriate Government shall fix the minimum rates of wages payable to employees employed in a scheduled employment... No employer shall pay to any employee wages at a rate less than the minimum rate of wages fixed by the Government." },
      { section: "Section 5", act: "Payment of Wages Act, 1936", summary: { en: "All wages must be paid before the 7th of every month. Employers cannot delay or deny wages arbitrarily.", hi: "सभी वेतन हर महीने की 7 तारीख से पहले देना अनिवार्य है।" }, fullText: "The wages of every person employed in a factory or establishment shall be paid before the expiry of the seventh day of the following wage period..." },
      { section: "Section 6", act: "Employees' Provident Fund Act, 1952", summary: { en: "Both employee and employer must contribute 12% of basic salary to the PF fund each month.", hi: "कर्मचारी और नियोक्ता दोनों को मूल वेतन का 12% PF में जमा करना होगा।" }, fullText: "Subject to the provisions of this Act, the Central Government may, by notification in the Official Gazette, frame a Scheme to be called the Employees' Provident Fund Scheme..." }
    ],
    checklist: [
      { id: "lr1", item: { en: "Appointment letter / Offer letter", hi: "नियुक्ति पत्र / ऑफर लेटर" }, required: true },
      { id: "lr2", item: { en: "Salary slips for the period of dispute", hi: "विवाद की अवधि की वेतन पर्चियां" }, required: true },
      { id: "lr3", item: { en: "Bank statements showing salary credits", hi: "बैंक विवरण जिसमें वेतन क्रेडिट दिखे" }, required: true },
      { id: "lr4", item: { en: "PF account statement (EPFO UAN portal)", hi: "PF खाता विवरण (EPFO UAN पोर्टल)" }, required: false },
      { id: "lr5", item: { en: "Written communication about wage dispute", hi: "वेतन विवाद के बारे में लिखित पत्राचार" }, required: false },
      { id: "lr6", item: { en: "Attendance records / proof of work done", hi: "उपस्थिति रिकॉर्ड / कार्य का प्रमाण" }, required: true },
      { id: "lr7", item: { en: "Termination letter (if employment ended)", hi: "बर्खास्तगी पत्र (यदि नौकरी समाप्त हो गई)" }, required: false }
    ],
    steps: [
      { stepNumber: 1, title: { en: "Calculate Dues and Document", hi: "बकाया की गणना करें" }, description: { en: "Calculate the exact amount of unpaid wages, illegal deductions, or PF dues. Make a written record.", hi: "अवैतनिक मजदूरी की सटीक राशि की गणना करें।" }, tip: { en: "Keep copies of all payslips and bank statements as primary evidence.", hi: "प्राथमिक साक्ष्य के रूप में सभी वेतन पर्चियों की प्रति रखें।" } },
      { stepNumber: 2, title: { en: "Send Written Demand to Employer", hi: "नियोक्ता को लिखित मांग भेजें" }, description: { en: "Send a written demand notice to your employer via registered post, stating the amount due.", hi: "नियोक्ता को रजिस्टर्ड डाक से लिखित मांग नोटिस भेजें।" }, tip: { en: "Always keep the postal receipt as proof.", hi: "डाक रसीद हमेशा रखें।" } },
      { stepNumber: 3, title: { en: "File Complaint with Labour Inspector", hi: "श्रम निरीक्षक को शिकायत दर्ज करें" }, description: { en: "Visit your district Labour Office and file a complaint with the Labour Inspector.", hi: "जिला श्रम कार्यालय में जाएं और श्रम निरीक्षक को शिकायत दर्ज करें।" }, tip: { en: "Labour Inspector has powers to examine records and penalize employers.", hi: "श्रम निरीक्षक के पास रिकॉर्ड जांचने का अधिकार है।" } },
      { stepNumber: 4, title: { en: "Approach Labour Court", hi: "श्रम न्यायालय जाएं" }, description: { en: "If Labour Inspector fails to resolve, file a claim before the Labour Court for recovery of wages.", hi: "यदि समाधान न हो तो श्रम न्यायालय में दावा दर्ज करें।" }, tip: { en: "Free legal aid is available through State Legal Services Authority.", hi: "राज्य विधिक सेवा प्राधिकरण के माध्यम से मुफ्त सहायता उपलब्ध है।" } },
      { stepNumber: 5, title: { en: "File EPF Grievance Online", hi: "EPF शिकायत ऑनलाइन दर्ज करें" }, description: { en: "For PF issues, file grievance at epfigms.gov.in or call EPFO toll-free 1800-118-005.", hi: "PF से संबंधित शिकायतों के लिए epfigms.gov.in पर जाएं।" }, tip: { en: "EPFO can directly penalize employers under Section 14B EPF Act.", hi: "EPFO EPF अधिनियम के तहत नियोक्ताओं को दंड दे सकता है।" } }
    ],
    templateType: "labor"
  }
];

module.exports = situations;
