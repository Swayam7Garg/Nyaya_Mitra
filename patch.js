const fs = require('fs');
const path = require('path');

const updates = {
  "landlord-dispute": {
    laws: [
      {
        section: "Constitutional Rights",
        act: "Constitution of India",
        summary: {
           en: "Rights to life, shelter, equality, and property.",
           hi: "जीवन, आश्रय, समानता और संपत्ति का अधिकार।"
        },
        fullText: "Article 21 - Right to life and shelter\nArticle 14 - Equality before law\nArticle 19(1)(d) - Right to reside\nArticle 300A - Right to property"
      }
    ],
    rights: [
      {
        title: { en: "Tenant Rights", hi: "किरायेदार के अधिकार" },
        description: { 
           en: "Protection from illegal eviction. Right to electricity and water. Privacy. Security deposit refund.",
           hi: "अवैध बेदखली से सुरक्षा। बिजली और पानी का अधिकार। निजता। सुरक्षा जमा वापसी।"
        }
      },
      {
        title: { en: "Legal Remedies", hi: "कानूनी उपाय" },
        description: {
           en: "Rent Control Court, Civil Court, Police complaint in case of threats, Legal notice.",
           hi: "किराया नियंत्रण न्यायालय, व्यवहार न्यायालय, धमकी के मामले में पुलिस शिकायत, कानूनी नोटिस।"
        }
      }
    ]
  },
  "consumer-complaint": {
    laws: [
      {
        section: "Rules & Scope",
        act: "Consumer Protection Act, 2019",
        summary: {
          en: "Procedure: A complaint may be filed with the Consumer Disputes Redressal Commission within jurisdiction, electronically or in person, accompanied by requisite fee.",
          hi: "प्रक्रिया: एक शिकायत उपभोक्ता विवाद निवारण आयोग में दायर की जा सकती है।"
        },
        fullText: "Scope: Covers goods and services, e-commerce, direct selling, unfair contract, unsafe products and deficiency in services."
      }
    ],
    rights: [
      { title: { en: "Right to Safety", hi: "सुरक्षा का अधिकार" }, description: { en: "Protection against goods or services that are hazardous to life, health, or property.", hi: "जीवन, स्वास्थ्य या संपत्ति के लिए खतरनाक वस्तुओं या सेवाओं के खिलाफ सुरक्षा।" } },
      { title: { en: "Right to be Informed", hi: "सूचित होने का अधिकार" }, description: { en: "Complete, truthful information about quality, quantity, price, standard, warranty, expiry, risks, terms & conditions.", hi: "गुणवत्ता, मात्रा, कीमत, मानक, वारंटी आदि के बारे में पूर्ण जानकारी।" } },
      { title: { en: "Right to Choose", hi: "चुनने का अधिकार" }, description: { en: "Free choice of products/services at fair prices without coercion.", hi: "बिना किसी दबाव के उचित मूल्य पर उत्पादों/सेवाओं का स्वतंत्र विकल्प।" } },
      { title: { en: "Right to be Heard", hi: "सुने जाने का अधिकार" }, description: { en: "Consumers’ interests must be considered at appropriate forums and disputes may be heard by Consumer Disputes Redressal Commissions.", hi: "उपभोक्ताओं के हितों पर विचार किया जाना चाहिए।" } },
      { title: { en: "Right to Seek Redressal", hi: "निवारण मांगने का अधिकार" }, description: { en: "Consumers can seek compensation, refund, replacement, repair or corrective action for defective goods, service deficiency.", hi: "उपभोक्ता मुआवजे, धनवापसी, प्रतिस्थापन, मरम्मत या सुधारात्मक कार्रवाई की मांग कर सकते हैं।" } },
      { title: { en: "Right to Consumer Awareness", hi: "उपभोक्ता जागरूकता का अधिकार" }, description: { en: "Authorities must promote awareness of consumer rights and legal remedies.", hi: "अधिकारियों को उपभोक्ता अधिकारों और कानूनी उपचारों के बारे में जागरूकता को बढ़ावा देना चाहिए।" } }
    ]
  },
  "workplace-harassment": {
    laws: [
      {
        section: "Mandatory Requirement",
        act: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act)",
        summary: {
          en: "Every employer with 10 or more employees must constitute an Internal Complaints Committee (ICC).",
          hi: "10 या अधिक कर्मचारियों वाले प्रत्येक नियोक्ता को आंतरिक शिकायत समिति (ICC) का गठन करना होगा।"
        },
        fullText: "Every worker has the right to a safe, dignified, harassment-free workplace under Articles 14, 15 & 21 of the Constitution. Sexual harassment includes physical contact, unwelcome advances, sexually coloured remarks, intimidation, threats, hostile work environment."
      }
    ],
    rights: [
      { title: { en: "Complaint Timeline & Procedure", hi: "शिकायत समय-सीमा और प्रक्रिया" }, description: { en: "A complaint can be filed to the ICC within 90 days of the last incident.", hi: "अंतिम घटना के 90 दिनों के भीतर शिकायत दर्ज की जा सकती है।" } },
      { title: { en: "ICC Inquiry", hi: "ICC जांच" }, description: { en: "The ICC must conduct a confidential inquiry and complete it within 90 days, with interim relief where warranted.", hi: "ICC को गोपनीय जांच करनी चाहिए और 90 दिनों के भीतर पूरी करनी चाहिए।" } },
      { title: { en: "Criminal Charges", hi: "आपराधिक आरोप" }, description: { en: "Victims may also pursue criminal charges (e.g., under IPC sections like 354A) and file an FIR in addition to ICC complaint.", hi: "पीड़ित ICC शिकायत के अतिरिक्त FIR भी दर्ज करा सकते हैं।" } }
    ]
  },
  "fir-filing": {
    laws: [
      {
        section: "Section 154",
        act: "Code of Criminal Procedure (CrPC)",
        summary: {
          en: "Every citizen has the right to file a First Information Report (FIR) with the police for any cognizable offence (e.g., theft, assault, fraud, kidnapping, violence).",
          hi: "प्रत्येक नागरिक को किसी भी संज्ञेय अपराध के लिए पुलिस में प्रथम सूचना रिपोर्ट (FIR) दर्ज करने का अधिकार है।"
        },
        fullText: "Police must record FIR for information regarding a cognizable offence. Police must register FIR if the complaint discloses a cognizable offence and not refuse on non-legal grounds. After FIR registration, police must investigate; refusal or delay can be challenged via High Court writ. An FIR filed becomes a public record of the criminal complaint and starts investigation."
      }
    ],
    rights: [
      { title: { en: "Right to File FIR", hi: "FIR दर्ज करने का अधिकार" }, description: { en: "Every citizen has the right to file a First Information Report (FIR) with the police for any cognizable offence.", hi: "प्रत्येक नागरिक को संज्ञेय अपराध के लिए FIR दर्ज करने का अधिकार है।" } },
      { title: { en: "Obligations of Police", hi: "पुलिस के दायित्व" }, description: { en: "Police must record FIR for information regarding a cognizable offence.", hi: "पुलिस को संज्ञेय अपराध के संबंध में FIR दर्ज करनी चाहिए।" } }
    ]
  },
  "rti-application": {
    laws: [
      {
        section: "Section 3 & 6",
        act: "Right to Information Act, 2005 (RTI Act)",
        summary: {
          en: "Every citizen has the right to access information held by public authorities to promote transparency and accountability.",
          hi: "प्रत्येक नागरिक को सार्वजनिक प्राधिकरणों द्वारा रखी गई जानकारी तक पहुंचने का अधिकार है।"
        },
        fullText: "Section 3 – Right to information. Section 6 – Right to file RTI application to the Public Information Officer (PIO). Scope: Government records, police records, enquiry reports, action taken, expenditure, orders and policy documents."
      }
    ],
    rights: [
      { title: { en: "Procedure", hi: "प्रक्रिया" }, description: { en: "File RTI to the PIO with details of information sought.", hi: "PIO के पास RTI दाखिल करें।" } },
      { title: { en: "Response Time", hi: "प्रतिक्रिया समय" }, description: { en: "Public authority must respond within 30 days (or 48 hours if life/death involved).", hi: "सार्वजनिक प्राधिकरण को 30 दिनों के भीतर जवाब देना चाहिए।" } },
      { title: { en: "Appeals", hi: "अपील" }, description: { en: "If denied, file First Appeal then Second Appeal to Central/State Information Commission.", hi: "इनकार किए जाने पर, केंद्रीय/राज्य सूचना आयोग में अपील दाखिल करें।" } }
    ]
  },
  "domestic-violence": {
    laws: [
      {
        section: "Section 3 & 12",
        act: "Protection of Women from Domestic Violence Act, 2005 (PWDVA)",
        summary: {
          en: "Women have the right to protection from physical, emotional, verbal, sexual, and economic abuse by family or intimate partners.",
          hi: "महिलाओं को परिवार या अंतरंग भागीदारों द्वारा शारीरिक, भावनात्मक, मौखिक, यौन और आर्थिक शोषण से सुरक्षा का अधिकार है।"
        },
        fullText: "Section 3 – Definition of domestic violence including physical, sexual, verbal, emotional, economic abuse. Section 12 – Right to apply for Protection Order, Residence Order, Monetary Relief, Custody Order and Compensation Order."
      }
    ],
    rights: [
      { title: { en: "Protection against Abuse", hi: "दुर्व्यवहार के खिलाफ सुरक्षा" }, description: { en: "Women have the right to protection from physical, emotional, verbal, sexual, and economic abuse.", hi: "महिलाओं को शारीरिक, भावनात्मक, मौखिक, यौन और आर्थिक शोषण से सुरक्षा का अधिकार है।" } },
      { title: { en: "Procedure", hi: "प्रक्रिया" }, description: { en: "Complaint may be filed to Protection Officer / Judicial Magistrate. Magistrate may grant interim protection, residency rights, monetary compensation and counseling. Police assistance can be sought to enforce orders.", hi: "संरक्षण अधिकारी / न्यायिक मजिस्ट्रेट को शिकायत दर्ज की जा सकती है।" } }
    ]
  },
  "property-dispute": {
    laws: [
      {
        section: "Transfer & Registration",
        act: "Transfer of Property Act, 1882; Indian Succession Act; Registration Act, 1908; Limitation Act",
        summary: {
          en: "A citizen has the right to own, use, transfer and enjoy property as per contract and law.",
          hi: "एक नागरिक को संपत्ति के स्वामित्व, उपयोग, और हस्तांतरण का अधिकार है।"
        },
        fullText: "Transfer of Property Act governs sale, mortgage, lease, gift, exchange of property. Title must be clear — disputes often arise due to forgery, bogus chain of title, boundary issues, adverse possession, co-ownership disagreements. Property must be registered under the Registration Act to be enforceable."
      }
    ],
    rights: [
      { title: { en: "Right to Property", hi: "संपत्ति का अधिकार" }, description: { en: "A citizen has the right to own, use, transfer and enjoy property as per contract and law.", hi: "नागरिक को संपत्ति का अधिकार है।" } },
      { title: { en: "Registered Documents", hi: "पंजीकृत दस्तावेज" }, description: { en: "Registered documents are prima facie evidence of the transaction.", hi: "पंजीकृत दस्तावेज लेनदेन के मुख्य साक्ष्य हैं।" } },
      { title: { en: "Civil Court Jurisdiction", hi: "दीवानी न्यायालय क्षेत्राधिकार" }, description: { en: "Civil Courts have jurisdiction to adjudicate property suits; limitation periods apply for filing claims.", hi: "दीवानी न्यायालयों को संपत्ति विवादों का फैसला करने का अधिकार है।" } }
    ]
  },
  "labor-rights": {
    laws: [
      {
        section: "Key Rights & Laws",
        act: "Industrial Disputes Act, Minimum Wages Act, Payment of Wages Act, Employees' Provident Funds Act, Workmen's Compensation Act, Shops & Establishments Acts",
        summary: {
          en: "Right to fair wages, timely payment, social security, compensation, and against unfair labour practices.",
          hi: "उचित वेतन, समय पर भुगतान, सामाजिक सुरक्षा, और अनुचित श्रम प्रथाओं के खिलाफ अधिकार।"
        },
        fullText: "Right to fair wages – No employer can pay less than the minimum wages fixed by government. Right to timely payment – Wages must be paid on time without unauthorized deductions. Right to social security – Employees are entitled to provident fund, pension, insurance where applicable. Right against unfair labour practices – Protection against discrimination, unfair termination, harassment, forced labour. Right to compensation – Workmen injured during employment are entitled to compensation."
      }
    ],
    rights: [
      { title: { en: "Dispute Resolution", hi: "विवाद समाधान" }, description: { en: "Labour issues can be taken before Labour Courts, Industrial Tribunals, District Forums or appropriate statutory bodies.", hi: "श्रम मुद्दों को श्रम न्यायालयों, औद्योगिक न्यायाधिकरणों आदि के समक्ष ले जाया जा सकता है।" } }
    ]
  }
};

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let firstBracket = content.indexOf('[');
  let lastBracket = content.lastIndexOf(']');
  let arrayStr = content.substring(firstBracket, lastBracket + 1);
  
  let parsedArray;
  try {
    parsedArray = eval(arrayStr);
  } catch(e) { 
    console.error("Eval failed", filePath); 
    return; 
  }

  for (let sit of parsedArray) {
    const patchData = updates[sit.id];
    if (patchData) {
      sit.laws = patchData.laws;
      sit.rights = patchData.rights;
    }
  }

  const updatedArrayStr = JSON.stringify(parsedArray, null, 2);
  const newContent = content.substring(0, firstBracket) + updatedArrayStr + content.substring(lastBracket + 1);

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("Patched:", filePath);
}

patchFile(path.join(__dirname, 'frontend/data/situations.ts'));
patchFile(path.join(__dirname, 'backend/src/data/situations.js'));
