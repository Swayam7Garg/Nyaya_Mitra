"""
scripts/seed_comprehensive_legal.py
------------------------------------
Seeds the Supabase pgvector database with comprehensive Indian legal corpus:

Documents included (with official source URLs):
  1.  Indian Penal Code 1860 / Bharatiya Nyaya Sanhita 2023 — key sections
  2.  Constitution of India — Fundamental Rights & Duties (Part III & IV-A)
  3.  CrPC 1973 / Bharatiya Nagarik Suraksha Sanhita 2023 — procedure
  4.  RTI Act 2005 — full filing guide
  5.  Consumer Protection Act 2019 — complaint procedure
  6.  PWDVA 2005 — Domestic Violence protections
  7.  POCSO Act 2012 — Child Sexual Offences
  8.  IT Act 2000 — Cyber offences & penalties
  9.  Legal Services Authorities Act 1987 — Free legal aid
  10. Motor Vehicles Act 1988 — accident claims & rights
  11. Labour Laws — Minimum Wages, Workmen Compensation, POSH Act
  12. Transfer of Property Act — Tenant & landlord rights
  13. SC/ST (Prevention of Atrocities) Act 1989
  14. NDPS Act 1985 — Narcotic drug offences
  15. Hindu Marriage Act 1955 — Divorce & maintenance

Run from backend-python-rag:
    PYTHONPATH=. python scripts/seed_comprehensive_legal.py
"""

import os
import sys
from dotenv import load_dotenv
from google import genai
import psycopg2
from psycopg2.extras import Json, execute_values

load_dotenv()

