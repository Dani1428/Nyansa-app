const fs = require('fs');
const path = require('path');

const enNew = {
  "admin": {
    "common": {
      "notifications": "Notifications",
      "close": "Close"
    },
    "settings": {
      "desc": "Manage platform settings and API keys."
    },
    "missions": {
      "title": "Missions",
      "desc": "Manage data collection missions."
    }
  },
  "home": {
    "datasets": {
      "previews": "Dataset Previews",
      "title": "Explore Our Datasets",
      "desc": "Discover high-quality linguistic datasets for your AI models.",
      "browse_all": "Browse All Datasets",
      "language": "Language",
      "view_details": "View Details"
    },
    "specialization": {
      "title": "Our Specialization",
      "desc": "Expertise in African languages and agricultural domains.",
      "dialects": "Dialects",
      "fields": "Fields",
      "regional": "Regional",
      "value_chains": "Value Chains",
      "field_data": "Field Data",
      "field_data_desc": "Data collected directly from the field."
    }
  },
  "about": {
    "header": {
      "title": "About Us",
      "desc": "Empowering Africa through data."
    },
    "mission": {
      "title": "Our Mission",
      "desc": "To provide high-quality data for AI."
    },
    "vision": {
      "title": "Our Vision",
      "desc": "An AI-powered agricultural sector."
    },
    "stats": {
      "badge": "Stats",
      "title": "Our Impact",
      "s1_t": "Data Points",
      "s1_d": "Millions of data points collected.",
      "s2_t": "Languages",
      "s2_d": "Covering major African languages.",
      "s3_t": "Farmers",
      "s3_d": "Impacting thousands of farmers."
    }
  },
  "agriculture": {
    "ecosystem": {
      "crops": "Crops",
      "badge": "Ecosystem",
      "title": "Agricultural Ecosystem",
      "desc": "Connecting farmers and AI."
    },
    "hero": {
      "badge": "Agriculture",
      "title": "AI for Agriculture",
      "desc": "Revolutionizing farming with data.",
      "btn1": "Learn More",
      "btn2": "Get Started",
      "diag": "Diagnostics",
      "opt": "Optimization",
      "model": "Modeling",
      "voices": "Voices"
    },
    "bento": {
      "badge": "Features",
      "title": "Key Features",
      "image_t": "Image Analysis",
      "image_d": "Detect diseases from images.",
      "voices_t": "Voice Recognition",
      "voices_d": "Understand local dialects.",
      "diag_t": "Diagnosis",
      "diag_d": "Accurate crop diagnosis."
    },
    "impact": {
      "badge": "Impact",
      "title": "Real World Impact",
      "c1_t": "Yield",
      "c1_d": "Increased crop yields.",
      "c2_t": "Income",
      "c2_d": "Higher income for farmers.",
      "c3_t": "Sustainability",
      "c3_d": "Sustainable farming practices."
    }
  },
  "contact": {
    "form": {
      "success": "Message sent successfully!",
      "error": "Error sending message.",
      "server_error": "Server error. Please try again.",
      "title": "Contact Us",
      "name": "Name",
      "email": "Email",
      "company": "Company",
      "type": "Inquiry Type",
      "message": "Message",
      "submit": "Submit"
    },
    "header": {
      "badge": "Contact",
      "title": "Get in Touch",
      "desc": "We'd love to hear from you."
    },
    "info": {
      "whatsapp": "WhatsApp",
      "whatsapp_d": "Chat with us on WhatsApp.",
      "email_t": "Email Us",
      "hq_t": "Headquarters",
      "hq_desc": "Abidjan, Côte d'Ivoire",
      "hub_t": "Hub",
      "hub_d": "Tech Hub"
    }
  },
  "datasets": {
    "title": "Datasets",
    "desc": "Browse our collection of datasets.",
    "filters": {
      "lang": "Language",
      "type": "Type",
      "sector": "Sector"
    },
    "loading": "Loading datasets...",
    "card": {
      "request": "Request Access"
    },
    "banner": {
      "title": "Custom Datasets",
      "desc": "Need a custom dataset? Contact us.",
      "btn": "Contact Us"
    }
  },
  "languages": {
    "hero": {
      "badge": "Languages",
      "title": "Languages We Support",
      "desc": "Covering diverse dialects."
    },
    "grid": {
      "title": "Supported Languages",
      "desc": "A list of all supported languages.",
      "available": "Available",
      "request": {
        "title": "Request a Language",
        "desc": "Don't see your language? Let us know.",
        "button": "Request Language"
      }
    },
    "tech": {
      "title": "Technology",
      "desc": "Our language processing technology.",
      "accuracy": {
        "title": "High Accuracy",
        "desc": "Industry-leading accuracy."
      },
      "audio": {
        "title": "Audio Processing",
        "desc": "Advanced audio processing."
      }
    }
  },
  "privacy": {
    "last_updated": "Last Updated: April 2026",
    "intro": "Welcome to our Privacy Policy.",
    "sections": {
      "data_collection": {
        "title": "Data Collection",
        "content": "We collect data to improve our services."
      },
      "rights": {
        "title": "Your Rights",
        "content": "You have the right to access and delete your data."
      },
      "legal_basis": {
        "title": "Legal Basis",
        "content": "We process data based on consent and legitimate interest."
      },
      "retention": {
        "title": "Data Retention",
        "content": "We retain data for as long as necessary."
      },
      "contact": {
        "title": "Contact Us",
        "content": "Contact us for privacy concerns."
      }
    }
  },
  "services": {
    "header": {
      "badge": "Services",
      "title": "Our Services",
      "desc": "What we offer."
    },
    "text": {
      "title": "Text Services",
      "desc": "Text data services.",
      "entity": "Entity Extraction",
      "translation": "Translation",
      "accuracy": "High accuracy text processing."
    },
    "audio": {
      "stream": "Audio Stream",
      "title": "Audio Services",
      "desc": "Audio data services.",
      "f1": "Transcription",
      "f2": "Voice Recognition",
      "f3": "Audio Analysis"
    },
    "image": {
      "title": "Image Services",
      "desc": "Image data services.",
      "box": "Bounding Boxes",
      "box_desc": "Object detection.",
      "seg": "Segmentation",
      "seg_desc": "Image segmentation."
    },
    "pipeline": {
      "title": "Our Pipeline",
      "desc": "How we process data.",
      "s1_t": "Collection",
      "s1_d": "Data collection.",
      "s2_t": "Annotation",
      "s2_d": "Data annotation.",
      "s3_t": "Validation",
      "s3_d": "Data validation.",
      "s4_t": "Delivery",
      "s4_d": "Data delivery."
    },
    "cta": {
      "title": "Ready to Start?",
      "btn1": "Contact Us",
      "btn2": "View Datasets"
    }
  }
};

