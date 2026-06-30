import json

files = {
    'en': 'c:/Users/Krithika D V/Documents/community hero/frontend/src/locales/en/translation.json',
    'kn': 'c:/Users/Krithika D V/Documents/community hero/frontend/src/locales/kn/translation.json',
    'hi': 'c:/Users/Krithika D V/Documents/community hero/frontend/src/locales/hi/translation.json'
}

new_keys = {
    'en': {
        'landing': {
            'faqTitle': 'Frequently Asked Questions',
            'about': {
                'title': 'About the National Civic Redressal Initiative',
                'desc': 'An automated, high-accuracy telemetry mapping interface bridging citizens directly with municipal corporations. Powered by live data de-duplication pipelines to optimize city worker field dispatch times.'
            },
            'stats': {
                'activeDispatches': 'Active Dispatches',
                'resolutionEfficiency': 'Resolution Efficiency'
            },
            'footer': {
                'explore': 'Explore',
                'dashboard': 'Dashboard',
                'coverageMaps': 'Municipal Coverage Maps',
                'liveFeeds': 'Live Feeds',
                'regionalImpact': 'Regional Impact Analytics',
                'learnHelp': 'Learn & Get Help',
                'supportDesk': 'Citizen Support Desk',
                'documentation': 'Portal Documentation',
                'systemStatus': 'System Status',
                'municipalPartners': 'Municipal Partners',
                'bbmpCommand': 'BBMP Command Center',
                'bmcCentral': 'BMC Central Zone',
                'urbanDevMinistry': 'Urban Development Ministry',
                'termsPolicy': 'Terms & Policy',
                'termsOfService': 'Terms of Service',
                'privacyPolicy': 'Civic Privacy Policy',
                'dataRetention': 'Data Retention Guidelines'
            }
        },
        'corps': {
            'BMC': 'Brihanmumbai Municipal Corporation (BMC) - Mumbai',
            'MCD': 'Municipal Corporation of Delhi (MCD) - Delhi',
            'GCC': 'Greater Chennai Corporation (GCC) - Chennai',
            'GHMC': 'Greater Hyderabad Municipal Corporation (GHMC) - Hyderabad',
            'KMC': 'Kolkata Municipal Corporation (KMC) - Kolkata',
            'BCCMC': 'Bengaluru Central City Municipal Corporation (BCCMC) - Bengaluru',
            'AMC': 'Ahmedabad Municipal Corporation (AMC) - Ahmedabad',
            'PMC_PUNE': 'Pune Municipal Corporation (PMC) - Pune',
            'SMC': 'Surat Municipal Corporation (SMC) - Surat',
            'JMC': 'Jaipur Municipal Corporation (JMC) - Jaipur',
            'LMC': 'Lucknow Municipal Corporation (LMC) - Lucknow',
            'PMC_PATNA': 'Patna Municipal Corporation (PMC) - Patna',
            'central': 'Central City Admin (Master View)'
        },
        'authModal': {
            'branchDropdown': 'Municipal Branch Dropdown',
            'corpHead': 'Corporation Head'
        }
    },
    'kn': {
        'landing': {
            'faqTitle': 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
            'about': {
                'title': 'ರಾಷ್ಟ್ರೀಯ ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ಉಪಕ್ರಮದ ಬಗ್ಗೆ',
                'desc': 'ನಾಗರಿಕರನ್ನು ನೇರವಾಗಿ ಪುರಸಭೆಗಳೊಂದಿಗೆ ಬೆಸೆಯುವ ಸ್ವಯಂಚಾಲಿತ, ಉನ್ನತ-ನಿಖರತೆಯ ಟೆಲಿಮೆಟ್ರಿ ಮ್ಯಾಪಿಂಗ್ ಇಂಟರ್ಫೇಸ್. ನಗರ ಕಾರ್ಮಿಕರ ಕ್ಷೇತ್ರ ರವಾನೆ ಸಮಯವನ್ನು ಅತ್ಯುತ್ತಮವಾಗಿಸಲು ಲೈವ್ ಡೇಟಾ ಡಿ-ಡುಪ್ಲಿಕೇಶನ್ ಪೈಪ್‌ಲೈನ್‌ಗಳಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ.'
            },
            'stats': {
                'activeDispatches': 'ಸಕ್ರಿಯ ರವಾನೆಗಳು',
                'resolutionEfficiency': 'ಪರಿಹಾರ ದಕ್ಷತೆ'
            },
            'footer': {
                'explore': 'ಅನ್ವೇಷಿಸಿ',
                'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
                'coverageMaps': 'ವ್ಯಾಪ್ತಿ ನಕ್ಷೆಗಳು',
                'liveFeeds': 'ಲೈವ್ ಫೀಡ್‌ಗಳು',
                'regionalImpact': 'ಪ್ರಾದೇಶಿಕ ಪ್ರಭಾವ',
                'learnHelp': 'ಕಲಿಯಿರಿ ಮತ್ತು ಸಹಾಯ ಪಡೆಯಿರಿ',
                'supportDesk': 'ಬೆಂಬಲ ಡೆಸ್ಕ್',
                'documentation': 'ದಾಖಲೀಕರಣ',
                'systemStatus': 'ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ',
                'municipalPartners': 'ಪಾಲುದಾರರು',
                'bbmpCommand': 'BBMP ಕಮಾಂಡ್ ಸೆಂಟರ್',
                'bmcCentral': 'BMC ಕೇಂದ್ರ ವಲಯ',
                'urbanDevMinistry': 'ನಗರಾಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯ',
                'termsPolicy': 'ನಿಯಮಗಳು ಮತ್ತು ನೀತಿ',
                'termsOfService': 'ಸೇವಾ ನಿಯಮಗಳು',
                'privacyPolicy': 'ಗೌಪ್ಯತಾ ನೀತಿ',
                'dataRetention': 'ಡೇಟಾ ಧಾರಣ ಮಾರ್ಗಸೂಚಿಗಳು'
            }
        },
        'corps': {
            'BMC': 'ಬೃಹನ್ಮುಂಬೈ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (BMC) - ಮುಂಬೈ',
            'MCD': 'ದೆಹಲಿ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (MCD) - ದೆಹಲಿ',
            'GCC': 'ಗ್ರೇಟರ್ ಚೆನ್ನೈ ಕಾರ್ಪೊರೇಷನ್ (GCC) - ಚೆನ್ನೈ',
            'GHMC': 'ಗ್ರೇಟರ್ ಹೈದರಾಬಾದ್ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (GHMC) - ಹೈದರಾಬಾದ್',
            'KMC': 'ಕೋಲ್ಕತ್ತಾ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (KMC) - ಕೋಲ್ಕತ್ತಾ',
            'BCCMC': 'ಬೆಂಗಳೂರು ಕೇಂದ್ರ ನಗರ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (BCCMC) - ಬೆಂಗಳೂರು',
            'AMC': 'ಅಹಮದಾಬಾದ್ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (AMC) - ಅಹಮದಾಬಾದ್',
            'PMC_PUNE': 'ಪುಣೆ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (PMC) - ಪುಣೆ',
            'SMC': 'ಸೂರತ್ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (SMC) - ಸೂರತ್',
            'JMC': 'ಜೈಪುರ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (JMC) - ಜೈಪುರ',
            'LMC': 'ಲಕ್ನೋ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (LMC) - ಲಕ್ನೋ',
            'PMC_PATNA': 'ಪಾಟ್ನಾ ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ (PMC) - ಪಾಟ್ನಾ',
            'central': 'ಕೇಂದ್ರ ನಗರ ನಿರ್ವಾಹಕರು (ಮಾಸ್ಟರ್ ವೀಕ್ಷಣೆ)'
        },
        'authModal': {
            'branchDropdown': 'ಮುನ್ಸಿಪಲ್ ಶಾಖೆಯ ಡ್ರಾಪ್‌ಡೌನ್',
            'corpHead': 'ಕಾರ್ಪೊರೇಷನ್ ಮುಖ್ಯಸ್ಥ'
        }
    },
    'hi': {
        'landing': {
            'faqTitle': 'अक्सर पूछे जाने वाले प्रश्न',
            'about': {
                'title': 'राष्ट्रीय नागरिक निवारण पहल के बारे में',
                'desc': 'नागरिकों को सीधे नगर निगमों से जोड़ने वाला एक स्वचालित, उच्च-सटीकता टेलीमेट्री मैपिंग इंटरफ़ेस। सिटी वर्कर फील्ड डिस्पैच समय को अनुकूलित करने के लिए लाइव डेटा डी-डुप्लीकेशन पाइपलाइन द्वारा संचालित।'
            },
            'stats': {
                'activeDispatches': 'सक्रिय प्रेषण',
                'resolutionEfficiency': 'समाधान दक्षता'
            },
            'footer': {
                'explore': 'अन्वेषण करें',
                'dashboard': 'डैशबोर्ड',
                'coverageMaps': 'कवरेज मानचित्र',
                'liveFeeds': 'लाइव फ़ीड',
                'regionalImpact': 'क्षेत्रीय प्रभाव',
                'learnHelp': 'सीखें और मदद लें',
                'supportDesk': 'सहायता डेस्क',
                'documentation': 'प्रलेखन',
                'systemStatus': 'सिस्टम स्थिति',
                'municipalPartners': 'भागीदार',
                'bbmpCommand': 'BBMP कमांड सेंटर',
                'bmcCentral': 'BMC सेंट्रल ज़ोन',
                'urbanDevMinistry': 'शहरी विकास मंत्रालय',
                'termsPolicy': 'नियम और नीति',
                'termsOfService': 'सेवा की शर्तें',
                'privacyPolicy': 'गोपनीयता नीति',
                'dataRetention': 'डेटा प्रतिधारण दिशानिर्देश'
            }
        },
        'corps': {
            'BMC': 'बृहन्मुंबई नगर निगम (BMC) - मुंबई',
            'MCD': 'दिल्ली नगर निगम (MCD) - दिल्ली',
            'GCC': 'ग्रेटर चेन्नई कॉर्पोरेशन (GCC) - चेन्नई',
            'GHMC': 'ग्रेटर हैदराबाद नगर निगम (GHMC) - हैदराबाद',
            'KMC': 'कोलकाता नगर निगम (KMC) - कोलकाता',
            'BCCMC': 'बेंगलुरु केंद्रीय नगर निगम (BCCMC) - बेंगलुरु',
            'AMC': 'अहमदाबाद नगर निगम (AMC) - अहमदाबाद',
            'PMC_PUNE': 'पुणे नगर निगम (PMC) - पुणे',
            'SMC': 'सूरत नगर निगम (SMC) - सूरत',
            'JMC': 'जयपुर नगर निगम (JMC) - जयपुर',
            'LMC': 'लखनऊ नगर निगम (LMC) - लखनऊ',
            'PMC_PATNA': 'पटना नगर निगम (PMC) - पटना',
            'central': 'केंद्रीय शहर व्यवस्थापक (मास्टर दृश्य)'
        },
        'authModal': {
            'branchDropdown': 'नगर निगम शाखा ड्रॉपडाउन',
            'corpHead': 'निगम प्रमुख'
        }
    }
}

for lang, path in files.items():
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(new_keys[lang])
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated translation files.")
