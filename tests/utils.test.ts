import { describe, test, assert } from "matchstick-as/assembly/index"
import { getLength, hasArabic, hasDigit, hasEmoji, hasLetter, hasUnicode, isPalindrome, onlyArabic, onlyDigit, onlyEmoji, onlyLetter, onlyUnicode } from "../src/utils" 

describe("getLength()", () => {
    test("Should return 1", () => {
        const c = getLength("😀");
        assert.i32Equals(1, c); 
    }) 

    test("Should return 3", () => {
        const c = getLength("abc");
        assert.i32Equals(3, c); 
    }) 
})

describe("isPalindrome()", () => {
    test("Should return true", () => {
        const c = isPalindrome("abba");
        assert.booleanEquals(true, c); 
    })

    test("Should return false", () => {
        const c = isPalindrome("abc")
        assert.booleanEquals(false, c);
    })
})

describe("hasUnicode()", () => {
    test("Should return true", () => {
        const c = hasUnicode("🙏🙏🙏");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = hasUnicode("0918239079249")
        assert.booleanEquals(c, false);
    })
})

describe("onlyUnicode()", () => {
    test("Should return true", () => {
        const c = onlyUnicode("🙏🙏🙏");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = onlyUnicode("🙏🙏🙏213123xzv");
        assert.booleanEquals(c, false);
    })
})

describe("hasLetter()", () => {
    test("Should return true", () => {
        const c = hasLetter("0123mcvkn2134");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = hasLetter("0918239079249")
        assert.booleanEquals(c, false);
    })
})

describe("onlyLetter()", () => {
    test("Should return true", () => {
        const c = onlyLetter("abcdefghijklmnopqrstuvwxyz");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = onlyLetter("abcdefghijklmnopqrstuvwxyz12");
        assert.booleanEquals(c, false);
    })
})
 
describe("hasArabic()", () => {
    test("Should return true", () => {
        const c = hasArabic("ﶔﻆ");
        assert.booleanEquals(c, true);
    })

    test("Should return false", () => {
        const c = hasArabic("vitalik");
        assert.booleanEquals(c, false);
    })
})
 
describe("onlyArabic()", () => {
    test("Should return true", () => {
        const c = onlyArabic("ࢠࢻﱖﻶﮱࢤظ؏ࢮﱾﴥ");
        assert.booleanEquals(c, true);
    })

    test("Should return false", () => {
        const c = onlyArabic("vitaﻉlik");
        assert.booleanEquals(c, false);
    })
})


describe("hasDigit()", () => {
    test("Should return true", () => {
        const c = hasDigit("0123mcvkn2134");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = hasDigit("loremipsum")
        assert.booleanEquals(c, false);
    })
})

describe("onlyDigit()", () => {
    test("Should return true", () => {
        const c = onlyDigit("0123456789");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = onlyDigit("0123456789abc");
        assert.booleanEquals(c, false);
    })
})

describe("hasEmoji()", () => {
    test("Should return true", () => {
        const c = hasEmoji("🙏");
        assert.booleanEquals(c, true); 
    })

    test("Should return true", () => {
        const c = hasEmoji("💩💩💩💩");
        assert.booleanEquals(c, true); 
    })

    test("Should return false", () => {
        const c = hasEmoji("ࢠࢻ1231xcvvcﱖﻶ");
        assert.booleanEquals(c, false);
    })
})


describe("onlyEmoi()", () => {
    test("Should return true", () => {
        const c = onlyEmoji("😀");
        assert.booleanEquals(true, c); 
    })
 
    test("Should return false", () => {
        const c = onlyEmoji("a💩💩123");
        assert.booleanEquals(false, c);
    })
})


