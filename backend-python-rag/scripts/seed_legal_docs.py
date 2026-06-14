"""
scripts/seed_legal_docs.py
--------------------------
Seeds the Supabase PostgreSQL pgvector database with essential
Indian legal documents, filing guides, templates, and fundamental rights.
Processes embeddings in batch and inserts them in a single database transaction.

Run from backend-python-rag:
    PYTHONPATH=. python scripts/seed_legal_docs.py
"""

import os
import sys
from dotenv import load_dotenv
from google import genai
import psycopg2
from psycopg2.extras import Json, execute_values

# Load environment variables
load_dotenv()

# Verify variables
db_url = os.getenv("SUPABASE_DB_URL")
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

if db_url:
    db_url = db_url.strip()
if api_key:
    api_key = api_key.strip()

if not db_url:
    print("[ERROR] SUPABASE_DB_URL is not set in environment.")
    sys.exit(1)
if not api_key:
    print("[ERROR] GOOGLE_API_KEY or GEMINI_API_KEY is not set.")
    sys.exit(1)

# Initialize Gemini Client
client = genai.Client(api_key=api_key)

# ── 1. COMPILE INDIAN LEGAL CORPUS CHUNKS ─────────────────────────────────────
legal_chunks = [
    {
        "category": "rti",
        "title": "RTI (Right to Information) Act 2005 Filing Guide",
        "text": (
            "Filing an RTI (Right to Information) Application in India.\n\n"
            "Under Section 6(1) of the RTI Act, 2005, any citizen can request information from a Public Information Officer (PIO) "
            "of a public authority. The application can be submitted in writing or through electronic means in English, Hindi, or "
            "the official language of the area.\n\n"
            "Application Fee: The standard fee is Rs. 10 (exempted for Below Poverty Line applicants with BPL certificate).\n\n"
            "Response Timeframe:\n"
            "- Standard request: The PIO must respond within 30 days.\n"
            "- Life or Liberty request: If the information concerns the life or liberty of a person, the response must be given within 48 hours.\n\n"
            "Appeals:\n"
            "- First Appeal (Section 19(1)): If no response is received or if the response is unsatisfactory, you can file a First Appeal "
            "within 30 days to the First Appellate Authority (FAA) who is senior in rank to the PIO. The FAA must decide within 30 to 45 days.\n"
            "- Second Appeal (Section 19(3)): If the first appeal is rejected, a Second Appeal can be filed within 90 days to the "
            "State Information Commission (SIC) or Central Information Commission (CIC).\n\n"
            "--- Hindi Version ---\n"
            "भारत में आरटीआई (सूचना का अधिकार) आवेदन दाखिल करना।\n\n"
            "आरटीआई अधिनियम, 2005 की धारा 6(1) के तहत, कोई भी नागरिक किसी सार्वजनिक प्राधिकरण के लोक सूचना अधिकारी (PIO) से "
            "जानकारी का अनुरोध कर सकता है। आवेदन लिखित रूप में या इलेक्ट्रॉनिक माध्यमों से अंग्रेजी, हिंदी या क्षेत्र की आधिकारिक भाषा में जमा किया जा सकता है।\n\n"
            "आवेदन शुल्क: मानक शुल्क 10 रुपये है (गरीबी रेखा से नीचे के आवेदकों के लिए बीपीएल प्रमाण पत्र के साथ शुल्क माफ है)।\n\n"
            "प्रतिक्रिया की समय-सीमा:\n"
            "- मानक अनुरोध: पीआईओ को 30 दिनों के भीतर जवाब देना होगा।\n"
            "- जीवन या स्वतंत्रता अनुरोध: यदि जानकारी किसी व्यक्ति के जीवन या स्वतंत्रता से संबंधित है, तो 48 घंटों के भीतर जवाब दिया जाना चाहिए।\n\n"
            "अपील:\n"
            "- प्रथम अपील (धारा 19(1)): यदि कोई प्रतिक्रिया प्राप्त नहीं होती है या प्रतिक्रिया असंतोषजनक है, तो आप 30 दिनों के भीतर "
            "प्रथम अपीलीय प्राधिकारी (FAA) के पास प्रथम अपील दायर कर सकते हैं। एफएए को 30 से 45 दिनों के भीतर निर्णय लेना होगा।\n"
            "- द्वितीय अपील (धारा 19(3)): यदि पहली अपील खारिज कर दी जाती है, तो राज्य सूचना आयोग (SIC) या केंद्रीय सूचना आयोग (CIC) में "
            "90 दिनों के भीतर द्वितीय अपील दायर की जा सकती है।"
        )
    },
    {
        "category": "fir",
        "title": "FIR (First Information Report) Filing Guide & Rights",
        "text": (
            "Filing a First Information Report (FIR) under Section 154 of the Criminal Procedure Code (CrPC).\n\n"
            "An FIR is the earliest report registered by the police for cognizable offenses (serious crimes where police can arrest without a warrant, "
            "such as theft, assault, kidnapping, rape, and murder). Non-cognizable offenses (minor offenses) are entered in the NCR (Non-Cognizable Report) "
            "and require a magistrate's order for investigation.\n\n"
            "Key Rights of the Litigant:\n"
            "- Free Copy (Section 154(2) CrPC): The informant has a legal right to get a copy of the FIR free of cost immediately.\n"
            "- Zero FIR: An FIR can be filed at ANY police station, regardless of the jurisdiction where the crime took place. The police "
            "must register it as a 'Zero FIR' and subsequently transfer it to the police station having appropriate jurisdiction.\n\n"
            "Refusal to Register an FIR:\n"
            "- If a police officer refuses to register your FIR, you can write down the complaint and send it by Registered Post to the "
            "Superintendent of Police (SP) under Section 154(3) CrPC. If satisfied that a cognizable offense occurred, the SP will investigate or direct an investigation.\n"
            "- You can also file a private criminal complaint directly before the Judicial Magistrate under Section 200 CrPC, who can then "
            "order the police to register and investigate the case under Section 156(3) CrPC.\n\n"
            "--- Hindi Version ---\n"
            "दंड प्रक्रिया संहिता (CrPC) की धारा 154 के तहत प्रथम सूचना रिपोर्ट (FIR) दर्ज करना।\n\n"
            "प्राथमिकी (FIR) संज्ञेय अपराधों (गंभीर अपराध जहां पुलिस बिना वारंट के गिरफ्तार कर सकती है, जैसे चोरी, मारपीट, अपहरण, बलात्कार और हत्या) के लिए "
            "पुलिस द्वारा दर्ज की जाने वाली सबसे पहली रिपोर्ट है। गैर-संज्ञेय अपराधों (छोटे अपराधों) को एनसीआर (गैर-संज्ञेय रिपोर्ट) में दर्ज किया जाता है और जांच के लिए मजिस्ट्रेट के आदेश की आवश्यकता होती है।\n\n"
            "नागरिक के प्रमुख अधिकार:\n"
            "- मुफ्त प्रति (CrPC की धारा 154(2)): शिकायतकर्ता को प्राथमिकी की एक प्रति तुरंत मुफ्त पाने का कानूनी अधिकार है।\n"
            "- जीरो एफआईआर: अपराध किस भी अधिकार क्षेत्र में हुआ हो, एफआईआर किसी भी पुलिस स्टेशन में दर्ज की जा सकती है। पुलिस को इसे 'जीरो एफआईआर' "
            "के रूप में दर्ज करना होगा और बाद में उचित अधिकार क्षेत्र वाले पुलिस स्टेशन को स्थानांतरित करना होगा।\n\n"
            "एफआईआर दर्ज करने से इनकार करने पर:\n"
            "- यदि कोई पुलिस अधिकारी आपकी एफआईआर दर्ज करने से इनकार करता है, तो आप शिकायत लिख सकते हैं और इसे CrPC की धारा 154(3) के तहत "
            "पंजीकृत डाक द्वारा पुलिस अधीक्षक (SP) को भेज सकते हैं।\n"
            "- आप सीधे न्यायिक मजिस्ट्रेट के समक्ष CrPC की धारा 200 के तहत एक निजी शिकायत भी दर्ज कर सकते हैं, जो पुलिस को धारा 156(3) के तहत मामला दर्ज करने और जांच करने का आदेश दे सकती है।"
        )
    },
    {
        "category": "consumer",
        "title": "Consumer Protection Act 2019 Complaint Procedure",
        "text": (
            "Filing a Consumer Complaint under the Consumer Protection Act, 2019.\n\n"
            "A consumer can file a complaint against defective goods, deficient services, overcharging, misleading advertisements, "
            "or unfair trade practices (such as refusal to issue receipts or refusal to take back defective items).\n\n"
            "Pecuniary Jurisdiction (Where to file):\n"
            "- District Consumer Disputes Redressal Commission: Complaints where the value of goods/services paid does not exceed Rs. 50 Lakhs.\n"
            "- State Consumer Disputes Redressal Commission: Complaints where the value is between Rs. 50 Lakhs and Rs. 2 Crores.\n"
            "- National Consumer Disputes Redressal Commission: Complaints where the value exceeds Rs. 2 Crores.\n\n"
            "Filing Procedure:\n"
            "- Online Filing: Complaints can be filed digitally through the e-Daakhil portal (edaakhil.nic.in) without visiting the commission.\n"
            "- Written Notice: It is highly recommended to send a formal written notice to the seller or service provider by registered post, "
            "giving them 15 days to resolve the issue before filing a formal complaint.\n"
            "- Limitation Period: A complaint must be filed within 2 years from the date on which the cause of action arose (e.g. date of purchase or service failure).\n\n"
            "--- Hindi Version ---\n"
            "उपभोक्ता संरक्षण अधिनियम, 2019 के तहत उपभोक्ता शिकायत दर्ज करना।\n\n"
            "एक उपभोक्ता दोषपूर्ण वस्तुओं, सेवाओं में कमी, अधिक मूल्य वसूलने, भ्रामक विज्ञापनों या अनुचित व्यापार प्रथाओं के खिलाफ शिकायत दर्ज कर सकता है।\n\n"
            "आर्थिक अधिकार क्षेत्र (कहां शिकायत दर्ज करें):\n"
            "- जिला उपभोक्ता विवाद निवारण आयोग: शिकायतें जहां भुगतान की गई वस्तुओं/सेवाओं का मूल्य 50 लाख रुपये से अधिक नहीं है।\n"
            "- राज्य उपभोक्ता विवाद निवारण आयोग: शिकायतें जहां मूल्य 50 लाख रुपये से 2 करोड़ रुपये के बीच है।\n"
            "- राष्ट्रीय उपभोक्ता विवाद निवारण आयोग: शिकायतें जहां मूल्य 2 करोड़ रुपये से अधिक है।\n\n"
            "दाखिल करने की प्रक्रिया:\n"
            "- ऑनलाइन फाइलिंग: आयोग का दौरा किए बिना ई-दाखिल पोर्टल (edaakhil.nic.in) के माध्यम से शिकायतें डिजिटल रूप से दर्ज की जा सकती हैं।\n"
            "- लिखित नोटिस: विक्रेता को पंजीकृत डाक द्वारा एक औपचारिक लिखित नोटिस भेजने की सलाह दी जाती है, जिसमें शिकायत दर्ज करने से पहले उन्हें विवाद को सुलझाने के लिए 15 दिन का समय दिया जाए।\n"
            "- सीमा अवधि: शिकायत उस तारीख से 2 वर्ष के भीतर दर्ज की जानी चाहिए जिस दिन विवाद का कारण उत्पन्न हुआ था (जैसे खरीद की तारीख)।"
        )
    },
    {
        "category": "civil",
        "title": "Tenant Rights & Security Deposit Recovery Guide",
        "text": (
            "Tenant Rights and Eviction Protections under the Transfer of Property Act, 1882 and State Rent Control Laws.\n\n"
            "Tenants in India have key statutory protections against arbitrary landlord actions.\n\n"
            "Eviction Notice Requirements:\n"
            "- Under Section 106 of the Transfer of Property Act, a landlord must provide at least 15 days' notice in writing to terminate a monthly tenancy. "
            "If the lease is yearly, a 6-month notice is mandatory.\n"
            "- Landlords cannot forcefully evict a tenant or cut off utility services (water, electricity) without a court order. Doing so "
            "is illegal and can be challenged in the Rent Control Court/Small Causes Court immediately.\n\n"
            "Security Deposit Disputes:\n"
            "- The landlord is legally bound to refund the security deposit upon the tenant vacating the premises. "
            "Deductions can only be made for actual damages caused to the property. Landlords cannot deduct money for 'normal wear and tear' "
            "(such as minor wall scuffs, regular painting, or aging fixtures).\n"
            "- If the landlord wrongfully retains the security deposit, the tenant should first send a formal Legal Notice demanding refund within 15 days. "
            "If unpaid, the tenant can file a civil suit for recovery under Order 37 of the Civil Procedure Code (CPC) in the local civil court.\n\n"
            "--- Hindi Version ---\n"
            "संपत्ति हस्तांतरण अधिनियम, 1882 और राज्य किराया नियंत्रण कानूनों के तहत किरायेदार के अधिकार और बेदखली से सुरक्षा।\n\n"
            "भारत में किरायेदारों को मकान मालिक की मनमानी कार्रवाइयों के खिलाफ प्रमुख वैधानिक सुरक्षा प्राप्त है।\n\n"
            "बेदखली नोटिस आवश्यकताएं:\n"
            "- संपत्ति हस्तांतरण अधिनियम की धारा 106 के तहत, मकान मालिक को किरायेदारी समाप्त करने के लिए लिखित में कम से कम 15 दिनों का नोटिस देना होगा। वार्षिक लीज के मामले में, 6 महीने का नोटिस अनिवार्य है।\n"
            "- मकान मालिक कोर्ट के आदेश के बिना किरायेदार को जबरन बेदखल नहीं कर सकता या बिजली-पानी जैसी बुनियादी सुविधाएं बंद नहीं कर सकता। ऐसा करना अवैध है और इसे किराया नियंत्रण अदालत में चुनौती दी जा सकती है।\n\n"
            "सुरक्षा जमा (Security Deposit) विवाद:\n"
            "- किरायेदार द्वारा परिसर खाली करने पर सुरक्षा जमा वापस करने के लिए मकान मालिक कानूनी रूप से बाध्य है। कटौती केवल संपत्ति को हुए वास्तविक नुकसान के लिए की जा सकती है। मकान मालिक सामान्य टूट-फूट के लिए पैसे नहीं काट सकते।\n"
            "- यदि मकान मालिक सुरक्षा जमा वापस नहीं करता है, तो किरायेदार को पहले 15 दिनों के भीतर रिफंड की मांग करते हुए एक कानूनी नोटिस भेजना चाहिए। भुगतान न होने पर, किरायेदार स्थानीय सिविल कोर्ट में वसूली के लिए सिविल मुकदमा दायर कर सकता है।"
        )
    },
    {
        "category": "criminal",
        "title": "Rights of an Arrested Person & Police Rules",
        "text": (
            "Fundamental Rights and Legal Protections for Arrested Persons under the Constitution of India and Code of Criminal Procedure (CrPC).\n\n"
            "If you or someone you know is arrested by the police, you possess clear rights under the law:\n\n"
            "1. Right to know grounds of arrest (Article 22(1) Constitution & Sec 50 CrPC): The police must immediately inform the arrested person of the exact offence "
            "and reason for arrest.\n"
            "2. Right to consult a Lawyer (Article 22(1)): The arrested person has the right to consult and be defended by a legal practitioner of their choice. Under Section 41D CrPC, "
            "the arrested person can meet their advocate during interrogation.\n"
            "3. Production before Magistrate within 24 Hours (Article 22(2) & Sec 57 CrPC): The police must produce the arrested person before the nearest Judicial Magistrate "
            "within 24 hours of arrest (excluding travel time). Detention beyond 24 hours without magistrate approval is illegal detention.\n"
            "4. Right of Female Arrested Persons (Sec 46(4) CrPC): Females cannot be arrested after sunset and before sunrise except in extraordinary circumstances and only by a "
            "female police officer with prior permission of a Judicial Magistrate. Females must only be searched by a female officer with strict decency.\n"
            "5. D.K. Basu Guidelines: Arresting officers must wear clear identification tags showing their name and designation. A memo of arrest must be prepared, witnessed by "
            "at least one family member or respectable citizen, and signed by the arrested person.\n\n"
            "--- Hindi Version ---\n"
            "भारत के संविधान और आपराधिक प्रक्रिया संहिता (CrPC) के तहत गिरफ्तार व्यक्ति के मौलिक अधिकार और कानूनी सुरक्षा।\n\n"
            "यदि आपको या आपके किसी परिचित को पुलिस द्वारा गिरफ्तार किया जाता है, तो आपके पास कानून के तहत स्पष्ट अधिकार हैं:\n\n"
            "1. गिरफ्तारी के कारणों को जानने का अधिकार (अनुच्छेद 22(1) और धारा 50 CrPC): पुलिस को गिरफ्तार व्यक्ति को तुरंत अपराध और गिरफ्तारी का कारण बताना होगा।\n"
            "2. वकील से परामर्श करने का अधिकार (अनुच्छेद 22(1)): गिरफ्तार व्यक्ति को अपनी पसंद के वकील से परामर्श करने और बचाव करने का अधिकार है। धारा 41D CrPC के तहत पूछताछ के दौरान वह अपने वकील से मिल सकता है।\n"
            "3. 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश होने का अधिकार (अनुच्छेद 22(2) और धारा 57 CrPC): पुलिस को गिरफ्तारी के 24 घंटे के भीतर (यात्रा के समय को छोड़कर) गिरफ्तार व्यक्ति को निकटतम मजिस्ट्रेट के सामने पेश करना होगा।\n"
            "4. महिलाओं की गिरफ्तारी के नियम (धारा 46(4) CrPC): असाधारण परिस्थितियों को छोड़कर महिलाओं को सूर्यास्त के बाद और सूर्योदय से पहले गिरफ्तार नहीं किया जा सकता है। महिलाओं की तलाशी केवल महिला पुलिस अधिकारी द्वारा ही ली जाएगी।\n"
            "5. डी.के. बसु दिशानिर्देश: गिरफ्तार करने वाले अधिकारियों के पास उनके नाम और पदनाम को दर्शाने वाले स्पष्ट पहचान पत्र होने चाहिए। एक गिरफ्तारी मेमो तैयार किया जाना चाहिए, जिस पर परिवार के सदस्य के हस्ताक्षर हों।"
        )
    },
    {
        "category": "civil",
        "title": "Domestic Violence Act 2005 Protection Guide",
        "text": (
            "Legal Protections under the Protection of Women from Domestic Violence Act (PWDVA), 2005.\n\n"
            "The PWDVA protects women (wives, live-in partners, mothers, sisters) from physical, emotional, sexual, and economic abuse "
            "by male partners or relatives in a shared household.\n\n"
            "Key Reliefs Available under the Act:\n"
            "- Protection Orders (Section 18): The Magistrate can issue orders restraining the respondent from committing any act of domestic violence, "
            "entering the victim's workplace, or contacting her.\n"
            "- Residence Orders (Section 19): The woman cannot be evicted from the shared household, regardless of whether she has any legal share or title in the house. "
            "The court can order the respondent to find alternative accommodation for her.\n"
            "- Monetary Relief (Section 20): The victim can claim medical expenses, loss of earnings, and monthly maintenance for herself and her children.\n"
            "- Custody Orders (Section 21): Temporary custody of children can be granted to the mother.\n\n"
            "Filing a Complaint:\n"
            "- You can approach a Protection Officer (appointed by the government in every district), a registered Service Provider, or file a complaint "
            "directly before the local Magistrate's court. No filing fees are required.\n\n"
            "--- Hindi Version ---\n"
            "घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम (PWDVA), 2005 के तहत कानूनी सुरक्षा।\n\n"
            "घरेलू हिंसा अधिनियम महिलाओं (पत्नियों, लिव-इन पार्टनर, माताओं, बहनों) को साझा घर में पुरुष भागीदारों या रिश्तेदारों द्वारा शारीरिक, भावनात्मक, यौन और आर्थिक शोषण से बचाता है।\n\n"
            "अधिनियम के तहत उपलब्ध प्रमुख राहतें:\n"
            "- संरक्षण आदेश (धारा 18): मजिस्ट्रेट प्रतिवादी को घरेलू हिंसा का कोई भी कृत्य करने, पीड़िता के कार्यस्थल पर जाने या उससे संपर्क करने से रोक सकता है।\n"
            "- निवास का अधिकार (धारा 19): महिला को साझा घर से बाहर नहीं निकाला जा सकता, चाहे घर में उसका कोई कानूनी हिस्सा हो या न हो। कोर्ट प्रतिवादी को उसके लिए वैकल्पिक आवास की व्यवस्था करने का आदेश दे सकता है।\n"
            "- मौद्रिक राहत (धारा 20): पीड़िता अपने और अपने बच्चों के लिए चिकित्सा खर्च, कमाई के नुकसान और मासिक भरण-पोषण का दावा कर सकती है।\n\n"
            "शिकायत दर्ज करना:\n"
            "- आप एक संरक्षण अधिकारी (Protection Officer), एक पंजीकृत सेवा प्रदाता से संपर्क कर सकते हैं, या सीधे स्थानीय मजिस्ट्रेट की अदालत में शिकायत दर्ज कर सकते हैं। इसके लिए कोई अदालती शुल्क नहीं लगता है।"
        )
    },
    {
        "category": "civil",
        "title": "Legal Aid Services and Free Lawyer Representation Rights",
        "text": (
            "Right to Free Legal Aid and Representation in India.\n\n"
            "Article 39A of the Constitution of India directs the State to provide free legal aid to ensure that justice is not denied to any citizen "
            "due to economic or other disabilities. The Legal Services Authorities Act, 1987 establishes NALSA (National Legal Services Authority), "
            "SALSA (State level), and DLSA (District level) to execute this right.\n\n"
            "Who is Eligible for Free Legal Services? (Section 12 of the Act):\n"
            "- Women and Children.\n"
            "- Members of Scheduled Castes (SC) or Scheduled Tribes (ST).\n"
            "- Industrial workmen.\n"
            "- Persons in custody or detention.\n"
            "- Victims of trafficking, mass disasters, violence, floods, or earthquakes.\n"
            "- Persons with disabilities.\n"
            "- Persons whose annual income does not exceed Rs. 3 Lakhs (limit varies slightly by state, e.g. Rs. 3 Lakh in Delhi, Rs. 1 Lakh in some other states).\n\n"
            "Services Provided:\n"
            "- Appointment of a free legal aid advocate to represent you in court.\n"
            "- Exemption from payment of court fees, process fees, and typing charges.\n"
            "- Free translation of court documents.\n\n"
            "How to Apply:\n"
            "- You can apply online via the NALSA portal (nalsa.gov.in) or visit the DLSA office located inside your local District Court complex.\n\n"
            "--- Hindi Version ---\n"
            "भारत में मुफ्त कानूनी सहायता और प्रतिनिधित्व पाने का अधिकार।\n\n"
            "भारत के संविधान का अनुच्छेद 39A राज्य को मुफ्त कानूनी सहायता प्रदान करने का निर्देश देता है ताकि आर्थिक या अन्य अक्षमताओं के कारण किसी भी नागरिक को न्याय से वंचित न किया जाए।\n\n"
            "मुफ्त कानूनी सेवाओं के लिए कौन पात्र है? (अधिनियम की धारा 12):\n"
            "- महिलाएं और बच्चे।\n"
            "- अनुसूचित जाति (SC) या अनुसूचित जनजाति (ST) के सदस्य।\n"
            "- औद्योगिक श्रमिक।\n"
            "- हिरासत या जेल में बंद व्यक्ति।\n"
            "- विकलांग व्यक्ति।\n"
            "- ऐसे व्यक्ति जिनकी वार्षिक आय 3 लाख रुपये से अधिक नहीं है (यह सीमा अलग-अलग राज्यों में थोड़ी भिन्न हो सकती है, जैसे दिल्ली में 3 लाख रुपये है)।\n\n"
            "प्रदान की जाने वाली सेवाएं:\n"
            "- अदालत में आपका प्रतिनिधित्व करने के लिए एक मुफ्त कानूनी सहायता वकील (Free Lawyer) की नियुक्ति।\n"
            "- अदालती शुल्क, प्रक्रिया शुल्क और टाइपिंग शुल्क के भुगतान से छूट।\n\n"
            "आवेदन कैसे करें:\n"
            "- आप NALSA पोर्टल (nalsa.gov.in) के माध्यम से ऑनलाइन आवेदन कर सकते हैं या अपने स्थानीय जिला न्यायालय परिसर के भीतर स्थित DLSA कार्यालय में जा सकते हैं।"
        )
    }
]

