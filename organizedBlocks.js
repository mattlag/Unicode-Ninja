
let organizedScripts = {
    'European Scripts': {
        'Armenian': '0530-058F',
        'Cyrillic': {
            'Cyrillic': '0400-04FF',
            'Cyrillic Supplement': '0500-052F',
            'Cyrillic Extended-A': '2DE0-2DFF',
            'Cyrillic Extended-B': 'A640-A69F',
            'Cyrillic Extended-C': '1C80-1C8F',
        },
        'Georgian': {
            'Georgian': '10A0-10FF',
            'Georgian Extended': '1C90-1CBF',
            'Georgian Supplement': '2D00-2D2F',
        },
        'Glagolitic': '2C00-2C5F',
        'Greek': {
            'Greek': '0370-03FF',
            'Greek Extended': '1F00-1FFF',
        },
        'Latin': {
            'Basic Latin': '0000-007F',
            'Latin-1 Supplement': '0080-00FF',
            'Latin Extended-A': '0100-017F',
            'Latin Extended-B': '0180-024F',
            'Latin Extended-C': '2C60-2C7F',
            'Latin Extended-D': 'A720-A7FF',
            'Latin Extended-E': 'AB30-AB6F',
            'Latin Extended Additional': '1E00-1EFF',
            'IPA Extensions': '0250-02AF',
            'Phonetic Extensions': '1D00-1D7F',
            'Phonetic Extensions Supplement': '1D80-1DBF',
        },
        'Ogham': '1680-169F',
        'Runic': '16A0-16FF',
    },

    'Modifier Letters': {
        'Modifier Tone Letters': 'A700-A71F',
        'Spacing Modifier Letters': '02B0-02FF',
        'Superscripts and Subscripts': '2070-209F',
    },

    'Combining Marks': {
        'Combining Diacritical Marks': {
            'Combining Diacritical Marks': '0300-036F',
            'Combining Diacritical Marks Extended': '1AB0-1AFF',
            'Combining Diacritical Marks Supplement': '1DC0-1DFF',
        },
        'Combining Diacritical Marks for Symbols': '20D0-20FF',
        'Combining Half Marks': 'FE20-FE2F',
    },

    'African Scripts': {
        'Bamum': 'A6A0-A6FF',
        'Coptic': '2C80-2CFF',
        'Ethiopic': {
            'Ethiopic': '1200-137F',
            'Ethiopic Supplement': '1380-139F',
            'Ethiopic Extended': '2D80-2DDF',
            'Ethiopic Extended-A': 'AB00-AB2F',
        },
        'NKo': '07C0-07FF',
        'Tifinagh': '2D30-2D7F',
        'Vai': 'A500-A63F',
    },

    'Middle Eastern Scripts': {
        'Arabic': {
            'Arabic': '0600-06FF',
            'Arabic Supplement': '0750-077F',
            'Arabic Extended-A': '08A0-08FF',
            'Arabic Presentation Forms-A': 'FB50-FDFF',
            'Arabic Presentation Forms-B': 'FE70-FEFF',
        },
        'Hebrew': '0590-05FF',
        'Mandaic': '0840-085F',
        'Samaritan': '0800-083F',
        'Syriac': {
            'Syriac': '0700-074F',
            'Syriac Supplement': '0860–086F',
        },
    },

    'Central Asian Scripts': {
        'Mongolian': '1800-18AF',
        'Phags-Pa': 'A840-A87F',
        'Tibetan': '0F00-0FFF',
    },

    'South Asian Scripts': {
        'Bengali and Assamese': '0980-09FF',
        'Devanagari': {
            'Devanagari': '0900-097F',
            'Devanagari Extended': 'A8E0-A8FF',
        },
        'Gujarati': '0A80-0AFF',
        'Gurmukhi': '0A00-0A7F',
        'Kannada': '0C80-0CFF',
        'Lepcha': '1C00-1C4F',
        'Limbu': '1900-194F',
        'Malayalam': '0D00-0D7F',
        'Meetei Mayek': {
            'Meetei Mayek': 'ABC0-ABFF',
            'Meetei Mayek Extensions': 'AAE0-AAFF',
        },
        'Ol Chiki': '1C50-1C7F',
        'Oriya': '0B00-0B7F',
        'Saurashtra': 'A880-A8DF',
        'Sinhala': '0D80-0DFF',
        'Syloti Nagri': 'A800-A82F',
        'Tamil': '0B80-0BFF',
        'Telugu': '0C00-0C7F',
        'Thaana': '0780-07BF',
        'Vedic Extensions': '1CD0-1CFF',
    },

    'Southeast Asian Scripts': {
        'Cham': 'AA00-AA5F',
        'Kayah Li': 'A900-A92F',
        'Khmer': {
            'Khmer': '1780-17FF',
            'Khmer Symbols': '19E0-19FF',
        },
        'Lao': '0E80-0EFF',
        'Myanmar': {
            'Myanmar': '1000-109F',
            'Myanmar Extended-A': 'AA60-AA7F',
            'Myanmar Extended-B': 'A9E0-A9FF',
        },
        'New Tai Lue': '1980-19DF',
        'Tai Le': '1950-197F',
        'Tai Tham': '1A20-1AAF',
        'Tai Viet': 'AA80-AADF',
        'Thai': '0E00-0E7F',
    },

    'Indonesia &amp; Oceania Scripts': {
        'Balinese': '1B00-1B7F',
        'Batak': '1BC0-1BFF',
        'Buginese': '1A00-1A1F',
        'Buhid': '1740-175F',
        'Hanunoo': '1720-173F',
        'Javanese': 'A980-A9DF',
        'Rejang': 'A930-A95F',
        'Sundanese': {
            'Sundanese': 'A930-A95F',
            'Sundanese Supplement': '1CC0-1CCF',
        },
        'Tagalog': '1700-171F',
        'Tagbanwa': '1760-177F',
    },

    'East Asian Scripts': {
        'Bopomofo': '3100-312F',
        'Bopomofo Extended': '31A0-31BF',
        'CJK': {
            'CJK Unified Ideographs': '4E00-9FFF',
            'CJK Extension-A': '3400-4DBF',
            'CJK Compatibility Ideographs': 'F900-FAFF',
            'CJK Radicals / KangXi Radicals': '2F00-2FDF',
            'CJK Radicals Supplement': '2E80-2EFF',
            'CJK Strokes': '31C0-31EF',
            'Ideographic Description Characters': '2FF0-2FFF',
        },
        'Hangul': {
            'Hangul Jamo': '1100-11FF',
            'Hangul Jamo Extended-A': 'A960-A97F',
            'Hangul Jamo Extended-B': 'D7B0-D7FF',
            'Hangul Compatibility Jamo': '3130-318F',
            'Hangul Syllables': 'AC00-D7AF',
        },
        'Japanese': {
            'Hiragana': '3040-309F',
            'Kanbun': '3190-319F',
            'Katakana': '30A0-30FF',
            'Katakana Phonetic Extensions': '31F0-31FF',
        },
        'Lisu': 'A4D0-A4FF',
        'Yi': {
            'Yi Syllables': 'A000-A48F',
            'Yi Radicals': 'A490-A4CF',
        },
    },

    'American Scripts': {
        'Cherokee': {
            'Cherokee': '13A0-13FF',
            'Cherokee Supplement': 'AB70-ABBF',
        },
        'Unified Canadian Aboriginal Syllabics': {
            'Unified Canadian Aboriginal Syllabics': '1400-167F',
            'Unified Canadian Aboriginal Syllabics Extended': '18B0-18FF',
        },
    },

    'Other': {
        'Alphabetic Presentation Forms': 'FB00-FB4F',
        'Halfwidth and Fullwidth Forms': 'FF00-FFEF',
    },
};

