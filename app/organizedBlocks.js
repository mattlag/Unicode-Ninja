
let organizedScripts = {
    'European Scripts': {
        'Latin': {
            'Basic Latin Controls': 'r-0000-001F',
            'Basic Latin': 'r-0020-007F',
            'Latin-1 Supplement': 'r-0080-00FF',
            'Latin Extended-A': 'r-0100-017F',
            'Latin Extended-B': 'r-0180-024F',
            'Latin Extended-C': 'r-2C60-2C7F',
            'Latin Extended-D': 'r-A720-A7FF',
            'Latin Extended-E': 'r-AB30-AB6F',
            'Latin Extended Additional': 'r-1E00-1EFF',
            'IPA Extensions': 'r-0250-02AF',
            'Phonetic Extensions': 'r-1D00-1D7F',
            'Phonetic Extensions Supplement': 'r-1D80-1DBF',
        },
        'Armenian': 'r-0530-058F',
        'Cyrillic': {
            'Cyrillic': 'r-0400-04FF',
            'Cyrillic Supplement': 'r-0500-052F',
            'Cyrillic Extended-A': 'r-2DE0-2DFF',
            'Cyrillic Extended-B': 'r-A640-A69F',
            'Cyrillic Extended-C': 'r-1C80-1C8F',
        },
        'Georgian': {
            'Georgian': 'r-10A0-10FF',
            'Georgian Extended': 'r-1C90-1CBF',
            'Georgian Supplement': 'r-2D00-2D2F',
        },
        'Glagolitic': 'r-2C00-2C5F',
        'Greek': {
            'Greek': 'r-0370-03FF',
            'Greek Extended': 'r-1F00-1FFF',
        },
        'Ogham': 'r-1680-169F',
        'Runic': 'r-16A0-16FF',
    },

    'Modifier Letters': {
        'Modifier Tone Letters': 'r-A700-A71F',
        'Spacing Modifier Letters': 'r-02B0-02FF',
        'Superscripts and Subscripts': 'r-2070-209F',
    },

    'Combining Marks': {
        'Combining Diacritical Marks': {
            'Combining Diacritical Marks': 'r-0300-036F',
            'Combining Diacritical Marks Extended': 'r-1AB0-1AFF',
            'Combining Diacritical Marks Supplement': 'r-1DC0-1DFF',
        },
        'Combining Diacritical Marks for Symbols': 'r-20D0-20FF',
        'Combining Half Marks': 'r-FE20-FE2F',
    },

    'African Scripts': {
        'Bamum': 'r-A6A0-A6FF',
        'Coptic': 'r-2C80-2CFF',
        'Ethiopic': {
            'Ethiopic': 'r-1200-137F',
            'Ethiopic Supplement': 'r-1380-139F',
            'Ethiopic Extended': 'r-2D80-2DDF',
            'Ethiopic Extended-A': 'r-AB00-AB2F',
        },
        'NKo': 'r-07C0-07FF',
        'Tifinagh': 'r-2D30-2D7F',
        'Vai': 'r-A500-A63F',
    },

    'Middle Eastern Scripts': {
        'Arabic': {
            'Arabic': 'r-0600-06FF',
            'Arabic Supplement': 'r-0750-077F',
            'Arabic Extended-A': 'r-08A0-08FF',
            'Arabic Presentation Forms-A': 'r-FB50-FDFF',
            'Arabic Presentation Forms-B': 'r-FE70-FEFF',
        },
        'Hebrew': 'r-0590-05FF',
        'Mandaic': 'r-0840-085F',
        'Samaritan': 'r-0800-083F',
        'Syriac': {
            'Syriac': 'r-0700-074F',
            'Syriac Supplement': 'r-0860-086F',
        },
    },

    'Central Asian Scripts': {
        'Mongolian': 'r-1800-18AF',
        'Phags-Pa': 'r-A840-A87F',
        'Tibetan': 'r-0F00-0FFF',
    },

    'South Asian Scripts': {
        'Bengali and Assamese': 'r-0980-09FF',
        'Devanagari': {
            'Devanagari': 'r-0900-097F',
            'Devanagari Extended': 'r-A8E0-A8FF',
        },
        'Gujarati': 'r-0A80-0AFF',
        'Gurmukhi': 'r-0A00-0A7F',
        'Kannada': 'r-0C80-0CFF',
        'Lepcha': 'r-1C00-1C4F',
        'Limbu': 'r-1900-194F',
        'Malayalam': 'r-0D00-0D7F',
        'Meetei Mayek': {
            'Meetei Mayek': 'r-ABC0-ABFF',
            'Meetei Mayek Extensions': 'r-AAE0-AAFF',
        },
        'Ol Chiki': 'r-1C50-1C7F',
        'Oriya': 'r-0B00-0B7F',
        'Saurashtra': 'r-A880-A8DF',
        'Sinhala': 'r-0D80-0DFF',
        'Syloti Nagri': 'r-A800-A82F',
        'Tamil': 'r-0B80-0BFF',
        'Telugu': 'r-0C00-0C7F',
        'Thaana': 'r-0780-07BF',
        'Vedic Extensions': 'r-1CD0-1CFF',
    },

    'Southeast Asian Scripts': {
        'Cham': 'r-AA00-AA5F',
        'Kayah Li': 'r-A900-A92F',
        'Khmer': {
            'Khmer': 'r-1780-17FF',
            'Khmer Symbols': 'r-19E0-19FF',
        },
        'Lao': 'r-0E80-0EFF',
        'Myanmar': {
            'Myanmar': 'r-1000-109F',
            'Myanmar Extended-A': 'r-AA60-AA7F',
            'Myanmar Extended-B': 'r-A9E0-A9FF',
        },
        'New Tai Lue': 'r-1980-19DF',
        'Tai Le': 'r-1950-197F',
        'Tai Tham': 'r-1A20-1AAF',
        'Tai Viet': 'r-AA80-AADF',
        'Thai': 'r-0E00-0E7F',
    },

    'Indonesia &amp; Oceania Scripts': {
        'Balinese': 'r-1B00-1B7F',
        'Batak': 'r-1BC0-1BFF',
        'Buginese': 'r-1A00-1A1F',
        'Buhid': 'r-1740-175F',
        'Hanunoo': 'r-1720-173F',
        'Javanese': 'r-A980-A9DF',
        'Rejang': 'r-A930-A95F',
        'Sundanese': {
            'Sundanese': 'r-A930-A95F',
            'Sundanese Supplement': 'r-1CC0-1CCF',
        },
        'Tagalog': 'r-1700-171F',
        'Tagbanwa': 'r-1760-177F',
    },

    'East Asian Scripts': {
        'Bopomofo': 'r-3100-312F',
        'Bopomofo Extended': 'r-31A0-31BF',
        'CJK': {
            'CJK Unified Ideographs': 'r-4E00-9FFF',
            'CJK Extension-A': 'r-3400-4DBF',
            'CJK Compatibility Ideographs': 'r-F900-FAFF',
            'CJK Radicals / KangXi Radicals': 'r-2F00-2FDF',
            'CJK Radicals Supplement': 'r-2E80-2EFF',
            'CJK Strokes': 'r-31C0-31EF',
            'Ideographic Description Characters': 'r-2FF0-2FFF',
        },
        'Hangul': {
            'Hangul Jamo': 'r-1100-11FF',
            'Hangul Jamo Extended-A': 'r-A960-A97F',
            'Hangul Jamo Extended-B': 'r-D7B0-D7FF',
            'Hangul Compatibility Jamo': 'r-3130-318F',
            'Hangul Syllables': 'r-AC00-D7AF',
        },
        'Japanese': {
            'Hiragana': 'r-3040-309F',
            'Kanbun': 'r-3190-319F',
            'Katakana': 'r-30A0-30FF',
            'Katakana Phonetic Extensions': 'r-31F0-31FF',
        },
        'Lisu': 'r-A4D0-A4FF',
        'Yi': {
            'Yi Syllables': 'r-A000-A48F',
            'Yi Radicals': 'r-A490-A4CF',
        },
    },

    'American Scripts': {
        'Cherokee': {
            'Cherokee': 'r-13A0-13FF',
            'Cherokee Supplement': 'r-AB70-ABBF',
        },
        'Unified Canadian Aboriginal Syllabics': {
            'Unified Canadian Aboriginal Syllabics': 'r-1400-167F',
            'Unified Canadian Aboriginal Syllabics Extended': 'r-18B0-18FF',
        },
    },

    'Other': {
        'Alphabetic Presentation Forms': 'r-FB00-FB4F',
        'Halfwidth and Fullwidth Forms': 'r-FF00-FFEF',
    },
};

