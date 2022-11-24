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
 
export function handleNameRegisteredByControllerOld(event: NameRegisteredByControllerOld): void {
  
  let cost = event.params.cost 
  let expires = event.params.expires
  let label = event.params.label
  let name = event.params.name
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
 
  let domain = getDomainByLabel(label, blockTimestamp)
 
  domain.label = name
  domain.name = name + '.eth'
 

  domain.hash = label
  domain.owner = owner.toHexString()
  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires
  saveDomain(domain, event)
}
 

export function handleNameRegisteredByController(event: NameRegisteredByController): void {
   
  let baseCost = event.params.baseCost
  let premium = event.params.premium 
  let cost = event.params.baseCost.plus(event.params.premium)
  let expires = event.params.expires
  let label = event.params.label
  let name = event.params.name
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  //const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
   
  let domain = getDomainByLabel(label, blockTimestamp)
   
  domain.label = name
  domain.name = name + '.eth' 
   
  domain.hash = label
  domain.owner = owner.toHexString()
  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires
  saveDomain(domain, event) 
}

export function handleNameRenewedByController(event: NameRenewedByController): void {
   
  let cost = event.params.cost
  let expires = event.params.expires
  let label = event.params.label
  let name = event.params.name
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  //const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
    
  let domain = getDomainByLabel(label, blockTimestamp)
  domain.label = name
  domain.name = name + '.eth' 
  domain.hash = label
  domain.expires = expires
  saveDomain(domain, event)
}
   

export function handleNameRegisteredByRegistrar(event: NameRegisteredByRegistrar): void {

  let tokenId = event.params.id
  let expires = event.params.expires
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
 
  let label = uint256ToByteArray(tokenId) 
  let domain = getDomainByLabel(label, blockTimestamp)
  
  domain.owner = owner.toHexString()
  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires
  domain.hash = Bytes.fromByteArray(label)
   
  let labelName = ens.nameByHash(label.toHexString())
  if (labelName != null) {
    domain.label = labelName  
  }

  saveDomain(domain, event)

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "Register" 
  domainEvent.from = EMPTY_ADDRESS
  domainEvent.to = owner.toHexString()
  domainEvent.expires = expires
  domainEvent.save()  
}

export function handleNameRenewedByRegistrar(event: NameRenewedByRegistrar): void {

  let tokenId = event.params.id
  let expires = event.params.expires
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let label = uint256ToByteArray(tokenId) 
  let domain = getDomainByLabel(label, blockTimestamp)

  domain.expires = expires
  domain.hash = Bytes.fromByteArray(label)
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

export function handleNameTransferredByRegistrar(event: NameTransferredByRegistrar): void {
  
  let tokenId = event.params.tokenId
  let from = event.params.from
  let to = event.params.to
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  let label = uint256ToByteArray(tokenId) 
  let domain = getDomainByLabel(label, blockTimestamp) 

  domain.owner = to.toHexString()
  domain.hash = Bytes.fromByteArray(label)
  saveDomain(domain, event)

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.from = from.toHexString()
  domainEvent.to = to.toHexString()
  

  if(from.toHexString() == EMPTY_ADDRESS) {
    domainEvent.name = "Mint";
  } else if(to.toHexString() == EMPTY_ADDRESS) {
    domainEvent.name = "Burn";
  } else {
    domainEvent.name = "Transfer";
  }
  
  domainEvent.save() 
}
 
export function handleTransferByRegistry(event: NameTransferredByRegistry): void {
  let node = event.params.node
  let owner = event.params.owner 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let domain = getDomainByNode(node, blockTimestamp)
  domain.owner = owner.toHex()
  saveDomain(domain, event)

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
  
  let subnode = Bytes.fromByteArray(crypto.keccak256(concat(node, hash)))
  let domain = getDomainByNode(subnode, blockTimestamp)
  let parent = getDomainByNode(node, blockTimestamp)
 
  if(domain.name == null) { 
    let label = ens.nameByHash(hash.toHexString())
    
    if (label != null) {
      domain.label = label
    }

    if(label === null) {
      label = '[' + hash .toHexString().slice(2) + ']'
    }

    if(node.toHexString() == '0x0000000000000000000000000000000000000000000000000000000000000000') {
      domain.name = label
    } else {
      let name = parent.name
      if (label && name ) {
        domain.name = label + '.'  + name
      }
    }
  }
 
  domain.owner = owner.toHex()
  domain.hash = hash
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
 
function createDomainByNode(node: Bytes, timestamp: BigInt): Domain {
  let domain = new Domain(node)  
  domain.created = timestamp 
  return domain
}

function getDomainByNode(node: Bytes, timestamp: BigInt): Domain {
  let domain = Domain.load(node)
  if(domain == null) {
    return createDomainByNode(node, timestamp)
  }else{
    return domain
  }
}
 
function getDomainByLabel(label: ByteArray, timestamp: BigInt): Domain {
  let node = Bytes.fromByteArray(crypto.keccak256(concat(ROOT_NODE, label)))
  let domain = getDomainByNode(node, timestamp)
  if(domain == null) {
    return createDomainByNode(node, timestamp)
  }else{
    return domain
  }
}