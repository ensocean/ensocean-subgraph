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
  
import { Domain, DomainEvent, Tag } from "../generated/schema"

import {  concat, createEventID, uint256ToByteArray, byteArrayFromHex, MAX_BYTE_LENGTH, ROOT_NODE, EMPTY_ADDRESS, EMPTY_NODE, BIG_INT_ZERO, hasDigit, hasEmoji, hasUnicode, onlyLetter, onlyDigit, onlyEmoji, onlyUnicode } from "./utils"
import { getLength, getSegmentLength, hasLetter, hasDigit, hasEmoji, hasUnicode, onlyDigit, onlyEmoji, onlyLetter, onlyUnicode, createUniqueID } from './utils'
 
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

  const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
  if(!labelHash.equals(label)) {
    log.warning(
      "Expected '{}' to hash to {}, but got {} instead. Skipping.",
      [name, labelHash.toHex(), label.toHex()]
    );
    return;
  }

  if(name.indexOf(".") !== -1) {
    log.warning("Invalid label '{}'. Skipping.", [name]);
    return;
  }

  //let domain = Domain.load(crypto.keccak256(concat(ROOT_NODE, label)).toHex())!
  let domain = getDomainByLabel(label, blockTimestamp)!
  if(domain.label !== name) {
    domain.label = name
    domain.name = name + '.eth' 
  }

  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires
  saveDomain(domain, event)
    
  // TODO: add tags to the domain
  // TODO: add category name to tags 
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

  const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
  if(!labelHash.equals(label)) {
    log.warning(
      "Expected '{}' to hash to {}, but got {} instead. Skipping.",
      [name, labelHash.toHex(), label.toHex()]
    );
    return;
  }

  if(name.indexOf(".") !== -1) {
    log.warning("Invalid label '{}'. Skipping.", [name]);
    return;
  }

  //let domain = Domain.load(crypto.keccak256(concat(ROOT_NODE, label)).toHex())!
  let domain = getDomainByLabel(label, blockTimestamp)!
  if(domain.label !== name) {
    domain.label = name
    domain.name = name + '.eth' 
  }

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

  const labelHash = crypto.keccak256(ByteArray.fromUTF8(name));
  if(!labelHash.equals(label)) {
    log.warning(
      "Expected '{}' to hash to {}, but got {} instead. Skipping.",
      [name, labelHash.toHex(), label.toHex()]
    );
    return;
  }

  if(name.indexOf(".") !== -1) {
    log.warning("Invalid label '{}'. Skipping.", [name]);
    return;
  }

  //let domain = Domain.load(crypto.keccak256(concat(ROOT_NODE, label)).toHex())!
  let domain = getDomainByLabel(label, blockTimestamp)!
  if(domain.label !== name) {
    domain.label = name
    domain.name = name + '.eth' 
  }
  
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
  //let domain = getDomainByNode(label.toHex())!
  //let domain = Domain.load(crypto.keccak256(concat(ROOT_NODE, label)).toHex())!
  let domain = getDomainByLabel(label, blockTimestamp)!
  // TODO: burda domaini boyle almak gerekebilir. eski eventlerde node kayıt ediliyordu.
 
  domain.registrant = owner.toHexString()
  domain.registered = blockTimestamp
  domain.expires = expires
   
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
  //let domain = getDomainByNode(label.toHex())!
  //let domain = Domain.load(crypto.keccak256(concat(ROOT_NODE, label)).toHex())!
  let domain = getDomainByLabel(label, blockTimestamp)!
  // TODO: burda domaini boyle almak gerekebilir. eski eventlerde node kayıt ediliyordu.

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

