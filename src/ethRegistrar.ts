import { 
  BigInt, 
  ByteArray,
  Bytes,
  crypto, 
  log,
  ens,
  ethereum
} from "@graphprotocol/graph-ts"

import { 
  NameRegistered as NameRegisteredByControllerOld,
  NameRenewed as NameRenewedByControllerOld
} from "../generated/ETHRegistrarControllerOld/ETHRegistrarControllerOld"

import { 
  NameRegistered as NameRegisteredByController,
  NameRenewed as NameRenewedByController
} from "../generated/ETHRegistrarController/ETHRegistrarController"

import { 
  NameRegistered as NameRegisteredByRegistrar,
  NameRenewed as NameRenewedByRegistrar,
  Transfer as NameTransferredByRegistrar
} from "../generated/BaseRegistrarImplementation/BaseRegistrarImplementation"

import {  
  NewOwner as NameNewOwnerByRegistry,
  Transfer as NameTransferredByRegistry
} from "../generated/ENSRegistryWithFallback/ENSRegistryWithFallback"

import {  
  NewOwner as NameNewOwnerByRegistryOld,
  Transfer as NameTransferredByRegistryOld
} from "../generated/ENSRegistryWithFallbackOld/ENSRegistryWithFallback"
  
import { Domain, DomainEvent } from "../generated/schema"

import {  concat, createEventID, uint256ToByteArray, byteArrayFromHex, MAX_BYTE_LENGTH, ROOT_NODE, EMPTY_ADDRESS, EMPTY_NODE, BIG_INT_ZERO, hasDigit, hasEmoji, hasUnicode, onlyLetter, onlyDigit, onlyEmoji, onlyUnicode, getLength, getSegmentLength, hasLetter, isPalindrome, hasArabic, onlyArabic } from "./utils"
 
function checkByteLength(name: string): boolean {
  let byteLength = Bytes.fromUTF8(name).byteLength
  if( byteLength <= MAX_BYTE_LENGTH) { 
    return true
  }
  return false
}
  
function makeSubnode(event:NameNewOwnerByRegistry): string {
  return crypto.keccak256(concat(event.params.node, event.params.label)).toHexString()
}
  
export function handleNameRegisteredByController(event: NameRegisteredByController): void {
    
  let expires = event.params.expires
  let hash = event.params.label
  let name = event.params.name
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  //const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
   
  let domain = getDomainByLabelHash(hash, blockTimestamp) 
  domain.label = name  
  domain.owner = owner.toHexString()
  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires
  saveDomain(domain, event) 

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "Register" 
  domainEvent.expires = expires
  domainEvent.save()  
}

export function handleNameRenewedByController(event: NameRenewedByController): void {
   
  let cost = event.params.cost
  let expires = event.params.expires
  let hash = event.params.label
  let name = event.params.name
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  //const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
    
  let domain = getDomainByLabelHash(hash, blockTimestamp)
  domain.label = name  
  domain.expires = expires
  saveDomain(domain, event)

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "Renew" 
  domainEvent.expires = expires
  domainEvent.save()  
}
   

export function handleNameRegisteredByRegistrar(event: NameRegisteredByRegistrar): void {

  let tokenId = event.params.id
  let expires = event.params.expires
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
 
  let label = uint256ToByteArray(tokenId) 
  let hash = Bytes.fromByteArray(label)
  let domain = getDomainByLabelHash(hash, blockTimestamp)
  
  domain.owner = owner.toHexString()
  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires 

  let labelName = ens.nameByHash(hash.toHexString())
  if (labelName !== null) { 
    domain.label = labelName  
  }

  saveDomain(domain, event)

  //let domainEvent = new DomainEvent(createEventID(event))
  //domainEvent.domain = domain.id
  //domainEvent.blockNumber = blockNumber.toI32()
  //domainEvent.transactionID = transactionHash
  //domainEvent.blockTimestamp = blockTimestamp
  //domainEvent.name = "Register" 
  //domainEvent.from = EMPTY_ADDRESS
  //domainEvent.to = owner.toHexString()
  //domainEvent.expires = expires
  //domainEvent.save()  
}

export function handleNameRenewedByRegistrar(event: NameRenewedByRegistrar): void {

  let tokenId = event.params.id
  let expires = event.params.expires
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let label = uint256ToByteArray(tokenId) 
  let hash = Bytes.fromByteArray(label)
  let domain = getDomainByLabelHash(hash, blockTimestamp)

  domain.expires = expires 
  saveDomain(domain, event)

  //let domainEvent = new DomainEvent(createEventID(event))
  //domainEvent.domain = domain.id
  //domainEvent.blockNumber = blockNumber.toI32()
  //domainEvent.transactionID = transactionHash
  //domainEvent.blockTimestamp = blockTimestamp
  //domainEvent.name = "Renew" 
  //domainEvent.expires = expires
  //domainEvent.save()  
}