let organizedSymbols = {
    'Notational Systems': {
        'Braille Patterns': 'r-2800-28FF',
    },

    'Punctuation': {
        'General Punctuation': {
            'General Punctuation': 'r-2000-206F',
            'Supplemental Punctuation': 'r-2E00-2E7F',
        },
        'CJK Symbols and Punctuation': 'r-3000-303F',
        'CJK Compatibility Forms': {
            'CJK Compatibility Forms': 'r-FE30-FE4F',
            'Halfwidth and Fullwidth Forms': 'r-FF00-FFEF',
            'Small Form Variants': 'r-FE50-FE6F',
            'Vertical Forms': 'r-FE10-FE1F',
        },
    },

    'Alphanumeric Symbols': {
        'Letterlike Symbols': 'r-2100-214F',
        'Enclosed Alphanumerics': 'r-2460-24FF',
        'Enclosed CJK Letters and Months': 'r-3200-32FF',
        'CJK Compatibility': 'r-3300-33FF',
    },

    'Technical Symbols': {
        'Control Pictures': 'r-2400-243F',
        'Miscellaneous Technical': 'r-2300-23FF',
        'Optical Character Recognition': 'r-2440-245F',
    },

    'Numbers &amp; Digits': {
        'Common Indic Number Forms': 'r-A830-A83F',
        'Number Forms': 'r-2150-218F',
        'Super and Subscripts': 'r-2070-209F',
    },

    'Mathematical Symbols': {
        'Arrows': {
            'Arrows': 'r-2190-21FF',
            'Supplemental Arrows-A': 'r-27F0-27FF',
            'Supplemental Arrows-B': 'r-2900-297F',
            'Miscellaneous Symbols and Arrows': 'r-2B00-2BFF',
            'Letterlike Symbols': 'r-2100-214F',
        },
        'Mathematical Operators': {
            'Mathematical Operators': 'r-2200-22FF',
            'Supplemental Mathematical Operators': 'r-2A00-2AFF',
            'Miscellaneous Mathematical Symbols-A': 'r-27C0-27EF',
            'Miscellaneous Mathematical Symbols-B': 'r-2980-29FF',
        },
        'Geometric Shapes': {
            'Geometric Shapes': 'r-25A0-25FF',
            'Miscellaneous Symbols and Arrows': 'r-2B00-2BFF',
            'Box Drawing': 'r-2500-257F',
            'Block Elements': 'r-2580-259F',
        },
    },

    'Emoji &amp; Pictographs': {
        'Dingbats': 'r-2700-27BF',
        'Miscellaneous Symbols': 'r-2600-26FF',
    },

    'Other Symbols': {
        'Currency Symbols': 'r-20A0-20CF',
        'Miscellaneous Symbols and Arrows': 'r-2B00-2BFF',
        'Yijing Hexagram Symbols': 'r-4DC0-4DFF',
    },

    'Specials': {
        'Specials': 'r-FFF0-FFFF',
        'Variation Selectors': 'r-FE00-FE0F',
    },

    'Private Use': {
        'Private Use Area': 'r-E000-F8FF',
    },

    'Surrogates': {
        'High Surrogates': 'r-D800-DB7F',
        'High Private Use Surrogates': 'r-DB80-DBFF',
        'Low Surrogates': 'r-DC00-DFFF',
    },
};