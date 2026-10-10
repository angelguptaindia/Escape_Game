// Facility & Horror puzzle word database
// All words are strictly 4 to 12 letters.
const WORD_DATABASE = [
    // Tier 1: 4 to 6 Letters (Early Rooms)
    { word: "LOCK", category: "Security", hint: "Basic mechanism sealing doors." },
    { word: "GATE", category: "Security", hint: "Barrier at the sector perimeter." },
    { word: "TUBE", category: "Facility", hint: "Cylindrical transport vessel." },
    { word: "DARK", category: "Environment", hint: "Absence of light in subterranean sectors." },
    { word: "FEAR", category: "Psychology", hint: "Primal reaction to facility containment breach." },
    { word: "ACID", category: "Hazard", hint: "Corrosive chemical agent stored in vat B-4." },
    { word: "BLOOD", category: "Biohazard", hint: "Viscous red fluid spattered on the floor." },
    { word: "ALARM", category: "Security", hint: "High-decibel alert siren." },
    { word: "TOXIN", category: "Biohazard", hint: "Lethal nerve agent deployed during quarantine." },
    { word: "PANIC", category: "Psychology", hint: "Loss of mental control under pressure." },
    { word: "SHADOW", category: "Environment", hint: "Unseen presence moving in dark corridors." },
    { word: "VAULT", category: "Security", hint: "Reinforced room designed for maximum isolation." },
    { word: "CYANIDE", category: "Hazard", hint: "Rapid-acting chemical poison." },
    { word: "BUNKER", category: "Structure", hint: "Subterranean fortified enclosure." },
    { word: "HAZARD", category: "Security", hint: "Potential source of severe injury or death." },
    { word: "SCREAM", category: "Audio", hint: "High-pitched vocalization of terror." },
    { word: "SILENCE", category: "Environment", hint: "Eerie quiet preceding an attack." },
    { word: "MUTANT", category: "Biological", hint: "Genetically corrupted specimen." },
    { word: "OXYGEN", category: "Atmosphere", hint: "Essential gas slowly being purged from sector." },

    // Tier 2: 7 to 9 Letters (Intermediate Rooms)
    { word: "TERMINAL", category: "Facility", hint: "Computer access panel controlling doors." },
    { word: "PASSWORD", category: "Security", hint: "Authentication string required for override." },
    { word: "OVERRIDE", category: "System", hint: "Manual bypass of automated locks." },
    { word: "LOCKDOWN", category: "Protocol", hint: "Emergency containment procedure." },
    { word: "BIOHAZARD", category: "Hazard", hint: "Biological substance posing threat to health." },
    { word: "SECURITY", category: "System", hint: "Defensive perimeter network." },
    { word: "CHEMICAL", category: "Science", hint: "Compound used in facility research." },
    { word: "INFECTION", category: "Biohazard", hint: "Spread of biological pathogen." },
    { word: "PATHOGEN", category: "Science", hint: "Microorganism causing fatal disease." },
    { word: "PURGATORY", category: "Concept", hint: "Place of suffering between life and death." },
    { word: "SPECIMEN", category: "Research", hint: "Organism quarantined in cryo-pod 09." },
    { word: "CORRIDOR", category: "Facility", hint: "Long narrow passage connecting sectors." },
    { word: "CONTAINMENT", category: "Protocol", hint: "Preventing hazardous leak into facility." },
    { word: "RADIATION", category: "Hazard", hint: "Invisible lethal energy emitting from core." },
    { word: "CYBERNETIC", category: "Technology", hint: "Mechanized augmentations." },
    { word: "NIGHTMARE", category: "Psychology", hint: "Terrifying vision manifested in reality." },
    { word: "ISOLATION", category: "Protocol", hint: "Complete disconnection from external communications." },
    { word: "QUARANTINE", category: "Protocol", hint: "State of enforced isolation." },
    { word: "EVACUATE", category: "Protocol", hint: "Emergency order to vacate sector immediately." },
    { word: "HYDRAULIC", category: "Machinery", hint: "Fluid-powered door actuation system." },

    // Tier 3: 10 to 12 Letters (Advanced Rooms)
    { word: "DECONTAMINATE", category: "Protocol", hint: "Process of cleansing biological agents." },
    { word: "EXPERIMENTAL", category: "Research", hint: "Untested science conducted in Sub-level 5." },
    { word: "CATASTROPHE", category: "Event", hint: "Total systemic failure of facility reactor." },
    { word: "HALLUCINATION", category: "Psychology", hint: "False sensory perceptions caused by neurotoxin." },
    { word: "EXTERMINATE", category: "Protocol", hint: "Command to purge all living organisms in sector." },
    { word: "CLANDESTINE", category: "Security", hint: "Top-secret black site operation." },
    { word: "SURVEILLANCE", category: "Security", hint: "Closed-circuit camera monitoring system." },
    { word: "BIOCHEMISTRY", category: "Science", hint: "Study of chemical processes within living organisms." },
    { word: "TRANSMISSION", category: "Comms", hint: "Distressed audio signal sent into deep space." },
    { word: "NEUROLOGICAL", category: "Medical", hint: "Relating to nervous system damage from nerve gas." },
    { word: "PHANTASMAGORIA", category: "Psychology", hint: "Sequence of real or imaginary horror images." },
    { word: "MALFUNCTION", category: "System", hint: "Critical failure in door control circuit." },
    { word: "ANOMALOUS", category: "Classification", hint: "Deviating from known physical laws." },
    { word: "REINFORCED", category: "Structure", hint: "Heavy blast-shield plating." },
    { word: "INCINERATOR", category: "Facility", hint: "High-temperature waste disposal chamber." },
    { word: "UNIDENTIFIED", category: "Classification", hint: "Entity of unknown origin detected in sector." },
    { word: "SUBTERRANEAN", category: "Location", hint: "Situated 500 meters beneath earth surface." }
];

// Helper to fetch words based on room level
function getWordForRoom(roomNumber, usedWordsSet = new Set()) {
    let pool = [];
    if (roomNumber <= 3) {
        pool = WORD_DATABASE.filter(item => item.word.length <= 6);
    } else if (roomNumber <= 8) {
        pool = WORD_DATABASE.filter(item => item.word.length >= 6 && item.word.length <= 9);
    } else {
        pool = WORD_DATABASE.filter(item => item.word.length >= 9 && item.word.length <= 12);
    }

    let available = pool.filter(item => !usedWordsSet.has(item.word));
    if (available.length === 0) {
        available = WORD_DATABASE.filter(item => !usedWordsSet.has(item.word));
    }
    if (available.length === 0) {
        available = WORD_DATABASE; // reset pool if all used
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
}