db_url = (os.getenv("SUPABASE_DB_URL") or "").strip()
api_key = (os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY") or "").strip()

if not db_url:
    print("[ERROR] SUPABASE_DB_URL is not set.")
    sys.exit(1)
if not api_key:
    print("[ERROR] GOOGLE_API_KEY or GEMINI_API_KEY is not set.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

# ─────────────────────────────────────────────────────────────────────────────
# LEGAL CORPUS — Each entry: category, title, source_url, text (EN + HI)
# ─────────────────────────────────────────────────────────────────────────────
legal_documents = [

    # ── 1. IPC / BNS ──────────────────────────────────────────────────────────
    {
        "category": "criminal",
        "title": "Bharatiya Nyaya Sanhita (BNS) 2023 / Indian Penal Code — Common Offences & Penalties",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/20062",
        "text": (
            "Bharatiya Nyaya Sanhita (BNS) 2023 replaced the Indian Penal Code (IPC) 1860. "
            "Key offences and their punishments:\n\n"
            "OFFENCES AGAINST THE BODY:\n"
            "• Murder (Section 101 BNS / Section 302 IPC): Punishment is death or life imprisonment, plus fine.\n"
            "• Culpable Homicide not amounting to Murder (Section 105 BNS / Section 304 IPC): Up to 10 years (Part I) or life, or up to 2 years (Part II).\n"
            "• Grievous Hurt (Section 117 BNS / Section 320 IPC): Broken bones, loss of eyesight, hearing, or limb qualifies. Punishment: up to 7 years + fine.\n"
            "• Assault (Section 130 BNS / Section 351 IPC): Intentional act causing apprehension of harm; up to 3 months or fine Rs.500.\n\n"
            "OFFENCES AGAINST PROPERTY:\n"
            "• Theft (Section 303 BNS / Section 378 IPC): Taking movable property dishonestly; up to 3 years + fine.\n"
            "• Robbery (Section 309 BNS / Section 392 IPC): Theft with violence or threat; up to 10 years + fine.\n"
            "• Dacoity (Section 310 BNS / Section 395 IPC): Robbery by 5+ persons; up to 10 years or life + fine.\n"
            "• Cheating (Section 318 BNS / Section 420 IPC): Dishonest inducement causing delivery of property; up to 7 years + fine.\n"
            "• Criminal Breach of Trust (Section 316 BNS / Section 406 IPC): Misappropriation by a person entrusted with property; up to 3 years + fine.\n\n"
            "OFFENCES AGAINST WOMEN:\n"
            "• Rape (Section 63–70 BNS / Section 375–376 IPC): Minimum 10 years to life imprisonment. Gang rape: 20 years to life.\n"
            "• Sexual Harassment (Section 75 BNS / Section 354A IPC): Up to 3 years + fine.\n"
            "• Stalking (Section 78 BNS / Section 354D IPC): First offence up to 3 years; repeat up to 5 years.\n"
            "• Voyeurism (Section 77 BNS / Section 354C IPC): Up to 7 years + fine.\n"
            "• Cruelty by Husband (Section 85 BNS / Section 498A IPC): Mental or physical cruelty; up to 3 years + fine.\n\n"
            "DEFAMATION & SPEECH:\n"
            "• Defamation (Section 354 BNS / Section 499 IPC): Making or publishing false statement harming reputation; up to 2 years or fine or both.\n\n"
            "CRIMINAL CONSPIRACY:\n"
            "• Section 61 BNS / Section 120B IPC: Agreement to commit a serious offence; same punishment as the offence itself.\n\n"
            "--- हिंदी ---\n"
            "भारतीय न्याय संहिता (BNS) 2023 ने भारतीय दंड संहिता (IPC) 1860 की जगह ली।\n"
            "हत्या (धारा 101 BNS): मृत्युदंड या आजीवन कारावास। चोरी (धारा 303 BNS): 3 साल + जुर्माना। "
            "बलात्कार (धारा 63 BNS): न्यूनतम 10 साल से आजीवन। पति द्वारा क्रूरता (धारा 85 BNS / 498A IPC): 3 साल + जुर्माना।"
        )
    },

    # ── 2. Constitution of India ───────────────────────────────────────────────
    {
        "category": "constitutional",
        "title": "Constitution of India — Fundamental Rights (Part III, Articles 12–35)",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/15240",
        "text": (
            "FUNDAMENTAL RIGHTS OF EVERY CITIZEN OF INDIA (Part III of the Constitution):\n\n"
            "RIGHT TO EQUALITY (Articles 14–18):\n"
            "• Article 14: Equality before law — The State shall not deny to any person equality before the law or the equal protection of the laws within India.\n"
            "• Article 15: Prohibition of discrimination on grounds of religion, race, caste, sex, or place of birth. The State can make special provisions for women, children, and socially/educationally backward classes.\n"
            "• Article 16: Equality of opportunity in matters of public employment. No discrimination in government jobs based on religion, race, caste, sex, descent, place of birth.\n"
            "• Article 17: Abolition of Untouchability — Its practice in any form is forbidden.\n"
            "• Article 18: Abolition of titles — No title (except military and academic) shall be conferred by the State.\n\n"
            "RIGHT TO FREEDOM (Articles 19–22):\n"
            "• Article 19: Six freedoms — (a) Speech and Expression; (b) Peaceful Assembly; (c) Form Associations; (d) Move freely throughout India; (e) Reside anywhere in India; (g) Practice any profession.\n"
            "• Article 20: Protection from arbitrary conviction — (1) No ex-post facto laws; (2) No double jeopardy; (3) No self-incrimination.\n"
            "• Article 21: Protection of life and personal liberty — No person shall be deprived of his life or personal liberty except according to procedure established by law. This includes the right to live with dignity, right to privacy (K.S. Puttaswamy judgment 2017), right to livelihood, and right to speedy trial.\n"
            "• Article 21A: Right to Education — Free and compulsory education for all children aged 6–14 years.\n"
            "• Article 22: Protection against arbitrary arrest — Right to be informed of grounds of arrest; right to consult a lawyer of one's choice; must be produced before a Magistrate within 24 hours.\n\n"
            "RIGHT AGAINST EXPLOITATION (Articles 23–24):\n"
            "• Article 23: Prohibits traffic in human beings, begging, and forced labour.\n"
            "• Article 24: Prohibits employment of children below 14 years in factories, mines, and hazardous jobs.\n\n"
            "RIGHT TO FREEDOM OF RELIGION (Articles 25–28):\n"
            "• Article 25: Freedom of conscience and free profession, practice, and propagation of religion.\n"
            "• Article 26: Freedom to manage religious affairs.\n\n"
            "CULTURAL AND EDUCATIONAL RIGHTS (Articles 29–30):\n"
            "• Article 29: Protection of interests of minorities — Any section with a distinct language/script/culture has the right to conserve it.\n"
            "• Article 30: Right of minorities to establish and administer educational institutions.\n\n"
            "RIGHT TO CONSTITUTIONAL REMEDIES (Article 32):\n"
            "• Article 32: Right to move the Supreme Court for enforcement of Fundamental Rights (called the 'Heart and Soul of the Constitution' by Dr. Ambedkar).\n"
            "• Writs: Habeas Corpus (produce the person before court), Mandamus (order to perform duty), Prohibition, Certiorari, Quo Warranto.\n\n"
            "FUNDAMENTAL DUTIES (Article 51A, Part IV-A):\n"
            "11 duties of every citizen including: respect the Constitution, cherish freedom movement ideals, uphold sovereignty, promote harmony, protect environment, develop scientific temper, safeguard public property.\n\n"
            "DIRECTIVE PRINCIPLES (Articles 36–51, Part IV):\n"
            "Not enforceable in court but fundamental in governance: equal pay for equal work, free legal aid, living wage, right to work, uniform civil code.\n\n"
            "--- हिंदी ---\n"
            "भारत के संविधान के भाग III में मौलिक अधिकार हैं। अनुच्छेद 14 — कानून के समक्ष समानता। "
            "अनुच्छेद 19 — वाक् स्वतंत्रता, सभा, संघ बनाने, आवागमन, निवास और पेशे की स्वतंत्रता। "
            "अनुच्छेद 21 — जीवन और व्यक्तिगत स्वतंत्रता का संरक्षण। अनुच्छेद 22 — मनमाने गिरफ्तारी से सुरक्षा (24 घंटे में मजिस्ट्रेट के सामने पेश करना अनिवार्य)। "
            "अनुच्छेद 32 — मौलिक अधिकारों की रक्षा के लिए उच्चतम न्यायालय जाने का अधिकार।"
        )
    },

    # ── 3. BNSS / CrPC ────────────────────────────────────────────────────────
    {
        "category": "criminal",
        "title": "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 / CrPC — Criminal Procedure & FIR Rights",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/20065",
        "text": (
            "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 replaced the Code of Criminal Procedure (CrPC) 1973.\n\n"
            "FILING AN FIR (First Information Report):\n"
            "• Section 173 BNSS (Section 154 CrPC): FIR must be registered for all cognizable offences (murder, rape, kidnapping, robbery, dacoity etc.). "
            "Police CANNOT refuse to register an FIR. Free copy must be given to the informant immediately.\n"
            "• Zero FIR: An FIR can be filed at ANY police station, regardless of jurisdiction. It is then transferred to the correct station.\n"
            "• E-FIR: Under BNSS 2023, e-FIRs can be filed online and must be registered within 3 days.\n"
            "• Refusal to register FIR (Section 173(4) BNSS / 154(3) CrPC): Send complaint by Registered Post to Superintendent of Police. SP can direct investigation. "
            "Alternatively, file private complaint directly before a Judicial Magistrate under Section 223 BNSS (Section 200 CrPC).\n\n"
            "ARREST RIGHTS:\n"
            "• Section 35 BNSS (Section 41 CrPC): Police can arrest without warrant only for cognizable offences. For minor offences, must give notice to appear instead of arrest.\n"
            "• Section 37 BNSS (Section 41A CrPC): Police must give a notice to appear for offences where punishment is up to 3 years.\n"
            "• D.K. Basu Guidelines (Supreme Court): Officers must wear visible name tags. Arrest Memo must be prepared, witnessed by family. Arrested person must be informed of grounds of arrest.\n"
            "• Section 43(1) BNSS (Section 46 CrPC): Female cannot be arrested after sunset or before sunrise, except with permission of Judicial Magistrate and only by a female officer.\n\n"
            "BAIL:\n"
            "• Bailable Offences (First Schedule): Bail is a matter of right — police must release on bail when the accused furnishes surety.\n"
            "• Non-Bailable Offences: Only a Magistrate or Court can grant bail.\n"
            "• Anticipatory Bail (Section 484 BNSS / Section 438 CrPC): Application to Sessions Court or High Court for bail in anticipation of arrest.\n"
            "• Default Bail (Section 479 BNSS / Section 167(2) CrPC): If police fail to file chargesheet within 60 days (for offences up to 10 years) or 90 days (for offences with 10+ years / life / death), accused is entitled to bail as of right.\n\n"
            "TRIAL:\n"
            "• Sessions Cases (serious offences): Trial by Sessions Judge.\n"
            "• Magisterial Cases (lesser offences): Trial by Judicial Magistrate.\n"
            "• Summons Cases (minor offences): Simplified trial procedure.\n"
            "• Right to speedy trial: Guaranteed under Article 21. Cases must not linger for years without hearing.\n\n"
            "--- हिंदी ---\n"
            "BNSS 2023 ने CrPC 1973 की जगह ली। FIR (धारा 173 BNSS): पुलिस FIR दर्ज करने से इनकार नहीं कर सकती। "
            "Zero FIR किसी भी थाने में दर्ज हो सकती है। गिरफ्तारी के बाद 24 घंटे में मजिस्ट्रेट के सामने पेश करना जरूरी है। "
            "Default Bail: 60/90 दिनों में चार्जशीट न होने पर जमानत का अधिकार।"
        )
    },

    # ── 4. RTI Act 2005 ───────────────────────────────────────────────────────
    {
        "category": "rti",
        "title": "Right to Information Act 2005 — Complete Filing Guide",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2055",
        "text": (
            "RIGHT TO INFORMATION ACT 2005 — COMPLETE GUIDE\n\n"
            "Section 3: All citizens of India have the right to request information from public authorities.\n\n"
            "Section 6: HOW TO FILE AN RTI APPLICATION:\n"
            "• Application can be submitted in writing or electronically in English, Hindi, or official language of the area.\n"
            "• Address application to the Public Information Officer (PIO) of the concerned public authority.\n"
            "• No reasons need to be given for seeking the information.\n"
            "• Fee: Rs. 10 by cash, demand draft, or postal order. BPL applicants are exempt from fees.\n\n"
            "Section 7: RESPONSE TIMEFRAME:\n"
            "• Standard response: 30 days from date of receipt.\n"
            "• Life or Liberty of a person: 48 hours.\n"
            "• If from a third party: 40 days.\n"
            "• Third-party information involving Central Government: 30 days.\n\n"
            "Section 8: EXEMPTIONS (what you CANNOT get):\n"
            "• Information affecting sovereignty and integrity of India.\n"
            "• Information expressly forbidden by court.\n"
            "• Cabinet papers and deliberations of the Council of Ministers.\n"
            "• Personal information with no public activity nexus.\n\n"
            "APPEALS:\n"
            "• First Appeal (Section 19(1)): File within 30 days of PIO's response (or non-response) to the First Appellate Authority (FAA) who is senior to the PIO. FAA must decide in 30–45 days.\n"
            "• Second Appeal (Section 19(3)): File within 90 days of FAA's order to the State Information Commission (SIC) or Central Information Commission (CIC).\n"
            "• Complaints to CIC/SIC: Under Section 18 if PIO refuses to accept application.\n\n"
            "PENALTY:\n"
            "• Section 20: PIO can be penalized Rs. 250/day (max Rs. 25,000) for failing to provide information without reasonable cause.\n\n"
            "ONLINE FILING:\n"
            "• Central Government: rtionline.gov.in\n"
            "• State portals available for most states.\n\n"
            "--- हिंदी ---\n"
            "सूचना का अधिकार अधिनियम 2005: धारा 6 — लोक सूचना अधिकारी को 10 रुपये शुल्क देकर आवेदन करें। "
            "30 दिन में जवाब मिलना चाहिए। न मिले तो 30 दिन में प्रथम अपील करें। "
            "प्रथम अपील खारिज हो तो 90 दिन में CIC/SIC में द्वितीय अपील करें। "
            "ऑनलाइन आवेदन: rtionline.gov.in पर।"
        )
    },

    # ── 5. Consumer Protection Act 2019 ───────────────────────────────────────
    {
        "category": "consumer",
        "title": "Consumer Protection Act 2019 — Complaint Filing, E-Daakhil, Jurisdiction & Rights",
        "source_url": "https://consumeraffairs.nic.in/acts-and-rules/consumer-protection-act-2019",
        "text": (
            "CONSUMER PROTECTION ACT 2019 — FULL GUIDE\n\n"
            "DEFINITION OF CONSUMER (Section 2(7)): A person who buys goods or avails services for personal use, not for resale or commercial purpose.\n\n"
            "GROUNDS FOR COMPLAINT:\n"
            "• Defective goods (manufacturing or material defect)\n"
            "• Deficiency in services (hotel, hospital, transport, insurance, banking)\n"
            "• Overcharging beyond MRP or agreed price\n"
            "• Misleading advertisements (Section 2(28))\n"
            "• Unfair trade practices (refusing bills, no return policy)\n"
            "• Restrictive trade practices\n\n"
            "WHERE TO FILE (PECUNIARY JURISDICTION):\n"
            "• District Consumer Disputes Redressal Commission (DCDRC): Value up to Rs. 1 Crore (2024 amendment — earlier Rs. 50 Lakhs).\n"
            "• State Consumer Disputes Redressal Commission (SCDRC): Value Rs. 1 Crore to Rs. 10 Crores.\n"
            "• National Consumer Disputes Redressal Commission (NCDRC): Value above Rs. 10 Crores.\n\n"
            "HOW TO FILE:\n"
            "• Online: E-Daakhil portal — edaakhil.nic.in (no physical visit required, payment online).\n"
            "• Physical: Submit at DCDRC office in your district.\n"
            "• Fee: Rs. 200 (up to Rs. 5 Lakhs), Rs. 400 (up to Rs. 10 Lakhs), Rs. 500 (up to Rs. 20 Lakhs), Rs. 2000 (above Rs. 50 Lakhs).\n\n"
            "BEFORE FILING — SEND LEGAL NOTICE:\n"
            "• Send registered post notice to seller/service provider giving 15 days to resolve.\n"
            "• Keep proof of delivery. This strengthens your case.\n\n"
            "LIMITATION PERIOD:\n"
            "• Section 69: Complaint must be filed within 2 years from the date the cause of action arose.\n\n"
            "RELIEF AVAILABLE:\n"
            "• Repair/replacement of defective goods\n"
            "• Refund of price paid\n"
            "• Compensation for injury or loss\n"
            "• Punitive damages\n"
            "• Product Liability (Section 82–87): Manufacturer/seller/service provider is liable for harm caused by defective product.\n\n"
            "MEDIATION (Section 74–81):\n"
            "• Consumer Commissions can refer disputes to Consumer Mediation Cells for faster resolution before trial.\n\n"
            "--- हिंदी ---\n"
            "उपभोक्ता संरक्षण अधिनियम 2019: जिला आयोग — 1 करोड़ तक। राज्य आयोग — 1 करोड़ से 10 करोड़। "
            "राष्ट्रीय आयोग — 10 करोड़ से अधिक। ई-दाखिल पोर्टल edaakhil.nic.in पर ऑनलाइन शिकायत करें। "
            "शिकायत का कारण उत्पन्न होने के 2 साल के भीतर दाखिल करें।"
        )
    },

    # ── 6. Domestic Violence Act 2005 ─────────────────────────────────────────
    {
        "category": "civil",
        "title": "Protection of Women from Domestic Violence Act 2005 (PWDVA) — Full Guide",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/15436",
        "text": (
            "PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT 2005 (PWDVA)\n\n"
            "WHO IS PROTECTED: Women (wife, live-in partner, mother, sister, daughter) living or having lived in a shared household with the respondent.\n\n"
            "WHAT IS DOMESTIC VIOLENCE (Section 3):\n"
            "• Physical abuse: Assault, use of force causing bodily pain, harm, or injury.\n"
            "• Sexual abuse: Sexual conduct that humiliates, degrades, or violates dignity.\n"
            "• Verbal and emotional abuse: Name-calling, threats of divorce, insults about not having male children.\n"
            "• Economic abuse: Denial of financial resources, refusing to give maintenance, forcing to vacate the home.\n\n"
            "ORDERS AVAILABLE FROM MAGISTRATE:\n"
            "• Protection Orders (Section 18): Restrain respondent from committing violence, contacting victim, entering her workplace, school, or the shared household.\n"
            "• Residence Orders (Section 19): The woman cannot be evicted from the shared household regardless of ownership. Court can allot separate room or direct respondent to find alternative accommodation.\n"
            "• Monetary Relief (Section 20): Medical expenses, loss of earnings, damage to property, child maintenance — can be ordered as monthly payments.\n"
            "• Custody Orders (Section 21): Temporary custody of children can be awarded to the mother.\n"
            "• Compensation Orders (Section 22): Compensation for injuries, including mental torture.\n\n"
            "HOW TO FILE A COMPLAINT:\n"
            "1. Approach a Protection Officer (PO) — appointed by State Government in every district (free of charge).\n"
            "2. Contact a registered Service Provider NGO (can file complaint on your behalf).\n"
            "3. File complaint directly before the local Judicial Magistrate (no court fee).\n"
            "4. Call the National Women Helpline: 181 or 1091.\n\n"
            "IMPORTANT: Magistrate must fix first date of hearing within 3 days of receiving the complaint. Ex-parte orders (without hearing respondent) can be passed in emergencies.\n\n"
            "WHAT HAPPENS TO THE RESPONDENT:\n"
            "• Breach of Protection Order (Section 31): Criminal offence — up to 1 year imprisonment or Rs. 20,000 fine or both.\n\n"
            "--- हिंदी ---\n"
            "घरेलू हिंसा अधिनियम 2005: शारीरिक, यौन, मौखिक और आर्थिक हिंसा से महिलाओं को संरक्षण। "
            "राष्ट्रीय महिला हेल्पलाइन 181 या 1091 पर कॉल करें। "
            "जिले के Protection Officer से निःशुल्क मदद लें। मजिस्ट्रेट 3 दिन में पहली सुनवाई की तारीख देगा।"
        )
    },

    # ── 7. POCSO Act 2012 ─────────────────────────────────────────────────────
    {
        "category": "criminal",
        "title": "POCSO Act 2012 — Protection of Children from Sexual Offences",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2054",
        "text": (
            "PROTECTION OF CHILDREN FROM SEXUAL OFFENCES (POCSO) ACT 2012\n\n"
            "APPLICABILITY: Applies to all children below 18 years of age. Gender neutral — protects both girls and boys.\n\n"
            "KEY OFFENCES AND PUNISHMENTS:\n"
            "• Penetrative Sexual Assault (Section 3): Minimum 10 years, maximum life imprisonment + fine.\n"
            "• Aggravated Penetrative Sexual Assault (Section 5): Committed by police officer, armed forces, public servant, against a child below 16 years — Minimum 20 years to life imprisonment; death penalty possible.\n"
            "• Sexual Assault (Section 7): Non-penetrative sexual touch with sexual intent — 3 to 5 years + fine.\n"
            "• Aggravated Sexual Assault (Section 9): 5 to 7 years + fine.\n"
            "• Sexual Harassment (Section 11): 3 years + fine.\n"
            "• Child Pornography (Section 13–15): Producing, distributing, storing — up to 5 years; second offence up to 7 years.\n\n"
            "MANDATORY REPORTING (Section 19): Any person who has knowledge of a POCSO offence MUST report it to the Special Juvenile Police Unit (SJPU) or local police. Failure to report is punishable with up to 6 months imprisonment.\n\n"
            "SPECIAL PROCEDURAL PROTECTIONS:\n"
            "• Section 24: Child must NOT be arrested. Must NOT be dressed in police uniform during questioning.\n"
            "• Section 26: Statement recorded at child's residence or comfortable place of their choice — NOT at police station.\n"
            "• Section 33: Cases tried by Special Courts (one in each district) — trial must be completed within 1 year.\n"
            "• Child's identity must never be disclosed in media (Section 23).\n"
            "• Medical examination of a girl child must be by a female doctor (Section 27).\n\n"
            "WHERE TO REPORT:\n"
            "• Call Police Helpline: 100 or Childline: 1098\n"
            "• Nearest police station\n"
            "• SJPU (Special Juvenile Police Unit)\n\n"
            "--- हिंदी ---\n"
            "POCSO Act 2012: 18 वर्ष से कम आयु के सभी बच्चों (लड़का/लड़की) पर लागू। "
            "घुसपैठ यौन हमला: न्यूनतम 10 साल की सजा। "
            "किसी को भी इसकी जानकारी होने पर SJPU या पुलिस को रिपोर्ट करना अनिवार्य है। "
            "चाइल्डलाइन 1098 पर कॉल करें।"
        )
    },

    # ── 8. IT Act 2000 ────────────────────────────────────────────────────────
    {
        "category": "cyber",
        "title": "Information Technology Act 2000 — Cyber Crimes, Penalties & Online Rights",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/1999",
        "text": (
            "INFORMATION TECHNOLOGY ACT 2000 (AMENDED 2008) — KEY CYBER OFFENCES\n\n"
            "COMPUTER CRIMES:\n"
            "• Section 43: Unauthorized access to a computer, downloading data, introducing virus — compensation up to Rs. 1 Crore.\n"
            "• Section 66: Computer-related offences (hacking, data theft, virus introduction) — up to 3 years or Rs. 5 Lakh fine or both.\n"
            "• Section 66A (STRUCK DOWN by Supreme Court, Shreya Singhal v. Union of India, 2015): Was used to criminalize online speech; now unconstitutional.\n"
            "• Section 66B: Dishonestly receiving a stolen computer resource — up to 3 years + Rs. 1 Lakh fine.\n"
            "• Section 66C: Identity theft (using someone else's digital signature/password/unique identifier) — up to 3 years + Rs. 1 Lakh fine.\n"
            "• Section 66D: Cheating by personation using a computer — up to 3 years + Rs. 1 Lakh fine.\n"
            "• Section 66E: Privacy violation (capturing/publishing private images without consent) — up to 3 years + Rs. 2 Lakh fine.\n"
            "• Section 66F: Cyber terrorism — life imprisonment.\n\n"
            "ONLINE CONTENT CRIMES:\n"
            "• Section 67: Publishing obscene material online — 3 years + Rs. 5 Lakh fine; repeat: 5 years + Rs. 10 Lakh fine.\n"
            "• Section 67A: Sexually explicit material — 5 years + Rs. 10 Lakh fine.\n"
            "• Section 67B: Child pornography — 5 to 7 years + fine.\n\n"
            "HARASSMENT ONLINE (also covered by BNS/IPC):\n"
            "• Cyberbullying, morphing photos, threatening messages, stalking online — Section 354D BNS (Stalking) and Section 66C/66E IT Act.\n\n"
            "HOW TO REPORT CYBER CRIMES:\n"
            "• National Cyber Crime Reporting Portal: cybercrime.gov.in\n"
            "• Helpline: 1930\n"
            "• Nearest Cyber Cell (available in most district police HQs)\n\n"
            "RIGHT TO PRIVACY (Post Puttaswamy 2017):\n"
            "• Right to Privacy is a Fundamental Right under Article 21.\n"
            "• Digital Personal Data Protection Act 2023 (DPDPA): Individuals have rights to access, correct, and erase their data from companies.\n\n"
            "--- हिंदी ---\n"
            "IT Act 2000: धारा 66C — पहचान की चोरी: 3 साल + 1 लाख जुर्माना। "
            "धारा 66E — निजी तस्वीरें बिना अनुमति के प्रकाशित करना: 3 साल। "
            "साइबर अपराध की रिपोर्ट cybercrime.gov.in पर करें या 1930 पर कॉल करें।"
        )
    },

    # ── 9. NALSA / Legal Aid ──────────────────────────────────────────────────
    {
        "category": "civil",
        "title": "Legal Services Authorities Act 1987 — Free Legal Aid Rights & NALSA",
        "source_url": "https://nalsa.gov.in/acts",
        "text": (
            "LEGAL SERVICES AUTHORITIES ACT 1987 — FREE LEGAL AID\n\n"
            "CONSTITUTIONAL BASIS: Article 39A of the Constitution mandates the State to provide free legal aid.\n\n"
            "AUTHORITIES:\n"
            "• NALSA: National Legal Services Authority — apex body, New Delhi.\n"
            "• SALSA: State Legal Services Authority — at State High Court level.\n"
            "• DLSA: District Legal Services Authority — at every District Court.\n"
            "• TALSA: Taluka Legal Services Committee — at sub-district level.\n\n"
            "WHO IS ENTITLED TO FREE LEGAL AID (Section 12):\n"
            "• Women and children.\n"
            "• Members of Scheduled Castes (SC) or Scheduled Tribes (ST).\n"
            "• Industrial workmen.\n"
            "• Persons in custody, detention, or juvenile homes.\n"
            "• Victims of mass disaster, violence, flood, drought, earthquake, or industrial disaster.\n"
            "• Persons with disability (mental or physical).\n"
            "• Victims of trafficking in human beings or begar.\n"
            "• Persons whose annual income does not exceed Rs. 3 Lakhs (varies by state).\n\n"
            "SERVICES PROVIDED:\n"
            "• Free legal advice and consultation.\n"
            "• Appointment of a lawyer (advocate) to represent you in court.\n"
            "• Preparation of legal documents, plaints, written statements.\n"
            "• Payment of court fees, process fees, and typing charges.\n"
            "• Free translation of court documents.\n"
            "• Filing of appeals.\n\n"
            "LOK ADALATS:\n"
            "• Section 19: Lok Adalats are alternative dispute resolution forums.\n"
            "• Settlement reached in Lok Adalat has the same force as a court decree.\n"
            "• No court fee for cases settled in Lok Adalat; already-paid fees are refunded.\n"
            "• National Lok Adalat held on 2nd Saturday of every month across all courts.\n\n"
            "HOW TO APPLY:\n"
            "• Online: nalsa.gov.in — fill the legal aid application form.\n"
            "• Physically: Visit the DLSA office located inside your District Court complex.\n"
            "• Mobile app: NALSA app available on Android.\n"
            "• Phone: Call NALSA helpline 15100.\n\n"
            "--- हिंदी ---\n"
            "निःशुल्क कानूनी सहायता: महिलाएं, बच्चे, SC/ST, विकलांग, 3 लाख से कम वार्षिक आय वाले — सभी पात्र हैं। "
            "अपने जिले की DLSA (जिला कानूनी सेवा प्राधिकरण) से संपर्क करें। "
            "NALSA हेल्पलाइन: 15100। लोक अदालत में निपटारा होने पर कोर्ट फीस वापस मिलती है।"
        )
    },

    # ── 10. Motor Vehicles Act 1988 ────────────────────────────────────────────
    {
        "category": "civil",
        "title": "Motor Vehicles Act 1988 — Accident Claims, MACT Tribunal & Compensation",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/1798",
        "text": (
            "MOTOR VEHICLES ACT 1988 (AMENDED 2019) — ACCIDENT CLAIMS GUIDE\n\n"
            "MOTOR ACCIDENTS CLAIMS TRIBUNAL (MACT):\n"
            "• Section 165: Every state must constitute MACT tribunals to adjudicate claims for compensation arising from road accidents.\n"
            "• Section 166: The victim, their legal representatives, or insurer can file a claim petition before the MACT.\n"
            "• LIMITATION: Claim must be filed within 6 months of the accident (though courts can condone delay for sufficient cause).\n\n"
            "WHO CAN CLAIM COMPENSATION:\n"
            "• Victims of the accident.\n"
            "• Legal heirs / dependents of a deceased victim.\n"
            "• The vehicle owner's insurer (subrogation).\n\n"
            "THIRD PARTY INSURANCE (Section 146): Mandatory for all motor vehicles. Third-party insurance covers injury/death to any third party caused by the vehicle.\n\n"
            "STRUCTURED FORMULA FOR COMPENSATION (Sarla Verma Case, SC 2009):\n"
            "Compensation = (Annual income × Multiplier based on age of deceased) − Living expenses (1/3 or 1/4 for dependents) + Add-ons (funeral, loss of consortium, loss of estate).\n\n"
            "HIT AND RUN COMPENSATION (Section 161 MV Act 2019):\n"
            "• Death: Rs. 2 Lakhs\n"
            "• Grievous injury: Rs. 50,000\n"
            "• Administered by Solatium Fund (IRDAI).\n"
            "• Apply to the Claims Inquiry Officer at your nearest District Magistrate / SDM office.\n\n"
            "NO FAULT LIABILITY (Section 163A):\n"
            "• Structured compensation available without proving negligence in fatal accidents.\n"
            "• Death: Rs. 50,000 structured payment.\n\n"
            "TRAFFIC FINES (Amendment 2019):\n"
            "• Drunk driving: Rs. 10,000 (first offence), Rs. 15,000 (repeat) + 6 months imprisonment.\n"
            "• Driving without license: Rs. 5,000.\n"
            "• Over-speeding: Rs. 1,000–2,000.\n"
            "• Helmet violation: Rs. 1,000 + 3-month license suspension.\n"
            "• Seatbelt violation: Rs. 1,000.\n\n"
            "--- हिंदी ---\n"
            "मोटर दुर्घटना दावा: MACT ट्रिब्यूनल में 6 महीने के भीतर दावा दाखिल करें। "
            "Hit-and-run में मृत्यु पर 2 लाख और गंभीर चोट पर 50,000 रुपये का मुआवजा मिलता है। "
            "Solatium Fund के लिए जिला मजिस्ट्रेट कार्यालय में आवेदन करें।"
        )
    },

    # ── 11. Labour Laws ───────────────────────────────────────────────────────
    {
        "category": "labour",
        "title": "Indian Labour Laws — Minimum Wages, POSH Act, Workmen Compensation & ESI",
        "source_url": "https://labour.gov.in/acts",
        "text": (
            "INDIAN LABOUR LAWS — KEY RIGHTS FOR WORKERS\n\n"
            "MINIMUM WAGES ACT 1948:\n"
            "• Section 3: State governments fix minimum wages for scheduled employments. Paying less than minimum wage is a criminal offence.\n"
            "• Penalty: Up to 6 months imprisonment + Rs. 500 fine.\n"
            "• File complaint with: Labour Commissioner / Assistant Labour Commissioner of your district.\n"
            "• 2023 national floor minimum wage: Rs. 176/day (Central Government employees). State rates vary.\n\n"
            "POSH ACT (SEXUAL HARASSMENT OF WOMEN AT WORKPLACE ACT 2013):\n"
            "• Every organization with 10+ employees must have an Internal Complaints Committee (ICC).\n"
            "• Complaint must be filed within 3 months of the incident.\n"
            "• ICC must complete inquiry within 60 days.\n"
            "• Complaint to District Officer (Local Complaints Committee) if employer does not have ICC or if complaint is against employer.\n"
            "• Helpline: SHe-Box portal — shebox.nic.in.\n\n"
            "EMPLOYEES STATE INSURANCE (ESI) ACT 1948:\n"
            "• Employees earning up to Rs. 21,000/month in factories/establishments with 10+ workers are covered.\n"
            "• Benefits: Medical care, cash benefit during sickness, maternity benefit, disablement benefit, dependent benefit.\n"
            "• ESIC hospitals provide free medical treatment to ESI beneficiaries.\n\n"
            "EMPLOYEE PROVIDENT FUND (EPF) ACT 1952:\n"
            "• 12% of basic salary + DA contributed by both employer and employee to EPF.\n"
            "• Employer NOT depositing PF contribution is a criminal offence.\n"
            "• Complaint to: Regional PF Commissioner (EPFO). UAN portal: unifiedportal-mem.epfindia.gov.in.\n\n"
            "WORKMEN COMPENSATION ACT 1923 / EMPLOYEES COMPENSATION ACT:\n"
            "• Employer must pay compensation for work-related injury or occupational disease.\n"
            "• Death compensation: 50% of monthly wages × relevant factor (based on age).\n"
            "• Permanent disablement: 60% of wages × factor.\n"
            "• Complaint to: Commissioner for Workmen's Compensation (district-level office).\n\n"
            "GRATUITY:\n"
            "• Payment of Gratuity Act 1972: Employee with 5+ years of continuous service is entitled to gratuity.\n"
            "• Amount: 15 days' wages for every year of service (max Rs. 20 Lakhs).\n\n"
            "--- हिंदी ---\n"
            "न्यूनतम वेतन से कम भुगतान अपराध है — जिला श्रम आयुक्त में शिकायत करें। "
            "POSH Act 2013: कार्यस्थल पर यौन उत्पीड़न की शिकायत के लिए shebox.nic.in पर जाएं। "
            "5+ साल काम करने पर ग्रेच्युटी का अधिकार। PF नहीं जमा करने पर नियोक्ता पर मुकदमा दायर करें।"
        )
    },

    # ── 12. SC/ST Prevention of Atrocities Act ────────────────────────────────
    {
        "category": "constitutional",
        "title": "SC/ST (Prevention of Atrocities) Act 1989 — Rights & Protections",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/1362",
        "text": (
            "SCHEDULED CASTES AND SCHEDULED TRIBES (PREVENTION OF ATROCITIES) ACT 1989\n\n"
            "PURPOSE: To prevent atrocities against Scheduled Castes (SC) and Scheduled Tribes (ST) and to provide relief and rehabilitation to victims.\n\n"
            "KEY OFFENCES (Section 3):\n"
            "• Forcing SC/ST person to eat or drink inedible substances.\n"
            "• Dumping excreta/dead animals on SC/ST premises.\n"
            "• Parading a person naked through public places.\n"
            "• Forcefully taking land of SC/ST person or interfering with water resources used by them.\n"
            "• Casteist abuse or public humiliation using caste name.\n"
            "• Sexual exploitation of SC/ST women.\n"
            "• Preventing from using common public resources (water, roads, burial grounds).\n"
            "• False case filing against SC/ST person to humiliate them.\n"
            "• Economic/social boycott of SC/ST family or community.\n\n"
            "PUNISHMENTS:\n"
            "• Most offences: Minimum 6 months, maximum 5 years imprisonment + fine.\n"
            "• Grievous hurt / rape: Minimum 10 years to life.\n"
            "• Death of victim: Death penalty possible.\n\n"
            "SPECIAL COURTS:\n"
            "• Section 14: Exclusive Special Courts established in each district for speedy trial of such offences.\n"
            "• Trials must be completed within 2 months.\n\n"
            "RELIEF AND REHABILITATION (Section 21):\n"
            "• State Government must provide travel expenses, daily allowances, maintenance for victims.\n"
            "• Rehabilitation in cases of displacement from home/village.\n\n"
            "NO ANTICIPATORY BAIL:\n"
            "• SC (Subhash Kashinath Mahajan v. State of Maharashtra, 2018 — later modified): Anticipatory bail cannot ordinarily be granted to accused under this Act. No arrest only on permission of senior officer (2018 judgment) — BUT the Supreme Court in 2019 restored the original strict interpretation that FIR must be registered and arrested immediately for cognizable offences.\n\n"
            "HOW TO FILE COMPLAINT:\n"
            "• File FIR at nearest police station (duty-bound to register).\n"
            "• If refused, approach Superintendent of Police (SC/ST cell).\n"
            "• National SC/ST Commission helpline available.\n\n"
            "--- हिंदी ---\n"
            "SC/ST उत्पीड़न रोकथाम अधिनियम 1989: जाति के नाम पर अपमान, भूमि हड़पना, सामाजिक बहिष्कार — सभी अपराध हैं। "
            "न्यूनतम 6 महीने से 5 साल की सजा। विशेष न्यायालय में 2 महीने में सुनवाई। "
            "FIR दर्ज करने से इनकार पर SP (SC/ST सेल) से संपर्क करें।"
        )
    },

    # ── 13. Hindu Marriage Act / Divorce / Maintenance ─────────────────────────
    {
        "category": "family",
        "title": "Hindu Marriage Act 1955 & Special Marriage Act — Divorce, Maintenance & Custody",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2055",
        "text": (
            "HINDU MARRIAGE ACT 1955 — DIVORCE, MAINTENANCE & CUSTODY\n\n"
            "APPLICABILITY: Applies to Hindus, Buddhists, Jains, and Sikhs.\n\n"
            "GROUNDS FOR DIVORCE (Section 13):\n"
            "• Adultery (voluntary sexual intercourse with another person)\n"
            "• Cruelty (physical or mental) — most common ground\n"
            "• Desertion for 2+ continuous years\n"
            "• Conversion to another religion\n"
            "• Unsound mind or mental disorder\n"
            "• Leprosy (incurable)\n"
            "• Venereal disease in communicable form\n"
            "• Renouncing the world (Sannyasi)\n"
            "• Presumed dead (not heard of for 7 years)\n\n"
            "DIVORCE BY MUTUAL CONSENT (Section 13B):\n"
            "• Both parties file together after living separately for 1 year.\n"
            "• Must wait 6 months (cooling-off period) before final decree — though Supreme Court can waive this under Article 142.\n"
            "• Fastest and most amicable route.\n\n"
            "MAINTENANCE (Section 24 & 25 HMA; Section 125 CrPC):\n"
            "• Section 24 HMA: Interim maintenance pending divorce proceedings — either spouse can claim.\n"
            "• Section 25 HMA: Permanent alimony — court considers income, assets, and conduct of parties.\n"
            "• Section 125 CrPC (BNSS 2023): Wife, children, and parents who are unable to maintain themselves can claim maintenance.\n"
            "• Muslim Women (Protection of Rights on Divorce) Act 1986: Iddat period maintenance mandatory; post-iddat can be ordered under Section 125 CrPC after 2001 Supreme Court judgment (Danial Latifi).\n\n"
            "CHILD CUSTODY (Guardians and Wards Act 1890 + HMA Section 26):\n"
            "• Welfare of the child is the paramount consideration.\n"
            "• Below 5 years: Usually with mother.\n"
            "• Courts may grant joint custody, visitation rights.\n"
            "• Section 26 HMA: Court can make interim custody orders during divorce proceedings.\n\n"
            "- Welfare of the child is the paramount consideration.\n"
            "- Below 5 years: Usually with mother.\n"
            "- Courts may grant joint custody, visitation rights.\n"
            "- Section 26 HMA: Court can make interim custody orders during divorce proceedings.\n\n"
            "DOWRY PROHIBITION ACT 1961:\n"
            "- Giving or taking dowry is a criminal offence - up to 5 years + Rs. 15,000 fine.\n"
            "- Cruelty for dowry: Section 498A IPC / Section 85 BNS - up to 3 years.\n"
            "- Dowry death: Section 304B IPC / Section 80 BNS - 7 years to life.\n\n"
            "SPECIAL MARRIAGE ACT 1954:\n"
            "- For inter-religion or inter-caste marriages. Grounds for divorce same as HMA.\n\n"
            "--- HINDI ---\n"
            "Hindu vivah adhiniyam 1955: Krurta, vyabhichar, parityag, mansik vikar - talak ke aadhar. "
            "Aapsi sahamati se talak (dhara 13B): 1 saal alag rehne ke baad aavedan, phir 6 mahine ka intezar. "
            "Bharan-poshan (dhara 125 CrPC): Patni, bachche aur mata-pita dawa kar sakte hain. "
            "Dahej utpeedan (dhara 498A / dhara 85 BNS): 3 saal ki saja."
        )
    },

    # -- 14. NDPS Act ----------------------------------------------------------
    {
        "category": "criminal",
        "title": "NDPS Act 1985 - Narcotic Drug Offences, Bail Restrictions & Penalties",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/1357",
        "text": (
            "NARCOTIC DRUGS AND PSYCHOTROPIC SUBSTANCES (NDPS) ACT 1985\n\n"
            "WHAT IS PROHIBITED: Production, manufacture, possession, sale, purchase, transport, storage, import, or export of narcotic drugs and psychotropic substances without authorization.\n\n"
            "COMMON DRUGS AND CLASSIFICATION:\n"
            "- Cannabis/Ganja, Hashish, Cocaine, Heroin, Morphine, Opium, Methamphetamine (meth), MDMA (ecstasy), LSD.\n\n"
            "QUANTITY-BASED PENALTIES (Small -> Intermediate -> Commercial Quantity):\n"
            "- Small Quantity: Up to 1 year imprisonment or Rs. 10,000 fine or both.\n"
            "- Intermediate Quantity: Up to 10 years + Rs. 1 Lakh fine.\n"
            "- Commercial Quantity (e.g., Heroin > 250g, Ganja > 20 kg): Minimum 10 years up to 20 years + Rs. 1-2 Lakh fine.\n"
            "- Second offence with commercial quantity: Minimum 15 years up to 30 years + fine up to Rs. 3 Lakh.\n"
            "- Death penalty (Section 31A): Repeat conviction for commercial quantity trafficking after previous conviction - possible.\n\n"
            "BAIL RESTRICTIONS (Section 37):\n"
            "- For offences involving commercial quantity: No bail unless the court is satisfied that there are reasonable grounds to believe the person is NOT guilty AND that he is not likely to commit the offence while on bail.\n"
            "- This is an extremely high bar - most commercial quantity NDPS accused remain in judicial custody during trial.\n\n"
            "RIGHTS OF ACCUSED:\n"
            "- Section 50: If the police officer intends to search a person (not a vehicle), they must offer to take the person before the nearest Gazetted Officer or Magistrate. Failure to comply makes the search illegal.\n"
            "- Right to inform family of arrest.\n"
            "- Right to legal representation.\n\n"
            "TREATMENT:\n"
            "NDPS Act 1985: नशीले पदार्थों की वाणिज्यिक मात्रा में तस्करी — न्यूनतम 10 साल, अधिकतम 20 साल। "
            "धारा 37: वाणिज्यिक मात्रा के मामलों में जमानत लेना बेहद कठिन है। "
            "धारा 50: व्यक्ति की तलाशी से पहले गजेटेड अधिकारी के सामने ले जाने का प्रस्ताव देना अनिवार्य है। "
            "पहली बार छोटी मात्रा वाले नशेड़ियों के लिए इलाज का विकल्प है।"
        )
    },

    # ── 15. Property / Transfer of Property ──────────────────────────────────
    {
        "category": "civil",
        "title": "Transfer of Property Act 1882 & Registration Act — Property Sale, Tenant Rights & Inheritance",
        "source_url": "https://www.indiacode.nic.in/handle/123456789/2143",
        "text": (
            "TRANSFER OF PROPERTY ACT 1882 — KEY RIGHTS\n\n"
            "SALE OF IMMOVABLE PROPERTY (Section 54):\n"
            "• Sale of immovable property worth Rs. 100+ must be in writing (sale deed) and registered.\n"
            "• Registration Act 1908: Sale deed must be registered at the Sub-Registrar's office in the jurisdiction where the property is located.\n"
            "• Stamp duty varies by state (typically 4–8% of property value). Registration fee: 1% of value.\n"
            "• An unregistered sale deed cannot be produced as evidence in court.\n\n"
            "TENANT RIGHTS UNDER TPA:\n"
            "• Section 106: Monthly tenancy — landlord must give 15 days' written notice to terminate. Annual tenancy — 6 months' notice.\n"
            "• Forcible eviction without court order is ILLEGAL. Landlord cannot cut off water, electricity, or access.\n"
            "• Security Deposit: Must be refunded upon vacating. Deductions only for actual damages, NOT normal wear and tear.\n"
            "• Landlord refusing to refund: Send legal notice. Then file civil suit in Rent Control Court or Civil Court.\n\n"
            "LEASE AGREEMENT:\n"
            "• Lease for 12 months or more must be registered under Registration Act.\n"
            "• An unregistered lease agreement of 12+ months is NOT enforceable in court.\n"
            "• Rent Agreements: 11-month agreements are common specifically to AVOID mandatory registration.\n\n"
            "MORTGAGE (Section 58):\n"
            "• Simple Mortgage: Mortgagor remains in possession but pledges property as security.\n"
            "• Mortgage by Deposit of Title Deeds (Equitable Mortgage): Common with banks — deposit of title documents with the lender.\n"
            "• Mortgage must be registered (Section 17, Registration Act) if value is Rs. 100+.\n\n"
            "INHERITANCE:\n"
            "• Hindu Succession Act 1956 (amended 2005): Sons and daughters have EQUAL rights in ancestral and self-acquired property.\n"
            "• Daughter's right to ancestral property: Recognized even if father died before 2005 amendment (Vineeta Sharma v. Rakesh Sharma, SC 2020).\n"
            "• Will must be attested by 2 witnesses to be valid (Indian Succession Act, Section 63).\n\n"
            "--- हिंदी ---\n"
            "संपत्ति हस्तांतरण अधिनियम 1882: बिक्री विलेख का सब-रजिस्ट्रार के यहाँ पंजीयन अनिवार्य है। "
            "बिना कोर्ट के आदेश के किरायेदार को जबरन नहीं निकाल सकते। "
            "बेटे-बेटियों का पैतृक संपत्ति में बराबर का अधिकार (हिंदू उत्तराधिकार संशोधन 2005)।"
        )
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# GENERATE EMBEDDINGS (batched)
# ─────────────────────────────────────────────────────────────────────────────
print(f"\n✦ Generating embeddings for {len(legal_documents)} comprehensive legal documents...")
all_vectors = []
batch_size = 5  # Gemini API batch limit

for i in range(0, len(legal_documents), batch_size):
    batch = legal_documents[i:i + batch_size]
    batch_texts = [d["text"] for d in batch]
    print(f"  → Embedding batch {i // batch_size + 1} ({len(batch)} docs)...")
    try:
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=batch_texts,
            config={"task_type": "RETRIEVAL_DOCUMENT", "output_dimensionality": 768},
        )
        for emb in result.embeddings:
            all_vectors.append(emb.values)
    except Exception as e:
        print(f"[ERROR] Batch {i // batch_size + 1} failed: {e}")
        sys.exit(1)

print(f"✓ Successfully generated {len(all_vectors)} embeddings (dim=768)")

# ─────────────────────────────────────────────────────────────────────────────
# UPSERT INTO SUPABASE POSTGRESQL
# ─────────────────────────────────────────────────────────────────────────────
print("\n✦ Connecting to Supabase PostgreSQL...")
try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # Clean old comprehensive seed entries
    print("  → Removing old comprehensive seed entries...")
    cur.execute("DELETE FROM document_embeddings WHERE id LIKE 'comprehensive_legal_%'")
    conn.commit()

    args = []
    for idx, (doc, vector) in enumerate(zip(legal_documents, all_vectors)):
        chunk_id = f"comprehensive_legal_{idx:02d}"
        metadata = {
            "source": "comprehensive_indian_legal_corpus",
            "title": doc["title"],
            "source_url": doc["source_url"],
            "category": doc["category"],
            "filename": doc["title"],
            "chunk_index": idx,
            "total_chunks": len(legal_documents),
        }
        args.append((chunk_id, str(vector), doc["text"], Json(metadata)))

    print(f"  → Upserting {len(args)} records into document_embeddings...")
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
    print(f"\n✓ Database seeding COMPLETE! {len(args)} legal documents indexed.")
    print("  Categories:", list(set(d["category"] for d in legal_documents)))

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