let organizedSymbols = {
    'Notational Systems': {
        'Braille Patterns': '2800-28FF',
    },

    'Punctuation': {
        'General Punctuation': {
            'General Punctuation': '2000-206F',
            'Supplemental Punctuation': '2E00-2E7F',
        },
        'CJK Symbols and Punctuation': '3000-303F',
        'CJK Compatibility Forms': {
            'CJK Compatibility Forms': 'FE30-FE4F',
            'Halfwidth and Fullwidth Forms': 'FF00-FFEF',
            'Small Form Variants': 'FE50-FE6F',
            'Vertical Forms': 'FE10-FE1F',
        },
    },

    'Alphanumeric Symbols': {
        'Letterlike Symbols': '2100-214F',
        'Enclosed Alphanumerics': '2460-24FF',
        'Enclosed CJK Letters and Months': '3200-32FF',
        'CJK Compatibility': '3300-33FF',
    },

    'Technical Symbols': {
        'Control Pictures': '2400-243F',
        'Miscellaneous Technical': '2300-23FF',
        'Optical Character Recognition': '2440-245F',
    },

    'Numbers &amp; Digits': {
        'Common Indic Number Forms': 'A830-A83F',
        'Number Forms': '2150-218F',
        'Super and Subscripts': '2070-209F',
    },

    'Mathematical Symbols': {
        'Arrows': {
            'Arrows': '2190-21FF',
            'Supplemental Arrows-A': '27F0-27FF',
            'Supplemental Arrows-B': '2900-297F',
            'Miscellaneous Symbols and Arrows': '2B00-2BFF',
            'Letterlike Symbols': '2100-214F',
        },
        'Mathematical Operators': {
            'Mathematical Operators': '2200-22FF',
            'Supplemental Mathematical Operators': '2A00-2AFF',
            'Miscellaneous Mathematical Symbols-A': '27C0-27EF',
            'Miscellaneous Mathematical Symbols-B': '2980-29FF',
        },
        'Geometric Shapes': {
            'Geometric Shapes': '25A0-25FF',
            'Miscellaneous Symbols and Arrows': '2B00-2BFF',
            'Box Drawing': '2500-257F',
            'Block Elements': '2580-259F',
        },
    },

    'Emoji &amp; Pictographs': {
        'Dingbats': '2700-27BF',
        'Miscellaneous Symbols': '2600-26FF',
    },

    'Other Symbols': {
        'Currency Symbols': '20A0-20CF',
        'Miscellaneous Symbols and Arrows': '2B00-2BFF',
        'Yijing Hexagram Symbols': '4DC0-4DFF',
    },

    'Specials': {
        'Specials': 'FFF0-FFFF',
        'Variation Selectors': 'FE00-FE0F',
    },

    'Private Use': {
        'Private Use Area': 'E000-F8FF',
    },

    'Surrogates': {
        'High Surrogates': 'D800-DBFF',
        'Low Surrogates': 'DC00-DFFF',
    },
};