export function handleNameTransferredByRegistrar(event: NameTransferredByRegistrar): void {
  
  let tokenId = event.params.tokenId
  let from = event.params.from
  let to = event.params.to
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  let label = uint256ToByteArray(tokenId)
  //let domain = getDomainByNode(label.toHex())
  //let domain = Domain.load(crypto.keccak256(concat(ROOT_NODE, label)).toHex())!
  let domain = getDomainByLabel(label, blockTimestamp)!
  // TODO: burda domaini boyle almak gerekebilir. eski eventlerde node kayıt ediliyordu.

  if(domain == null) return;

  domain.registrant = to.toHexString()
  saveDomain(domain, event)

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "Transfer"
  domainEvent.from = from.toHexString()
  domainEvent.to = to.toHexString()
  domainEvent.save()  
}
 
export function handleTransferByRegistry(event: NameTransferredByRegistry): void {
  let node = event.params.node
  let owner = event.params.owner 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let domain = getDomainByNode(node.toHexString(), blockTimestamp)!
  domain.owner = owner.toHexString()
  saveDomain(domain, event)

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "Transfer"
  domainEvent.from = EMPTY_ADDRESS
  domainEvent.to = owner.toHex()
  domainEvent.save()  
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
  
  let subnode = makeSubnode(event)
  let domain = getDomainByNode(subnode, blockTimestamp);
  let parent = getDomainByNode(node.toHexString())

  if (domain === null) {
    domain = new Domain(subnode)
    domain.created = blockTimestamp
  }
  
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
      parent = parent!
      let name = parent.name
      if (label && name ) {
        domain.name = label + '.'  + name
      }
    }
  }
 
  domain.owner = owner.toHexString()
  domain.hash = hash
  saveDomain(domain, event)
 
  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "NewOwner"
  domainEvent.from = EMPTY_ADDRESS
  domainEvent.to = owner.toHex()
  domainEvent.save() 
} 

function saveDomain(domain: Domain, event: ethereum.Event): void {
  if(domain != null) {
    if(domain.label != null) {
      domain.length = getLength(domain.label!)
      domain.segmentLength = getSegmentLength(domain.label!)
      
      let tags = domain.tags;
      if(tags == null) tags = new Array<string>();
      
      if(hasLetter(domain.label!) && !tags.includes("has_letter")) {
        tags.push("has_letter")
      }

      if(onlyLetter(domain.label!) && !tags.includes("only_letter")) {
        tags.push("only_letter")
      }

      if(hasDigit(domain.label!) && !tags.includes("has_digit")) {
        tags.push("has_digit")
      }
    
      if(onlyDigit(domain.label!) && !tags.includes("only_digit")) {
        tags.push("only_digit")
      }
       
      if(hasEmoji(domain.label!) && !tags.includes("has_emoji")) {
        tags.push("has_emoji")
      }
    
      if(onlyEmoji(domain.label!) && !tags.includes("only_emoji")) {
        tags.push("only_emoji")
      }
    
      if(hasUnicode(domain.label!) && !tags.includes("has_unicode")) {
        tags.push("has_unicode")
      }
    
      if(onlyUnicode(domain.label!) && !tags.includes("only_unicode")) {
        tags.push("only_unicode")
      }

      domain.tags = tags;
    }
    domain.save()
  }
}
 
function createDomainByNode(node: string, timestamp: BigInt): Domain {
  let domain = new Domain(node) 
  domain = new Domain(node)
  domain.created = timestamp 
  return domain
}

function getDomainByNode(node: string, timestamp: BigInt = BIG_INT_ZERO): Domain | null {
  let domain = Domain.load(node)
  if(domain == null) {
    return createDomainByNode(node, timestamp)
  }else{
    return domain
  }
}
 
function getDomainByLabel(label: ByteArray, timestamp: BigInt = BIG_INT_ZERO): Domain | null {
  let node = crypto.keccak256(concat(ROOT_NODE, label)).toHex()
  let domain = Domain.load(node)
  if(domain == null) {
    return createDomainByNode(node, timestamp)
  }else{
    return domain
  }
}

function createTag(id: string): Tag {
  let tag = new Tag(id)
  tag.save()
  return tag
}

function getTag(id: string): Tag {
  let tag = Tag.load(id)
  if(tag == null) {
    return createTag(id)
  } else {
    return tag
  }
}