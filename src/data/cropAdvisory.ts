import { CropAdvisoryData, CropType, GrowthStage, ActionPlan, WhatIfResult } from '../types';

export const CROP_CONFIGS: { type: CropType; name: string; nameHi: string; icon: string; emoji: string }[] = [
  { type: 'Wheat', name: 'Wheat', nameHi: 'गेहूं', icon: '🌾', emoji: '🌾' },
  { type: 'Rice', name: 'Rice (Paddy)', nameHi: 'धान (चावल)', icon: '🌱', emoji: '🌱' },
  { type: 'Soybean', name: 'Soybean', nameHi: 'सोयाबीन', icon: '🌿', emoji: '🌿' },
  { type: 'Cotton', name: 'Cotton', nameHi: 'कपास', icon: '☁️', emoji: '☁️' },
  { type: 'Tomato', name: 'Tomato', nameHi: 'टमाटर', icon: '🍅', emoji: '🍅' },
  { type: 'Other', name: 'Other Crop', nameHi: 'अन्य फसल', icon: '🌾', emoji: '🌾' },
];

export const STAGE_CONFIGS: { stage: GrowthStage; name: string; nameHi: string; days: string }[] = [
  { stage: 'Sowing', name: 'Sowing & Germination', nameHi: 'बुवाई एवं अंकुरण', days: 'Day 0–15' },
  { stage: 'Vegetative', name: 'Vegetative Growth', nameHi: 'वानस्पतिक वृद्धि', days: 'Day 16–45' },
  { stage: 'Flowering', name: 'Flowering & Grain/Fruit Formation', nameHi: 'फूल एवं फलन अवस्था', days: 'Day 46–75' },
  { stage: 'Harvesting', name: 'Maturity & Harvesting', nameHi: 'परिपक्वता एवं कटाई', days: 'Day 76+' },
];

