const fs = require('fs');
const path = require('path');

const updates = {
  "landlord-dispute": `Article 21: Protection of life and personal liberty - No person shall be deprived of his life or personal liberty except according to procedure established by law. (This includes the right to livelihood, shelter, and dignity).\n\nArticle 14: Equality before law - The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.\n\nArticle 19(1)(e): to reside and settle in any part of the territory of India.\n\nArticle 300A: Persons not to be deprived of property save by authority of law - No person shall be deprived of his property save by authority of law.`,
  "consumer-complaint": `Section 2(9) of Consumer Protection Act 2019 defines 'consumer rights' to include:\n(i) the right to be protected against the marketing of goods, products or services which are hazardous to life and property;\n(ii) the right to be informed about the quality, quantity, potency, purity, standard and price of goods, products or services, as the case may be, so as to protect the consumer against unfair trade practices;\n(iii) the right to be assured, wherever possible, access to a variety of goods, products or services at competitive prices;\n(iv) the right to be heard and to be assured that consumers' interests will receive due consideration at appropriate fora;\n(v) the right to seek redressal against unfair trade practice or restrictive trade practices or unscrupulous exploitation of consumers; and\n(vi) the right to consumer awareness.`,
  "workplace-harassment": `Section 3 of POSH Act 2013: Prevention of sexual harassment.— (1) No woman shall be subjected to sexual harassment at any workplace. (2) The following circumstances, among other circumstances, if it occurs, or is present in relation to or connected with any act or behaviour of sexual harassment may amount to sexual harassment:— (i) implied or explicit promise of preferential treatment in her employment; or (ii) implied or explicit threat of detrimental treatment in her employment; or (iii) implied or explicit threat about her present or future employment status; or (iv) interference with her work or creating an intimidating or offensive or hostile work environment for her; or (v) humiliating treatment likely to affect her health or safety.`,
  "fir-filing": `Section 154 of the Code of Criminal Procedure, 1973 (now Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023): Information in cognizable cases.—\n(1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf.\n(2) A copy of the information as recorded under sub-section (1) shall be given forthwith, free of cost, to the informant.`,
  "rti-application": `Section 3 of RTI Act, 2005: Right to information.—Subject to the provisions of this Act, all citizens shall have the right to information.\n\nSection 6: Request for obtaining information.—(1) A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made, accompanying such fee as may be prescribed, to— (a) the Central Public Information Officer or State Public Information Officer, as the case may be, of the concerned public authority; (b) the Central Assistant Public Information Officer or State Assistant Public Information Officer, as the case may be, specifying the particulars of the information sought by him or her.`,
  "domestic-violence": `Section 3 of PWDVA, 2005: Definition of domestic violence.—For the purposes of this Act, any act, omission or commission or conduct of the respondent shall constitute domestic violence in case it— (a) harms or injures or endangers the health, safety, life, limb or well-being, whether mental or physical, of the aggrieved person or tends to do so and includes causing physical abuse, sexual abuse, verbal and emotional abuse and economic abuse; or (b) harasses, harms, injures or endangers the aggrieved person with a view to coerce her or any other person related to her to meet any unlawful demand for any dowry or other property or valuable security...\nSection 12 allows the aggrieved person to present an application to the Magistrate seeking one or more reliefs under this Act.`,
  "property-dispute": `Section 5 of Transfer of Property Act, 1882: 'Transfer of property' defined.—In the following sections 'transfer of property' means an act by which a living person conveys property, in present or in future, to one or more other living persons, or to himself, or to himself and one or more other living persons; and 'to transfer property' is to perform such act.\n\nSection 17 of the Registration Act, 1908: Documents of which registration is compulsory.—(1) The following documents shall be registered: (a) instruments of gift of immovable property; (b) other non-testamentary instruments which purport or operate to create, declare, assign, limit or extinguish, whether in present or in future, any right, title or interest, whether vested or contingent, of the value of one hundred rupees and upwards, to or in immovable property.`,
  "labor-rights": `Section 12 of Minimum Wages Act, 1948: Payment of minimum rates of wages.—(1) Where in respect of any scheduled employment a notification under section 5 is in force, the employer shall pay to every employee engaged in a scheduled employment under him wages at a rate not less than the minimum rate of wages fixed by such notification for that class of employees in that employment without any deductions except as may be authorized within such time and subject to such conditions as may be prescribed.\n\nSection 5 of Payment of Wages Act, 1936: Time of payment of wages.—(1) The wages of every person employed upon or in—(a) any railway, factory or industrial or other establishment upon or in which less than one thousand persons are employed, shall be paid before the expiry of the seventh day.`
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
    console.error("Eval failed", filePath, e); 
    return; 
  }

  for (let sit of parsedArray) {
    const newText = updates[sit.id];
    if (newText && sit.laws && sit.laws.length > 0) {
      sit.laws[0].fullText = newText;
    }
  }

  const updatedArrayStr = JSON.stringify(parsedArray, null, 2);
  const newContent = content.substring(0, firstBracket) + updatedArrayStr + content.substring(lastBracket + 1);

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("Patched:", filePath);
}

patchFile(path.join(__dirname, 'frontend/data/situations.ts'));
patchFile(path.join(__dirname, 'backend/src/data/situations.js'));