# ── 2. GENERATE EMBEDDINGS ───────────────────────────────────────────────────
print(f"Generating embeddings for {len(legal_chunks)} legal documents...")
try:
    chunk_texts = [c["text"] for c in legal_chunks]
    
    # Batch call to Gemini Embedding API
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=chunk_texts,
        config={
            "task_type": "RETRIEVAL_DOCUMENT",
            "output_dimensionality": 768,
        },
    )
    
    vectors = [emb.values for emb in result.embeddings]
    print(f"Successfully generated {len(vectors)} embeddings (Dimension: {len(vectors[0])})")
    
except Exception as e:
    print(f"[ERROR] Failed to generate embeddings: {e}")
    sys.exit(1)

# ── 3. UPSERT INTO POSTGRESQL (SUPABASE) ──────────────────────────────────────
print("Connecting to Supabase PostgreSQL database...")
try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # First, clean up any previous seed entries to avoid duplicates on re-run
    print("Deleting old seed legal documents...")
    cur.execute("DELETE FROM document_embeddings WHERE id LIKE 'seed_legal_doc_%'")
    conn.commit()
    
    # Map category to official source URLs
    source_urls = {
        "rti": "https://www.indiacode.nic.in/handle/123456789/2055",
        "fir": "https://www.indiacode.nic.in/handle/123456789/15272",
        "consumer": "https://consumeraffairs.nic.in/acts-and-rules/consumer-protection-act-2019",
        "civil": "https://www.indiacode.nic.in/handle/123456789/2143",
        "criminal": "https://nalsa.gov.in/acts",
    }

    args = []
    for idx, (chunk, vector) in enumerate(zip(legal_chunks, vectors)):
        chunk_id = f"seed_legal_doc_{idx}"
        metadata = {
            "source": "seed_indian_legal_docs",
            "filename": "Indian Legal Guides (NyayaMitra)",
            "title": chunk["title"],
            "source_url": source_urls.get(chunk["category"], "https://www.indiacode.nic.in"),
            "chunk_index": idx,
            "total_chunks": len(legal_chunks),
            "category": chunk["category"],
        }
        args.append((chunk_id, str(vector), chunk["text"], Json(metadata)))
        
    print(f"Upserting {len(args)} vector records into document_embeddings table...")
    execute_values(
        cur,
        """
        INSERT INTO document_embeddings (id, embedding, document, metadata)
        VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            embedding = EXCLUDED.embedding,
            document = EXCLUDED.document,
            metadata = EXCLUDED.metadata,
            created_at = NOW()
        """,
        args,
        template="(%s, %s::vector, %s, %s)"
    )
    conn.commit()
    print("Database seeding completed successfully!")
    
except Exception as e:
    print(f"[ERROR] Database operations failed: {e}")
    if 'conn' in locals():
        conn.rollback()
    sys.exit(1)
finally:
    if 'cur' in locals():
        cur.close()
    if 'conn' in locals():
        conn.close()