export function getCropAdvisory(crop: CropType, stage: GrowthStage, rainfallMm: number, humidity: number): CropAdvisoryData {
  const isRainImminent = rainfallMm > 10;
  const isHighHumidity = humidity > 75;

  const cropAdvisories: Record<CropType, Record<GrowthStage, Partial<CropAdvisoryData>>> = {
    Wheat: {
      Sowing: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: isRainImminent ? 'Surface soil crusting danger after heavy shower.' : 'Favorable temperature for seed bed preparation.',
        weatherHeadlineHi: isRainImminent ? 'भारी बारिश से मिट्टी की ऊपरी परत सख्त होने का खतरा।' : 'बीज क्यारी तैयार करने के लिए अनुकूल तापमान।',
        recommendations: [
          isRainImminent ? 'Postpone sowing for 48 hours until field drains to field capacity' : 'Proceed with line sowing with treated certified seed',
          'Ensure depth of 4–5 cm to prevent seed rotting in wet patches',
          'Apply basal dose of DAP and Zinc Sulphate prior to final plowing',
        ],
        recommendationsHi: [
          isRainImminent ? 'खेत से पानी निकलने तक 48 घंटे के लिए बुवाई टालें' : 'उपचारित प्रमाणित बीजों के साथ कतार में बुवाई करें',
          'गीले पैच में बीज सड़ने से बचाने के लिए 4-5 सेमी गहराई रखें',
          'अंतिम जुताई से पहले डीएपी और जिंक सल्फेट की आधार खुराक दें',
        ],
        dos: ['Treat seeds with Trichoderma viride', 'Ensure level field for even germination'],
        donts: ['Do not sow in waterlogged seedbed', 'Avoid broadcasting without covering'],
        irrigationStatus: isRainImminent ? 'Hold' : 'Light Irrigation',
        sprayingStatus: 'Safe',
      },
      Vegetative: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: isRainImminent ? 'Crown Root Initiation (CRI) stage moisture surplus expected.' : 'Optimum tillering weather with cool nights.',
        weatherHeadlineHi: isRainImminent ? 'क्राउन रूट दीक्षा (सीआरआई) अवस्था में अतिरिक्त नमी का अनुमान।' : 'ठंडी रातों के साथ कल्ले फूटने के लिए अनुकूल मौसम।',
        recommendations: [
          isRainImminent ? 'Do not irrigate; forecast rainfall (18–25 mm) will meet crop moisture demand' : 'Schedule first CRI irrigation at 21 days',
          'Clear drainage channels at field boundaries to prevent yellowing of leaves',
          'Hold urea top-dressing until showers cease to prevent nitrogen leaching',
        ],
        recommendationsHi: [
          isRainImminent ? 'सिंचाई न करें; अनुमानित वर्षा (18-25 मिमी) नमी की जरूरत पूरी करेगी' : '21 दिन पर पहली सीआरआई सिंचाई की योजना बनाएं',
          'पत्तियों को पीला होने से बचाने के लिए मेड़ों के निकास रास्ते साफ करें',
          'यूरिया का छिड़काव बारिश रुकने तक रोकें ताकि नाइट्रोजन बर्बाद न हो',
        ],
        dos: ['Scout for early termite or aphid colonies', 'Maintain field drainage'],
        donts: ['Do not allow standing water over 12 hours', 'Avoid urea application in muddy soil'],
        irrigationStatus: isRainImminent ? 'Hold' : 'Recommended',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Flowering: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Rainfall & wind gusts during anthesis may cause lodging and pollen wash.' : 'Stable flowering conditions; maintain uniform soil moisture.',
        weatherHeadlineHi: isRainImminent ? 'फूल आने के दौरान बारिश और तेज हवा से फसल गिरने और पराग धुलने का खतरा।' : 'स्थिर फूल अवस्था; समान मृदा नमी बनाए रखें।',
        recommendations: [
          'Avoid unnecessary irrigation; standing water increases root lodging risk under gusty winds',
          'Monitor field drainage actively; stagnant water causes fungal root rot',
          'Postpone foliar pesticide or boron spraying if rainfall is imminent within 24 hours',
          isHighHumidity ? 'Alert: High relative humidity (>75%) creates ideal window for Yellow Rust (Puccinia striiformis)' : 'Inspect flag leaves for stripe rust pustules',
        ],
        recommendationsHi: [
          'अनावश्यक सिंचाई से बचें; तेज हवा में जलभराव से फसल गिरने का खतरा रहता है',
          'खेत में जल निकासी पर कड़ी नजर रखें; रुके पानी से जड़ सड़न हो सकती है',
          'अगले 24 घंटे में बारिश की संभावना के कारण कीटनाशक या बोरोन छिड़काव टालें',
          isHighHumidity ? 'सतर्कता: उच्च आर्द्रता (>75%) के कारण पीला रतुआ (येलो रस्ट) का अनुकूल मौसम' : 'झंडा पत्ती पर रतुआ के धब्बों की नियमित जांच करें',
        ],
        dos: ['Keep drainage furrows open', 'Survey field borders for rust pustules', 'Support heavy earheads if needed'],
        donts: ['Strictly postpone overhead spraying', 'Avoid heavy flood irrigation', 'Do not apply heavy nitrogen fertilizer'],
        pestDiseaseWarning: isHighHumidity ? 'High risk of Yellow/Brown Rust. Keep Propiconazole 25% EC on standby.' : undefined,
        irrigationStatus: isRainImminent ? 'Drain Fields' : 'Light Irrigation',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Harvesting: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Imminent rainfall threatens standing mature grain quality and grain blackening.' : 'Dry sunny conditions optimal for combine harvesting.',
        weatherHeadlineHi: isRainImminent ? 'आसन्न बारिश से पके दानों की चमक खोने और काला पड़ने का गंभीर जोखिम।' : 'कंबाइन हार्वेस्टिंग के लिए शुष्क धूप वाला सर्वोत्तम मौसम।',
        recommendations: [
          isRainImminent ? 'Speed up harvesting of mature fields today and shift grain bags to covered sheds' : 'Harvest when grain moisture drops below 12%',
          'Cover harvested heaps immediately with water-resistant tarpaulins',
          'Do not leave threshing produce exposed on open threshing floors',
        ],
        recommendationsHi: [
          isRainImminent ? 'परिपक्व खेतों की कटाई तुरंत तेज करें और बोरियों को पक्के गोदाम में रखें' : 'दाने में नमी 12% से कम होने पर कटाई करें',
          'कटे हुए ढेरों को वाटरप्रूफ तिरपाल से तुरंत ढकें',
          'खुले खलिहान में अनाज को खुला न छोड़ें',
        ],
        dos: ['Store grain on raised wooden pallets', 'Secure tarpaulin edges with weights'],
        donts: ['Do not thresh in open ground during cloud cover', 'Avoid storing damp grain'],
        irrigationStatus: 'Hold',
        sprayingStatus: 'Safe',
      },
    },
    Rice: {
      Sowing: {
        riskLevel: 'low',
        weatherHeadline: 'Nursery bed preparation matches downscaled precipitation.',
        weatherHeadlineHi: 'नर्सरी क्यारी तैयार करने के लिए मौसम अनुकूल है।',
        recommendations: [
          'Maintain 2–3 cm shallow water layer in nursery raised beds',
          'Ensure drainage channels prevent seed displacement from sharp showers',
          'Treat seeds with Carbendazim before broadcasting',
        ],
        recommendationsHi: ['नर्सरी में 2-3 सेमी उथला पानी रखें', 'तेज बौछारों से बीज बहने से बचाने के लिए निकास खुला रखें', 'बुवाई से पहले कार्बेन्डाजिम से बीजोपचार करें'],
        dos: ['Use raised nursery beds', 'Keep mesh on drainage outlets'],
        donts: ['Do not submerge sprouts over 5 cm', 'Avoid untreated seeds'],
        irrigationStatus: 'Light Irrigation',
        sprayingStatus: 'Safe',
      },
      Vegetative: {
        riskLevel: isRainImminent ? 'low' : 'moderate',
        weatherHeadline: 'Tillering stage benefits from current moderate precipitation.',
        weatherHeadlineHi: 'कल्ले फूटने की अवस्था वर्तमान बारिश से लाभान्वित होगी।',
        recommendations: [
          'Rainfall will replenish paddy basins; switch off electric borewell pumps to save power',
          'Maintain 3–5 cm water depth in main field',
          'Split-apply Urea and Potash after rain spell concludes',
        ],
        recommendationsHi: ['बारिश से खेत भरेंगे; बिजली बचाने के लिए ट्यूबवेल बंद रखें', 'खेत में 3-5 सेमी पानी का स्तर रखें', 'बारिश खत्म होने के बाद यूरिया और पोटाश डालें'],
        dos: ['Weed fields before water depth increases', 'Check bunds for breaches'],
        donts: ['Do not breach outer boundary bunds', 'Avoid chemical spray in rain'],
        irrigationStatus: 'Hold',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Flowering: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: isRainImminent ? 'Watch for Bacterial Leaf Blight and Sheath Blight in warm humid spell.' : 'Panicle emergence stage is progressing smoothly.',
        weatherHeadlineHi: isRainImminent ? 'गर्म-उमस भरे मौसम में जीवाणु पत्ती झुलसा और शीथ ब्लाइट का खतरा।' : 'बाली निकलने की अवस्था सुचारू रूप से चल रही है।',
        recommendations: [
          'Avoid flooding above 5 cm; excess stagnation hampers root aeration',
          'Look for yellowing margins signaling bacterial blight',
          'Avoid insecticide spray during morning pollination (09:00 - 11:30 AM)',
        ],
        recommendationsHi: ['5 सेमी से अधिक पानी न भरने दें', 'जीवाणु झुलसा के लक्षणों की निगरानी करें', 'सुबह 9 से 11:30 बजे परागण के समय कीटनाशक न छिड़कें'],
        dos: ['Maintain slow water movement if possible', 'Monitor water weevil and stem borer'],
        donts: ['Do not drain fields completely during milky stage', 'Avoid spraying in midday heat'],
        pestDiseaseWarning: isHighHumidity ? 'Favorable humidity for False Smut and Sheath Blight.' : undefined,
        irrigationStatus: 'Hold',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Harvesting: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Heavy rain hazard to mature golden panicles; avoid shattering.' : 'Ideal harvest window for golden yellow paddy.',
        weatherHeadlineHi: isRainImminent ? 'पकी सुनहरी बालियों पर भारी बारिश का खतरा; दाना झड़ने से बचाएं।' : 'सुनहरे धान की कटाई के लिए उत्तम मौसम।',
        recommendations: [
          'Drain field water completely 10 days before harvesting',
          isRainImminent ? 'Delay mechanized combine harvesting until soil surface dries out to avoid heavy rutting' : 'Proceed with combine harvesting',
          'Stack harvested sheaves in high-elevation threshing floor',
        ],
        recommendationsHi: ['कटाई से 10 दिन पहले खेत का पानी पूरी तरह निकाल दें', isRainImminent ? 'जमीन सूखने तक कंबाइन हार्वेस्टर का प्रयोग न करें' : 'कंबाइन से कटाई आगे बढ़ाएं', 'कटी फसल को ऊंचे स्थान पर रखें'],
        dos: ['Drain bunds 7 days prior', 'Cover threshed paddy with plastic sheets'],
        donts: ['Do not run tractor on saturated soil', 'Avoid bag stacking on wet floor'],
        irrigationStatus: 'Drain Fields',
        sprayingStatus: 'Safe',
      },
    },
    Soybean: {
      Sowing: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Soybean seeds are sensitive to waterlogging within 48h of sowing.' : 'Soil temperature and moisture optimal for broad-bed furrow sowing.',
        weatherHeadlineHi: isRainImminent ? 'बुवाई के 48 घंटे के भीतर जलभराव से सोयाबीन बीज सड़ने का खतरा।' : 'ब्रॉड-बेड फरो बुवाई के लिए तापमान और नमी अनुकूल।',
        recommendations: [
          'Do not sow if more than 20mm rainfall is predicted within 24 hours',
          'Ensure ridge and furrow or BBF system to drain excess runoff',
          'Inoculate seed with Rhizobium and PSB culture',
        ],
        recommendationsHi: ['24 घंटे में 20 मिमी से अधिक बारिश की संभावना हो तो बुवाई रोकें', 'अतिरिक्त पानी निकालने के लिए मेड़ व नाली विधि अपनाएं', 'राइजोबियम और पीएसबी कल्चर से बीजोपचार करें'],
        dos: ['Adopt broad bed furrow technique', 'Test seed germination percentage (>70%)'],
        donts: ['Never sow deep in wet clay (>4 cm)', 'Do not flood newly sown field'],
        irrigationStatus: 'Hold',
        sprayingStatus: 'Safe',
      },
      Vegetative: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: 'Root nodulation and trifoliate leaf expansion active.',
        weatherHeadlineHi: 'जड़ों में गांठें बनना और पत्तियों का विकास सक्रिय।',
        recommendations: [
          'Keep drainage ditches clear; standing water for >24 hours stunts nodulation',
          'Scout for Girdle Beetle and Spodoptera caterpillar defoliation',
          'Weed control recommended only when soil reaches crumb consistency',
        ],
        recommendationsHi: ['नालियां साफ रखें; 24 घंटे से अधिक जलभराव से जड़ ग्रंथियां प्रभावित होती हैं', 'गर्डल बीटल और सेमीलूपर इल्ली की निगरानी करें', 'मिट्टी सूखने पर ही निराई-गुड़ाई करें'],
        dos: ['Ensure inter-row drainage furrows', 'Inspect leaf petioles for girdle marks'],
        donts: ['Avoid heavy tractor weeding in wet soil', 'Do not delay weed management'],
        irrigationStatus: 'Hold',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Flowering: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Rain showers during peak flowering cause flower and young pod drop.' : 'Dry sunny weather supports beneficial pollinator activity.',
        weatherHeadlineHi: isRainImminent ? 'फूल आने के दौरान बारिश से फूल और छोटी फलियां झड़ने का खतरा।' : 'धूप वाला मौसम परागण कीटों के लिए उत्तम।',
        recommendations: [
          'Avoid any supplemental irrigation as soil moisture is at 68%',
          'Spray post-emergence fungicide (Tebuconazole) only after rain clouds clear',
          'Do not walk extensively in wet soybean field to prevent Anthracnose spread',
        ],
        recommendationsHi: ['मृदा नमी 68% होने के कारण अतिरिक्त सिंचाई न करें', 'फफूंदनाशक का छिड़काव बादल छंटने के बाद ही करें', 'गीले खेत में चलने से बचें ताकि रोग न फैले'],
        dos: ['Scout for yellow mosaic virus vectors (whitefly)', 'Ensure good drainage'],
        donts: ['Do not spray in windy or rainy hours', 'Avoid nitrogen fertilization'],
        pestDiseaseWarning: isHighHumidity ? 'High risk of Rhizoctonia aerial blight and pod rot.' : undefined,
        irrigationStatus: 'Drain Fields',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Harvesting: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Critical Alert: Rain on dry mature soybean pods triggers shattering and fungal discolouration.' : 'Pod leaves dropped; pods brown and rattling. Ready for harvest.',
        weatherHeadlineHi: isRainImminent ? 'गंभीर चेतावनी: पकी सूखी फलियों पर बारिश से फलियां चटकने और दाने खराब होने का खतरा।' : 'पत्तियां झड़ चुकी हैं; फलियां भूरी हैं। कटाई का सही समय।',
        recommendations: [
          'Urgent: Complete harvesting of already matured plots without delay',
          'Move harvested plants directly to roofed storage; do not leave in open swaths',
          'Thresh only when pod moisture is 13–14% to prevent seed coat splitting',
        ],
        recommendationsHi: ['अति आवश्यक: पके खेतों की कटाई में बिल्कुल देरी न करें', 'कटी फसल को सीधे पक्की छत वाले शेड में रखें; खुले में न छोड़ें', 'दाना चटकने से बचाने के लिए 13-14% नमी पर ही गहाई करें'],
        dos: ['Store harvested crop on plastic sheets', 'Cover all piles with waterproof tarps'],
        donts: ['Never leave cut heaps unattended overnight', 'Avoid delays when pods are rattling'],
        irrigationStatus: 'Hold',
        sprayingStatus: 'Safe',
      },
    },
    Cotton: {
      Sowing: {
        riskLevel: 'low',
        weatherHeadline: 'Favorable warm soil temperature for Bt cotton germination.',
        weatherHeadlineHi: 'कपास के अंकुरण के लिए गर्म मृदा तापमान अनुकूल।',
        recommendations: [
          'Plant on ridges to facilitate quick drainage in black soils',
          'Maintain 90 x 60 cm spacing for hybrid cultivars',
          'Apply pre-emergence herbicide Pendimethalin within 48 hours of sowing',
        ],
        recommendationsHi: ['काली मिट्टी में त्वरित जल निकासी हेतु मेड़ों पर बुवाई करें', '90x60 सेमी की दूरी रखें', 'बुवाई के 48 घंटे के भीतर पेंडीमेथालिन डालें'],
        dos: ['Ensure ridge planting', 'Check seed label for refuge seeds mix'],
        donts: ['Do not dibble seeds too deep (>3 cm)', 'Avoid sowing before heavy cloudburst'],
        irrigationStatus: 'Light Irrigation',
        sprayingStatus: 'Safe',
      },
      Vegetative: {
        riskLevel: 'low',
        weatherHeadline: 'Square initiation stage with active monopodial branch development.',
        weatherHeadlineHi: 'शाखाओं और कलियों के विकास की सक्रिय अवस्था।',
        recommendations: [
          'Monitor sucking pests (thrips, aphids, jassids) under high humidity',
          'Intercultural operations should be done to aerate root zone',
          'Avoid excess nitrogen which leads to excessive vegetative rank growth',
        ],
        recommendationsHi: ['उमस में रस चूसक कीटों (माहू, थ्रिप्स, हरा तेला) की निगरानी करें', 'जड़ क्षेत्र में हवा के लिए निराई-गुड़ाई करें', 'अधिक यूरिया न दें जिससे केवल पत्ते बढ़ते हैं'],
        dos: ['Install yellow sticky traps (5 per acre)', 'Keep furrows well groomed'],
        donts: ['Do not allow water stagnation near root collar', 'Avoid indiscriminate synthetic pyrethroids'],
        irrigationStatus: isRainImminent ? 'Hold' : 'Light Irrigation',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Flowering: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Wind gusts (>18 km/h) and heavy showers trigger square/boll shedding.' : 'Boll setting in progress; steady transpiration demand.',
        weatherHeadlineHi: isRainImminent ? 'तेज हवा और बारिश से कलियों और छोटे टिंडों के झड़ने का खतरा।' : 'टिंडे बनने की अवस्था; पौधों को नियमित नमी की आवश्यकता।',
        recommendations: [
          'Provide drainage furrows every 4 rows to evacuate sudden excess water',
          'Foliar spray of 1% Potassium Nitrate (13:0:45) after showers to arrest boll dropping',
          'Postpone spraying if wind speed exceeds 15 km/h to prevent spray drift',
        ],
        recommendationsHi: ['अतिरिक्त पानी निकालने के लिए हर 4 कतार के बाद निकास नाली बनाएं', 'टिंडे झड़ने से रोकने के लिए बारिश बाद 1% पोटेशियम नाइट्रेट का छिड़काव करें', '15 किमी/घंटा से अधिक हवा होने पर छिड़काव न करें'],
        dos: ['Install pheromone traps for pink bollworm (4/acre)', 'Monitor lower canopies'],
        donts: ['Never spray during peak wind periods', 'Do not flood furrow during cloudy weather'],
        pestDiseaseWarning: 'Watch for Pink Bollworm (Pectinophora gossypiella) rosette flowers.',
        irrigationStatus: isRainImminent ? 'Drain Fields' : 'Hold',
        sprayingStatus: 'Avoid (High Wind)',
      },
      Harvesting: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Rain on burst cotton bolls causes fiber yellowing and trash contamination.' : 'Bright sunshine days ideal for clean seed cotton picking.',
        weatherHeadlineHi: isRainImminent ? 'खुले टिंडों पर बारिश से रुई पीली पड़ने और गुणवत्ता खराब होने का डर।' : 'स्वच्छ कपास चुगाई के लिए खिली धूप का उत्तम मौसम।',
        recommendations: [
          'Pick open clean bolls early in the day after dew evaporates (10:00 AM onwards)',
          'Store picked kapas in clean, dry gunny bags inside dry godowns',
          'Never pick damp or rain-soaked bolls together with grade-1 cotton',
        ],
        recommendationsHi: ['ओस सूखने के बाद सुबह 10 बजे से स्वच्छ खिले टिंडों की चुगाई करें', 'चुनी गई कपास को सूखे बोरे में पक्के कमरे में रखें', 'गीली या बारिश से भीगी रुई को अच्छी कपास के साथ न मिलाएं'],
        dos: ['Pick only fully burst bolls', 'Use clean cotton picking cloth bags'],
        donts: ['Do not use synthetic polypropylene bags (causes fiber contamination)', 'Do not pick wet bolls'],
        irrigationStatus: 'Hold',
        sprayingStatus: 'Safe',
      },
    },
    Tomato: {
      Sowing: {
        riskLevel: 'low',
        weatherHeadline: 'Pro-tray nursery raised beds protected from direct rainfall impact.',
        weatherHeadlineHi: 'प्रोट्रे नर्सरी क्यारियां बारिश के सीधे प्रभाव से सुरक्षित।',
        recommendations: [
          'Raise seedlings under 50% shade net or poly-tunnel to safeguard against raindrop splash',
          'Drench nursery trays with Trichoderma and Pseudomonas culture',
          'Maintain clean drainage around poly-tunnels',
        ],
        recommendationsHi: ['बारिश की बूंदों से बचाने के लिए 50% शेडनेट या पॉली-टनल के नीचे पौधे तैयार करें', 'ट्रे को ट्राइकोडर्मा घोल से उपचारित करें', 'टनल के चारों ओर पानी का निकास खुला रखें'],
        dos: ['Use coco-peat pro-trays', 'Harden seedlings 3 days prior to transplanting'],
        donts: ['Do not let nursery beds waterlog', 'Avoid overcrowded sowing'],
        irrigationStatus: 'Light Irrigation',
        sprayingStatus: 'Safe',
      },
      Vegetative: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: 'Active branching; check for Early Blight with rising relative humidity.',
        weatherHeadlineHi: 'शाखाओं का फैलाव; उमस बढ़ने के साथ अगेती झुलसा रोग की जांच करें।',
        recommendations: [
          'Stake tomato plants with bamboo poles and trellis wire to keep foliage off muddy soil',
          'Mulch with silver-black plastic sheet to avoid soil splash onto lower leaves',
          'Apply copper oxychloride (2.5 g/L) protective spray before heavy rain spell',
        ],
        recommendationsHi: ['पौधों को बांस व तार के सहारे बांधें ताकि पत्ते मिट्टी से न छुएं', 'निचली पत्तियों पर मिट्टी के छींटों से बचने के लिए मल्चिंग करें', 'बारिश से पहले कॉपर ऑक्सीक्लोराइड का सुरक्षात्मक छिड़काव करें'],
        dos: ['Prune lowest leaves touching the soil', 'Maintain sturdy trellis stakes'],
        donts: ['Do not leave indeterminate vines trailing on the ground', 'Avoid high nitrogen'],
        irrigationStatus: isRainImminent ? 'Hold' : 'Light Irrigation',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Flowering: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'High humidity (78%) & 27°C creates high risk of Late Blight (Phytophthora infestans).' : 'Moderate temperatures support heavy flowering and fruit set.',
        weatherHeadlineHi: isRainImminent ? 'उच्च आर्द्रता (78%) और 27°C तापमान के कारण पछेती झुलसा का उच्च जोखिम।' : 'मध्यम तापमान फूल आने और फल बनने के लिए अनुकूल।',
        recommendations: [
          'Immediate caution: Late blight water-soaked spots can spread exponentially in warm wet spells',
          'Avoid flood irrigation completely; rely on precision drip when required',
          'Postpone spraying if rain is expected in <4 hours; use systemic Cymoxanil + Mancozeb once leaves dry',
          'Maintain field trench drainage to prevent collar rot (Sclerotium)',
        ],
        recommendationsHi: ['अति सावधानी: गर्म-गीले मौसम में पछेती झुलसा के धब्बे तेजी से फैलते हैं', 'क्यारियों में पानी भरने से बचें; केवल ड्रिप का प्रयोग करें', 'अगले 4 घंटे में बारिश हो तो छिड़काव टालें; पत्ते सूखने पर सिस्टेमिक दवा दें', 'कॉलर रॉट से बचाव के लिए खेत में पानी न रुकने दें'],
        dos: ['Inspect undersides of leaves for white fungal mold', 'Remove and bury diseased blighted plants'],
        donts: ['Never use overhead sprinkler irrigation', 'Do not delay fungicide at first symptom appearance'],
        pestDiseaseWarning: isHighHumidity ? 'Severe Late Blight & Blossom End Rot risk. Keep Mancozeb or Metalaxyl ready.' : undefined,
        irrigationStatus: isRainImminent ? 'Drain Fields' : 'Hold',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Harvesting: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Rain on ripe tomatoes causes fruit skin cracking and fruit fly infestation.' : 'Firm breaker/pink stage tomatoes ready for picking and market dispatch.',
        weatherHeadlineHi: isRainImminent ? 'पके टमाटरों पर बारिश से त्वचा फटने और फल मक्खी का प्रकोप हो सकता है।' : 'बाजार भेजने के लिए गुलाबी/पके फलों की तुड़ाई का सही समय।',
        recommendations: [
          'Harvest all breaker-stage and pink-ripe fruits immediately before rainfall starts',
          'Sort out any cracked or blemish fruits into separate crates to protect healthy produce',
          'Stack plastic crates in ventilated packing shed away from rain spray',
        ],
        recommendationsHi: ['बारिश शुरू होने से पहले सभी गुलाबी/पके फलों की तुड़ाई कर लें', 'फटे हुए फलों को अलग करें ताकि अन्य फल सुरक्षित रहें', 'क्रेट्स को बारिश से सुरक्षित हवादार शेड में रखें'],
        dos: ['Pick fruits with small calyx attached', 'Use clean sanitized harvest crates'],
        donts: ['Do not harvest during active rain shower', 'Do not leave crates under open sky'],
        irrigationStatus: 'Hold',
        sprayingStatus: 'Safe',
      },
    },
    Other: {
      Sowing: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: isRainImminent ? 'Rain expected. Ensure proper seedbed drainage.' : 'Favorable conditions for crop establishment.',
        weatherHeadlineHi: isRainImminent ? 'बारिश की संभावना। बीज क्यारी में जल निकासी सुनिश्चित करें।' : 'फसल की शुरुआती बढ़त के लिए अनुकूल परिस्थितियां।',
        recommendations: ['Maintain proper seed depth', 'Ensure drainage furrows are open', 'Treat seeds before sowing'],
        recommendationsHi: ['उचित गहराई पर बुवाई करें', 'जल निकासी नालियां खुली रखें', 'बीजोपचार करें'],
        dos: ['Ensure level soil', 'Keep drainage ready'],
        donts: ['Avoid sowing in waterlogged soil'],
        irrigationStatus: isRainImminent ? 'Hold' : 'Light Irrigation',
        sprayingStatus: 'Safe',
      },
      Vegetative: {
        riskLevel: isRainImminent ? 'moderate' : 'low',
        weatherHeadline: isRainImminent ? 'Monitor field drainage during rainfall.' : 'Optimal conditions for canopy growth.',
        weatherHeadlineHi: isRainImminent ? 'बारिश के दौरान खेत में पानी रुकने न दें।' : 'फसल विकास के लिए अनुकूल मौसम।',
        recommendations: ['Keep field bunds intact', 'Avoid over-irrigation', 'Apply balanced nutrients after rain'],
        recommendationsHi: ['मेड़ों को मजबूत रखें', 'अत्यधिक सिंचाई से बचें', 'बारिश के बाद पोषक तत्व दें'],
        dos: ['Check fields regularly', 'Clear drainage paths'],
        donts: ['Do not let water stagnate'],
        irrigationStatus: isRainImminent ? 'Hold' : 'Recommended',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Flowering: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Rain and high humidity require close pest and disease monitoring.' : 'Good weather for flowering and pod/fruit development.',
        weatherHeadlineHi: isRainImminent ? 'बारिश और नमी के कारण कीट व रोगों की निगरानी रखें।' : 'फूल एवं फलन के लिए अच्छा मौसम।',
        recommendations: ['Avoid unnecessary irrigation', 'Monitor field drainage', 'Avoid spraying immediately before rainfall'],
        recommendationsHi: ['अनावश्यक सिंचाई से बचें', 'खेत में निकास रास्ते खुले रखें', 'बारिश से ठीक पहले छिड़काव न करें'],
        dos: ['Keep drainage furrows open', 'Scout for pests'],
        donts: ['Do not flood fields', 'Avoid midday spraying'],
        pestDiseaseWarning: isHighHumidity ? 'High humidity may induce fungal infections.' : undefined,
        irrigationStatus: isRainImminent ? 'Drain Fields' : 'Light Irrigation',
        sprayingStatus: isRainImminent ? 'Postpone (Rain Likely)' : 'Safe',
      },
      Harvesting: {
        riskLevel: isRainImminent ? 'high' : 'low',
        weatherHeadline: isRainImminent ? 'Rain threat to mature standing crop.' : 'Ideal dry conditions for harvesting.',
        weatherHeadlineHi: isRainImminent ? 'पकी फसल पर बारिश का जोखिम।' : 'कटाई के लिए अनुकूल शुष्क मौसम।',
        recommendations: ['Speed up harvesting of mature fields', 'Store harvested produce in dry shelter', 'Cover heaps with tarpaulins'],
        recommendationsHi: ['पके खेतों की तेजी से कटाई करें', 'उपज को सूखे स्थान पर रखें', 'तिरपाल से ढककर रखें'],
        dos: ['Store in covered shed', 'Keep tarps ready'],
        donts: ['Do not leave harvested crop in open field'],
        irrigationStatus: 'Hold',
        sprayingStatus: 'Safe',
      },
    },
  };

  const current = (cropAdvisories[crop] && cropAdvisories[crop][stage]) || cropAdvisories.Wheat.Flowering;
  const cropConfig = CROP_CONFIGS.find(c => c.type === crop)!;
  const stageConfig = STAGE_CONFIGS.find(s => s.stage === stage)!;

  return {
    crop,
    cropHi: cropConfig.nameHi,
    stage,
    stageHi: stageConfig.nameHi,
    riskLevel: current.riskLevel || 'moderate',
    weatherHeadline: current.weatherHeadline || 'Localized Panchayat micro-climate assessment in effect.',
    weatherHeadlineHi: current.weatherHeadlineHi || 'स्थानीय पंचायत सूक्ष्म जलवायु मूल्यांकन प्रभावी है।',
    recommendations: current.recommendations || ['Follow standard agricultural practices.'],
    recommendationsHi: current.recommendationsHi || ['मानक कृषि प्रथाओं का पालन करें।'],
    dos: current.dos || ['Monitor field regularly'],
    donts: current.donts || ['Avoid unnecessary field disturbance'],
    pestDiseaseWarning: current.pestDiseaseWarning,
    irrigationStatus: current.irrigationStatus || 'Hold',
    sprayingStatus: current.sprayingStatus || 'Safe',
  };
}

