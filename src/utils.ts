
import {
    BigInt,
    ByteArray,
    ethereum, 
    Bytes,
    log
  } from '@graphprotocol/graph-ts'


  
import { EMOJI_LIST } from './emoji-list'
 
export const EMPTY_NODE = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ROOT_NODE:ByteArray = byteArrayFromHex("93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae")
export const MAX_BYTE_LENGTH = 8191
export const BIG_INT_ZERO = BigInt.fromI32(0)
  
function decodeName (buf:Bytes):Array<string> {
  let offset = 0
  let list = Bytes.fromHexString('')
  let dot = Bytes.fromHexString('2e')
  let len = buf[offset++]
  let hex = buf.toHexString()
  let firstLabel = ''
  if (len === 0) {
    return [firstLabel, '.']
  }
  
  while (len) {
    let label = hex.slice((offset +1 ) * 2, (offset + 1 + len ) * 2)
    let labelBytes = Bytes.fromHexString(label)
  
    if(offset > 1){
      list = concat(list, dot)
    }else{
      firstLabel = labelBytes.toString()
    }
    list = concat(list, labelBytes)
    offset += len
    len = buf[offset++]
  }
  return [firstLabel, list.toString()]
}

export function createEventID(event:  ethereum.Event): Bytes {
    return Bytes.fromUTF8( event.block.number.toString().concat('-').concat(event.logIndex.toString() ));
}

export function createUniqueID(event:  ethereum.Event): string {
  return event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString())
}
 
export function concat(a: ByteArray, b: ByteArray): ByteArray {
  let out = new Uint8Array(a.length + b.length)
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i]
  }
  for (let j = 0; j < b.length; j++) {
    out[a.length + j] = b[j]
  }
  // return out as ByteArray
  return changetype<ByteArray>(out)
}
  
export function byteArrayFromHex(s: string): ByteArray {
  if(s.length % 2 !== 0) {
    throw new TypeError("Hex string must have an even number of characters")
  }
  let out = new Uint8Array(s.length / 2)
  for(var i = 0; i < s.length; i += 2) {
    out[i / 2] = parseInt(s.substring(i, i + 2), 16) as u32
  }
  return changetype<ByteArray>(out)
}
  
export function uint256ToByteArray(i: BigInt): ByteArray {
  let hex = i.toHex().slice(2).padStart(64, '0')
  return byteArrayFromHex(hex)
}

export function getLength(s: string): i32 {
  return s.split('').length
}
  
export function getSegmentLength(s: string): i32 {
  return s.length
}

export function decode_utf16_pair(units: number[]): number
{ 
    let code = 0x10000;
    code += (units[0] & 0x03FF) << 10;
    code += (units[1] & 0x03FF);
    return code;
}

export function isLetter(codePoint: number): bool {
  if(codePoint >= 0x0041 && codePoint <= 0x004F) return true;  
  if(codePoint >= 0x0050 && codePoint <= 0x005A) return true;  
  if(codePoint >= 0x0061 && codePoint <= 0x006F) return true;  
  if(codePoint >= 0x0070 && codePoint <= 0x007A) return true;  
  return false;
}

export function hasLetter(s: string): bool {
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(isLetter(codePoint)) return true;
  } 
  return false;
}

export function onlyLetter(s: string): bool {
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(!isLetter(codePoint)) return false;
  } 
  return true;
}
 
export function isDigit(codePoint: number): bool {
  if(codePoint >= 0x0030 && codePoint <= 0x0039) return true;  
  return false;
}

export function hasDigit(s: string): bool {
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(isDigit(codePoint)) return true;
  } 
  return false;
}

export function onlyDigit(s: string): bool {
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(!isDigit(codePoint)) return false;
  } 
  return true;
}

export function isAscii(codePoint: number): bool {
  if(codePoint >= 0x0000 && codePoint <= 0x00FF) return true;  
  return false;
}

export function hasUnicode(s: string): bool {
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(!isAscii(codePoint)) return true;
  } 
  return false;
}

export function onlyUnicode(s: string): bool {
  for(let i = 0; i < getLength(s); i++) {
    let codePoint = s.codePointAt(i);
    if(isAscii(codePoint)) return false;
  } 
  return true;
}

export function isEmoji(codePoint: number): bool {
  if(EMOJI_LIST.includes(codePoint)) return true;
  return false;
}

export function hasEmoji(s: string): bool { 
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(isEmoji(codePoint)) return true;
  } 
  return false;
}

export function onlyEmoji(s: string): bool { 
  for(let i = 0; i < getLength(s); i++) { 
    let codePoint = s.codePointAt(i);
    if(isEmoji(codePoint) == false) {
      return false;
    }
  } 
  return true;
}

export function isPalindrome(s: string): bool {
  return s == s.split('').reverse().join('').toString();
}
 
export function isArabic(codePoint: number): bool {
  if(codePoint >= 0x600 && codePoint <= 0x6ff) return true;
  if(codePoint >= 0x0750 && codePoint <= 0x077F) return true;
  if(codePoint >= 0x08A0 && codePoint <= 0x08FF) return true;
  if(codePoint >= 0xFB50 && codePoint <= 0xFDFF) return true;
  if(codePoint >= 0xFE70 && codePoint <= 0xFEFF) return true;
  if(codePoint >= 0x10E60 && codePoint <= 0x10E7F) return true;
  if(codePoint >= 0x1EE00 && codePoint <= 0x1EEFF) return true;
  return false;
}

export function hasArabic(s: string): bool { 
  for(let i = 0; i < s.length; i++) {
    let codePoint = s.codePointAt(i);
    if(isArabic(codePoint)) return true;
  } 
  return false;
}

export function onlyArabic(s: string): bool {
  for(let i = 0; i < getLength(s); i++) {
    let codePoint = s.codePointAt(i);
    if(!isArabic(codePoint)) return false;
  } 
  return true;
}