export function handleNameTransferredByRegistrar(event: NameTransferredByRegistrar): void {
  
  let tokenId = event.params.tokenId
  let from = event.params.from
  let to = event.params.to
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  let label = uint256ToByteArray(tokenId) 
  let hash = Bytes.fromByteArray(label)
  let domain = getDomainByLabelHash(hash, blockTimestamp) 

  domain.owner = to.toHexString() 
  saveDomain(domain, event)

  //let domainEvent = new DomainEvent(createEventID(event))
  //domainEvent.domain = domain.id
  //domainEvent.blockNumber = blockNumber.toI32()
  //domainEvent.transactionID = transactionHash
  //domainEvent.blockTimestamp = blockTimestamp
  //domainEvent.from = from.toHexString()
  //domainEvent.to = to.toHexString()
  

  //if(from.toHexString() == EMPTY_ADDRESS) {
  //  domainEvent.name = "Mint";
  //} else if(to.toHexString() == EMPTY_ADDRESS) {
  //  domainEvent.name = "Burn";
  //} else {
  //  domainEvent.name = "Transfer";
  //}
  
  //domainEvent.save() 
}
 
export function handleTransferByRegistry(event: NameTransferredByRegistry): void {
  let node = event.params.node
  let owner = event.params.owner 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  //let domain = getDomainByLabelHash(node, blockTimestamp)
  //domain.owner = owner.toHex()
  //saveDomain(domain, event)

  //let domainEvent = new DomainEvent(createEventID(event))
  //domainEvent.domain = domain.id
  //domainEvent.blockNumber = blockNumber.toI32()
  //domainEvent.transactionID = transactionHash
  //domainEvent.blockTimestamp = blockTimestamp
  //domainEvent.name = "Transfer"
  //domainEvent.from = EMPTY_ADDRESS
  //domainEvent.to = owner.toHex()
  //domainEvent.save()  
} 

export function handleNewOwnerByRegistry(event: NameNewOwnerByRegistry): void { 
  _handleNewOwner(event)
} 

export function handleTransferByRegistryOld(event: NameTransferredByRegistry): void { 
  handleTransferByRegistry(event)
} 

export function handleNewOwnerByRegistryOld(event: NameNewOwnerByRegistry): void { 
  _handleNewOwner(event)
} 

function _handleNewOwner(event: NameNewOwnerByRegistry): void {
  let node = event.params.node
  let owner = event.params.owner
  let hash = event.params.label 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let domain = getDomainByLabelHash(hash, blockTimestamp)
 
  if(domain.label === null) { 
    let label = ens.nameByHash(hash.toHexString())
    
    if (label != null) {
      domain.label = label
    }
    
    if(label === null) {
      label = '[' + hash .toHexString().slice(2) + ']'
    } 
  }
 
  domain.owner = owner.toHex() 
  saveDomain(domain, event)
 
  //let domainEvent = new DomainEvent(createEventID(event))
  //domainEvent.domain = domain.id
  //domainEvent.blockNumber = blockNumber.toI32()
  //domainEvent.transactionID = transactionHash
  //domainEvent.blockTimestamp = blockTimestamp
  //domainEvent.name = "NewOwner"
  //domainEvent.from = EMPTY_ADDRESS
  //domainEvent.to = owner.toHex()
  //domainEvent.save()
} 

function saveDomain(domain: Domain, event: ethereum.Event): void {
  if(domain != null ) {  
      if(domain.label != null) {
        if(!checkByteLength(domain.label!)) return;
  
        log.warning("label: {} ", [domain.label!]);
  
        domain.length = getLength(domain.label!)
        domain.segmentLength = getSegmentLength(domain.label!)

        if(domain.length > 1000) return;
        
        let tags = domain.tags;
        if(tags == null) tags = new Array<string>();
        
        if(hasLetter(domain.label!) && !tags.includes("include-letter")) {
          tags.push("include-letter")
        }
  
        if(onlyLetter(domain.label!) && !tags.includes("only-letter")) {
          tags.push("only-letter")
        }
  
        if(hasDigit(domain.label!) && !tags.includes("include-digit")) {
          tags.push("include-digit")
        }
      
        if(onlyDigit(domain.label!) && !tags.includes("only-digit")) {
          tags.push("only-digit")
        }
        
        if(hasEmoji(domain.label!) && !tags.includes("include-emoji")) {
          tags.push("include-emoji")
        }
      
        if(onlyEmoji(domain.label!) && !tags.includes("only-emoji")) {
          tags.push("only-emoji")
        }
      
        if(hasUnicode(domain.label!) && !tags.includes("include-unicode")) {
          tags.push("include-unicode")
        }
      
        if(onlyUnicode(domain.label!) && !tags.includes("only-unicode")) {
          tags.push("only-unicode")
        }
  
        if(isPalindrome(domain.label!) && !tags.includes("palindrome")) {
          tags.push("palindrome")
        }
  
        if(hasArabic(domain.label!) && !tags.includes("include-arabic")) {
          tags.push("include-arabic")
        }
      
        if(onlyArabic(domain.label!) && !tags.includes("only-arabic")) {
          tags.push("only-arabic")
        }
  
        domain.tags = tags; 
      }  
      domain.extension = "eth"
      domain.save() 
  }
}
   
function getDomainByLabelHash(label: Bytes, timestamp: BigInt): Domain {
  let domain = Domain.load(label)
  if(domain === null) {
    return createDomainByLabelHash(label, timestamp)
  }else{
    return domain
  }
}

function createDomainByLabelHash(label: Bytes, timestamp: BigInt): Domain {
  let domain = new Domain(label)  
  domain.created = timestamp 
  return domain
}