export function evaluateWhatIf(action: ActionPlan, crop: CropType, stage: GrowthStage, rainMm: number, windKm: number): WhatIfResult {
  switch (action) {
    case 'irrigate':
      if (rainMm > 12) {
        return {
          action,
          verdict: 'not_recommended',
          title: 'Irrigation NOT Recommended',
          titleHi: 'सिंचाई की सिफारिश नहीं की जाती',
          summary: `Downscaled AI forecast predicts ${rainMm} mm of rainfall within the next 24 hours. Surface soil moisture is already high (68–74%).`,
          summaryHi: `एआई पूर्वानुमान के अनुसार अगले 24 घंटों में ${rainMm} मिमी बारिश की संभावना है। मृदा नमी पहले से पर्याप्त है।`,
          expectedWeather: `Expected Rainfall: ${rainMm} mm • Soil Moisture: 68% High • Evapotranspiration: Low`,
          cropImpact: 'Unnecessary irrigation will cause waterlogging, anaerobic root stress, nutrient leaching, and root rot diseases.',
          actionableSteps: [
            'Turn off electric or diesel tubewells and pumps',
            'Ensure drainage furrows are open and free of debris',
            'Re-evaluate soil moisture 24 hours after the rain event concludes',
          ],
        };
      } else if (rainMm > 4) {
        return {
          action,
          verdict: 'caution',
          title: 'Proceed with Caution (Light Drip Only)',
          titleHi: 'सावधानी बरतें (केवल हल्की ड्रिप)',
          summary: `Light scattered showers (${rainMm} mm) expected. Flood irrigation will oversaturate root zone.`,
          summaryHi: `हल्की बौछारें (${rainMm} मिमी) संभावित हैं। क्यारियों में पानी भरने से बचें।`,
          expectedWeather: `Expected Rain: ${rainMm} mm • Soil Moisture: 55% Moderate`,
          cropImpact: 'Only high-transpiration vegetable plots may require light drip pulses in early morning.',
          actionableSteps: ['Use pulse drip irrigation for 30–45 mins only', 'Avoid open furrow or flood irrigation'],
        };
      } else {
        return {
          action,
          verdict: 'recommended',
          title: 'Irrigation Safe & Recommended',
          titleHi: 'सिंचाई सुरक्षित एवं अनुशंसित',
          summary: 'Dry clear weather forecast with zero precipitation over next 48 hours. Optimal window for scheduled irrigation.',
          summaryHi: 'अगले 48 घंटों में बारिश की संभावना नहीं है। निर्धारित सिंचाई के लिए उत्तम समय।',
          expectedWeather: 'Precipitation: 0.0 mm • Bright Sunshine • Evaporation: Normal',
          cropImpact: 'Maintains critical cell turgor and nutrient absorption during vegetative/flowering growth.',
          actionableSteps: ['Irrigate during cool morning or evening hours to minimize evaporative loss', 'Follow recommended stage-specific water depths'],
        };
      }

    case 'spray':
      if (rainMm > 6 || windKm > 18) {
        return {
          action,
          verdict: 'not_recommended',
          title: 'Spraying NOT Recommended (Chemical Washout & Drift Risk)',
          titleHi: 'छिड़काव की सिफारिश नहीं (दवा धुलने और हवा से उड़ने का जोखिम)',
          summary: `Precipitation of ${rainMm} mm and wind speeds of ${windKm} km/h will wash off chemical active ingredients and cause severe spray drift into neighboring plots.`,
          summaryHi: `${rainMm} मिमी बारिश और ${windKm} किमी/घंटा हवा के कारण दवा धुल जाएगी और हवा में उड़कर नष्ट होगी।`,
          expectedWeather: `Precipitation: ${rainMm} mm • Wind: ${windKm} km/h • Humidity: High`,
          cropImpact: 'Complete financial loss of costly chemicals, pesticide runoff into water channels, and inadequate pest knockdown.',
          actionableSteps: [
            'Postpone pesticide/fungicide/foliar spray until rain clears completely',
            'Wait for wind speeds to drop below 12 km/h for uniform droplet deposition',
            'Ensure rain-fastness sticker (adjuvant) is mixed if emergency spray is required later',
          ],
        };
      } else {
        return {
          action,
          verdict: 'recommended',
          title: 'Spraying Window Favorable',
          titleHi: 'छिड़काव के लिए अनुकूल समय',
          summary: `Wind speeds are calm (${windKm} km/h) and no rain is predicted for next 36 hours. Chemical rain-fastness will easily be achieved.`,
          summaryHi: `हवा शांत (${windKm} किमी/घंटा) है और अगले 36 घंटे बारिश नहीं है। दवा पत्तों पर अच्छी तरह जमेगी।`,
          expectedWeather: `Rain: ${rainMm} mm • Wind: ${windKm} km/h (Calm) • Sunny intervals`,
          cropImpact: 'Maximum biological efficacy against target pests without environmental drift.',
          actionableSteps: ['Spray during 08:00–10:30 AM or 04:00–06:00 PM', 'Wear protective face mask and gloves'],
        };
      }

    case 'sow':
      if (rainMm > 15) {
        return {
          action,
          verdict: 'not_recommended',
          title: 'Sowing NOT Recommended (Seed Rot & Crust Risk)',
          titleHi: 'बुवाई की सिफारिश नहीं (बीज सड़ने का खतरा)',
          summary: `High rainfall (${rainMm} mm) will create water stagnant crust over newly drilled seeds, cutting off oxygen and leading to seedling damping off.`,
          summaryHi: `भारी बारिश (${rainMm} मिमी) से खेत में पानी भरने और बीज सड़ने की आशंका।`,
          expectedWeather: `Heavy Rainfall: ${rainMm} mm • Saturated Seedbed`,
          cropImpact: 'Poor germination percentage (<50%), uneven stand, and need for expensive re-sowing.',
          actionableSteps: ['Wait 48 hours for soil to reach optimum moisture (wapsa condition)', 'Prepare broad bed furrows (BBF) prior to sowing'],
        };
      } else {
        return {
          action,
          verdict: 'recommended',
          title: 'Sowing Recommended (Optimum Seedbed)',
          titleHi: 'बुवाई अनुशंसित (अनुकूल बीज क्यारी)',
          summary: 'Soil temperature and moisture balance are ideal for uniform seed emergence and early root elongation.',
          summaryHi: 'बीज अंकुरण और प्रारंभिक जड़ों के फैलाव के लिए मृदा तापमान और नमी उत्तम।',
          expectedWeather: 'Gentle moisture • Favorable soil temperature (24–28°C)',
          cropImpact: 'High germination rate (>90%) with vigorous early plant establishment.',
          actionableSteps: ['Sow with seed-cum-fertilizer drill at uniform depth', 'Treat seeds with bio-fungicide before sowing'],
        };
      }

    case 'harvest':
      if (rainMm > 8) {
        return {
          action,
          verdict: 'not_recommended',
          title: 'Open Field Harvesting NOT Recommended (Grain Spoiling Hazard)',
          titleHi: 'खुली कटाई की सिफारिश नहीं (अनाज खराब होने का खतरा)',
          summary: `Upcoming rain (${rainMm} mm) will wet standing heaps and threshed produce, leading to mould, fungal blackening, and seed sprouting.`,
          summaryHi: `आगामी बारिश (${rainMm} मिमी) से कटी फसल भीगने, फफूंद लगने और दानों में अंकुरण का खतरा।`,
          expectedWeather: `Rainfall: ${rainMm} mm • High Relative Humidity`,
          cropImpact: 'Grain grade deterioration, reduction in mandi market price by 20–35%, and storage rots.',
          actionableSteps: [
            'If crop is already cut, haul bundles to covered shed immediately',
            'Cover open piles with 200 GSM waterproof tarpaulins secured with stone weights',
            'Resume combine harvesting only after field surface is completely dry',
          ],
        };
      } else {
        return {
          action,
          verdict: 'recommended',
          title: 'Harvesting Recommended (Dry Golden Window)',
          titleHi: 'कटाई अनुशंसित (शुष्क अनुकूल समय)',
          summary: 'Clear sky and low humidity allow rapid grain drying and easy combine operation without wheel rutting.',
          summaryHi: 'साफ आसमान और शुष्क हवा के कारण कंबाइन हार्वेस्टर से कटाई के लिए सर्वोत्तम समय।',
          expectedWeather: 'Zero Rainfall • Low Air Humidity • Firm Soil',
          cropImpact: 'High test weight, bright golden grain luster, and optimal storage longevity.',
          actionableSteps: ['Harvest during midday when dew has completely vanished', 'Check grain moisture is under 12% before bagging'],
        };
      }
  }
}