const frNew = {
  "admin": {
    "common": {
      "notifications": "Notifications",
      "close": "Fermer"
    },
    "settings": {
      "desc": "Gérer les paramètres et les clés API."
    },
    "missions": {
      "title": "Missions",
      "desc": "Gérer les missions de collecte de données."
    }
  },
  "home": {
    "datasets": {
      "previews": "Aperçus des Datasets",
      "title": "Explorez Nos Datasets",
      "desc": "Découvrez des datasets linguistiques de haute qualité.",
      "browse_all": "Voir Tous les Datasets",
      "language": "Langue",
      "view_details": "Voir les Détails"
    },
    "specialization": {
      "title": "Notre Spécialisation",
      "desc": "Expertise dans les langues africaines et l'agriculture.",
      "dialects": "Dialectes",
      "fields": "Champs",
      "regional": "Régional",
      "value_chains": "Chaînes de Valeur",
      "field_data": "Données Terrain",
      "field_data_desc": "Données collectées directement sur le terrain."
    }
  },
  "about": {
    "header": {
      "title": "À Propos",
      "desc": "Autonomiser l'Afrique par les données."
    },
    "mission": {
      "title": "Notre Mission",
      "desc": "Fournir des données de qualité pour l'IA."
    },
    "vision": {
      "title": "Notre Vision",
      "desc": "Une agriculture propulsée par l'IA."
    },
    "stats": {
      "badge": "Statistiques",
      "title": "Notre Impact",
      "s1_t": "Points de Données",
      "s1_d": "Des millions de données collectées.",
      "s2_t": "Langues",
      "s2_d": "Couvrant les langues majeures.",
      "s3_t": "Agriculteurs",
      "s3_d": "Impactant des milliers d'agriculteurs."
    }
  },
  "agriculture": {
    "ecosystem": {
      "crops": "Cultures",
      "badge": "Écosystème",
      "title": "Écosystème Agricole",
      "desc": "Connecter les agriculteurs et l'IA."
    },
    "hero": {
      "badge": "Agriculture",
      "title": "L'IA pour l'Agriculture",
      "desc": "Révolutionner l'agriculture avec les données.",
      "btn1": "En Savoir Plus",
      "btn2": "Commencer",
      "diag": "Diagnostics",
      "opt": "Optimisation",
      "model": "Modélisation",
      "voices": "Voix"
    },
    "bento": {
      "badge": "Fonctionnalités",
      "title": "Caractéristiques Clés",
      "image_t": "Analyse d'Image",
      "image_d": "Détecter les maladies.",
      "voices_t": "Reconnaissance Vocale",
      "voices_d": "Comprendre les dialectes.",
      "diag_t": "Diagnostic",
      "diag_d": "Diagnostic précis des cultures."
    },
    "impact": {
      "badge": "Impact",
      "title": "Impact Réel",
      "c1_t": "Rendement",
      "c1_d": "Rendements accrus.",
      "c2_t": "Revenu",
      "c2_d": "Revenus plus élevés.",
      "c3_t": "Durabilité",
      "c3_d": "Pratiques durables."
    }
  },
  "contact": {
    "form": {
      "success": "Message envoyé avec succès !",
      "error": "Erreur lors de l'envoi.",
      "server_error": "Erreur serveur. Veuillez réessayer.",
      "title": "Nous Contacter",
      "name": "Nom",
      "email": "Email",
      "company": "Entreprise",
      "type": "Type de demande",
      "message": "Message",
      "submit": "Envoyer"
    },
    "header": {
      "badge": "Contact",
      "title": "Prendre Contact",
      "desc": "Nous serions ravis d'échanger avec vous."
    },
    "info": {
      "whatsapp": "WhatsApp",
      "whatsapp_d": "Discutez avec nous.",
      "email_t": "Email",
      "hq_t": "Siège",
      "hq_desc": "Abidjan, Côte d'Ivoire",
      "hub_t": "Hub",
      "hub_d": "Hub Technologique"
    }
  },
  "datasets": {
    "title": "Datasets",
    "desc": "Parcourez nos datasets.",
    "filters": {
      "lang": "Langue",
      "type": "Type",
      "sector": "Secteur"
    },
    "loading": "Chargement...",
    "card": {
      "request": "Demander l'accès"
    },
    "banner": {
      "title": "Datasets Sur Mesure",
      "desc": "Besoin d'un dataset personnalisé ?",
      "btn": "Nous Contacter"
    }
  },
  "languages": {
    "hero": {
      "badge": "Langues",
      "title": "Langues Supportées",
      "desc": "Couvrant divers dialectes."
    },
    "grid": {
      "title": "Langues Disponibles",
      "desc": "Liste des langues.",
      "available": "Disponible",
      "request": {
        "title": "Demander une Langue",
        "desc": "Votre langue n'y est pas ?",
        "button": "Demander"
      }
    },
    "tech": {
      "title": "Technologie",
      "desc": "Notre technologie linguistique.",
      "accuracy": {
        "title": "Haute Précision",
        "desc": "Précision de pointe."
      },
      "audio": {
        "title": "Traitement Audio",
        "desc": "Traitement avancé."
      }
    }
  },
  "privacy": {
    "last_updated": "Dernière Mise à Jour : Avril 2026",
    "intro": "Bienvenue dans notre politique de confidentialité.",
    "sections": {
      "data_collection": {
        "title": "Collecte de Données",
        "content": "Nous collectons des données pour améliorer nos services."
      },
      "rights": {
        "title": "Vos Droits",
        "content": "Vous avez le droit d'accéder à vos données."
      },
      "legal_basis": {
        "title": "Base Légale",
        "content": "Traitement basé sur le consentement."
      },
      "retention": {
        "title": "Conservation",
        "content": "Conservation selon nécessité."
      },
      "contact": {
        "title": "Contact",
        "content": "Contactez-nous pour toute question."
      }
    }
  },
  "services": {
    "header": {
      "badge": "Services",
      "title": "Nos Services",
      "desc": "Ce que nous offrons."
    },
    "text": {
      "title": "Services Texte",
      "desc": "Services de données textuelles.",
      "entity": "Extraction d'Entités",
      "translation": "Traduction",
      "accuracy": "Haute précision."
    },
    "audio": {
      "stream": "Flux Audio",
      "title": "Services Audio",
      "desc": "Services de données vocales.",
      "f1": "Transcription",
      "f2": "Reconnaissance",
      "f3": "Analyse"
    },
    "image": {
      "title": "Services Image",
      "desc": "Services de données visuelles.",
      "box": "Bounding Boxes",
      "box_desc": "Détection d'objets.",
      "seg": "Segmentation",
      "seg_desc": "Segmentation d'images."
    },
    "pipeline": {
      "title": "Notre Pipeline",
      "desc": "Comment nous traitons les données.",
      "s1_t": "Collecte",
      "s1_d": "Collecte de données.",
      "s2_t": "Annotation",
      "s2_d": "Annotation experte.",
      "s3_t": "Validation",
      "s3_d": "Double validation.",
      "s4_t": "Livraison",
      "s4_d": "Livraison sécurisée."
    },
    "cta": {
      "title": "Prêt à Démarrer ?",
      "btn1": "Contact",
      "btn2": "Voir Datasets"
    }
  }
};

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const frPath = path.join(__dirname, 'src', 'locales', 'fr.json');

const enCurrent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const frCurrent = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const enMerged = deepMerge(enCurrent, enNew);
const frMerged = deepMerge(frCurrent, frNew);

fs.writeFileSync(enPath, JSON.stringify(enMerged, null, 2));
fs.writeFileSync(frPath, JSON.stringify(frMerged, null, 2));

console.log("Locales updated successfully!");
