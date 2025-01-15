const disallowedWords: string[] = [
    "fuck",
    "shit",
    "cunt",
    "cum",
    "jizz",
    "slut",
    "asshole",
    "pussy",
    "vagina",
    "dick",
    "cock",
    "penis",
    "nigger",
    "nazi",
    "murder",
    "kill",
    "torture",
    "blood",
    "dismember",
    "nudity",
    "porn",
    "sex",
    "erotic",
    "fetish",
    "nude",
    "hentai",
    "BDSM",
    "explicit",
    "lewd",
    "topless",
    "lingerie",
    "gore",
    "execution",
    "stabbing",
    "brutality",
    "mutilation",
    "kike",
    "faggot",
    "chink",
    "wetback",
    "sandnigger",
    "genocide",
    "twink",
    "drugs",
    "cocaine",
    "heroin",
    "meth",
    "LSD",
    "weed",
    "marijuana",
    "trafficking",
    "suicide",
    "teen",
    "young",
    "child",
    "baby",
    "toddler",
    "self-harm",
    "pedophilia",
    "incest",
    "beastiality",
    "bestiality",
    "necrophilia",
    "cannibalism",
    "tits",
    "naked",
    "breast",
    "boobies",
    "rack",
    "melons",
    "hooters",
    "jugs",
    "cans",
    "knockers",
    "tatas",
    "bust",
    "bazoombas",
    "bazookas",
    "funbags",
    "pillows",
    "puppies",
    "torpedoes",
    "gazongas",
    "bosom",
    "cleavage",
    "vulva",
    "genitals",
    "clitoris",
    "labia",
    "pubic",
    "vajayjay",
    "cooch",
    "coochie",
    "hooha",
    "snatch",
    "beaver",
    "poontang",
    "testicles",
    "phallus",
    "scrotum",
    "pecker",
    "dong",
    "johnson",
    "schlong",
    "willy",
    "weiner",
    "rod",
    "member",
    "shaft",
    "meatstick",
    "bare",
    "unclothed",
    "exposed"
];


/**
 * Validates the input against a list of disallowed words.
 * @param input - The input to validate, either a string or an object.
 * @returns True if the input does not contain disallowed words, false otherwise.
 */
const validateInput = (input: unknown): boolean => {
    if (typeof input === "string") {
        
        const lowerCaseInput = input.toLowerCase();
        return !disallowedWords.some(word => lowerCaseInput.includes(word.toLowerCase()));
    }

    if (typeof input === "object" && input !== null) {
        
        return !Object.values(input).some(value =>
            typeof value === "string" &&
            disallowedWords.some(word =>
                value.toLowerCase().includes(word.toLowerCase())
            )
        );
    }

    return true; 
}


export { validateInput };


