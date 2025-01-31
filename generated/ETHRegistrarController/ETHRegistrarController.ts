// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class NameRegistered extends ethereum.Event {
  get params(): NameRegistered__Params {
    return new NameRegistered__Params(this);
  }
}

export class NameRegistered__Params {
  _event: NameRegistered;

  constructor(event: NameRegistered) {
    this._event = event;
  }

  get name(): string {
    return this._event.parameters[0].value.toString();
  }

  get label(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get owner(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get cost(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get expires(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class NameRenewed extends ethereum.Event {
  get params(): NameRenewed__Params {
    return new NameRenewed__Params(this);
  }
}

export class NameRenewed__Params {
  _event: NameRenewed;

  constructor(event: NameRenewed) {
    this._event = event;
  }

  get name(): string {
    return this._event.parameters[0].value.toString();
  }

  get label(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get cost(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get expires(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class NewPriceOracle extends ethereum.Event {
  get params(): NewPriceOracle__Params {
    return new NewPriceOracle__Params(this);
  }
}

export class NewPriceOracle__Params {
  _event: NewPriceOracle;

  constructor(event: NewPriceOracle) {
    this._event = event;
  }

  get oracle(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class EthRegistrarController extends ethereum.SmartContract {
  static bind(address: Address): EthRegistrarController {
    return new EthRegistrarController("EthRegistrarController", address);
  }

  MIN_REGISTRATION_DURATION(): BigInt {
    let result = super.call(
      "MIN_REGISTRATION_DURATION",
      "MIN_REGISTRATION_DURATION():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_MIN_REGISTRATION_DURATION(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "MIN_REGISTRATION_DURATION",
      "MIN_REGISTRATION_DURATION():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  available(name: string): boolean {
    let result = super.call("available", "available(string):(bool)", [
      ethereum.Value.fromString(name),
    ]);

    return result[0].toBoolean();
  }

  try_available(name: string): ethereum.CallResult<boolean> {
    let result = super.tryCall("available", "available(string):(bool)", [
      ethereum.Value.fromString(name),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  commitments(param0: Bytes): BigInt {
    let result = super.call("commitments", "commitments(bytes32):(uint256)", [
      ethereum.Value.fromFixedBytes(param0),
    ]);

    return result[0].toBigInt();
  }

  try_commitments(param0: Bytes): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "commitments",
      "commitments(bytes32):(uint256)",
      [ethereum.Value.fromFixedBytes(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isOwner(): boolean {
    let result = super.call("isOwner", "isOwner():(bool)", []);

    return result[0].toBoolean();
  }

  try_isOwner(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isOwner", "isOwner():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  makeCommitment(name: string, owner: Address, secret: Bytes): Bytes {
    let result = super.call(
      "makeCommitment",
      "makeCommitment(string,address,bytes32):(bytes32)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromFixedBytes(secret),
      ],
    );

    return result[0].toBytes();
  }

  try_makeCommitment(
    name: string,
    owner: Address,
    secret: Bytes,
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "makeCommitment",
      "makeCommitment(string,address,bytes32):(bytes32)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromFixedBytes(secret),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  makeCommitmentWithConfig(
    name: string,
    owner: Address,
    secret: Bytes,
    resolver: Address,
    addr: Address,
  ): Bytes {
    let result = super.call(
      "makeCommitmentWithConfig",
      "makeCommitmentWithConfig(string,address,bytes32,address,address):(bytes32)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromFixedBytes(secret),
        ethereum.Value.fromAddress(resolver),
        ethereum.Value.fromAddress(addr),
      ],
    );

    return result[0].toBytes();
  }

  try_makeCommitmentWithConfig(
    name: string,
    owner: Address,
    secret: Bytes,
    resolver: Address,
    addr: Address,
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "makeCommitmentWithConfig",
      "makeCommitmentWithConfig(string,address,bytes32,address,address):(bytes32)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromFixedBytes(secret),
        ethereum.Value.fromAddress(resolver),
        ethereum.Value.fromAddress(addr),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  maxCommitmentAge(): BigInt {
    let result = super.call(
      "maxCommitmentAge",
      "maxCommitmentAge():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_maxCommitmentAge(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "maxCommitmentAge",
      "maxCommitmentAge():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minCommitmentAge(): BigInt {
    let result = super.call(
      "minCommitmentAge",
      "minCommitmentAge():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_minCommitmentAge(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "minCommitmentAge",
      "minCommitmentAge():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  rentPrice(name: string, duration: BigInt): BigInt {
    let result = super.call(
      "rentPrice",
      "rentPrice(string,uint256):(uint256)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromUnsignedBigInt(duration),
      ],
    );

    return result[0].toBigInt();
  }

  try_rentPrice(name: string, duration: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "rentPrice",
      "rentPrice(string,uint256):(uint256)",
      [
        ethereum.Value.fromString(name),
        ethereum.Value.fromUnsignedBigInt(duration),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  supportsInterface(interfaceID: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceID)],
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceID: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceID)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  valid(name: string): boolean {
    let result = super.call("valid", "valid(string):(bool)", [
      ethereum.Value.fromString(name),
    ]);

    return result[0].toBoolean();
  }

  try_valid(name: string): ethereum.CallResult<boolean> {
    let result = super.tryCall("valid", "valid(string):(bool)", [
      ethereum.Value.fromString(name),
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _base(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _prices(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _minCommitmentAge(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _maxCommitmentAge(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CommitCall extends ethereum.Call {
  get inputs(): CommitCall__Inputs {
    return new CommitCall__Inputs(this);
  }

  get outputs(): CommitCall__Outputs {
    return new CommitCall__Outputs(this);
  }
}

export class CommitCall__Inputs {
  _call: CommitCall;

  constructor(call: CommitCall) {
    this._call = call;
  }

  get commitment(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class CommitCall__Outputs {
  _call: CommitCall;

  constructor(call: CommitCall) {
    this._call = call;
  }
}

export class RegisterCall extends ethereum.Call {
  get inputs(): RegisterCall__Inputs {
    return new RegisterCall__Inputs(this);
  }

  get outputs(): RegisterCall__Outputs {
    return new RegisterCall__Outputs(this);
  }
}

export class RegisterCall__Inputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get owner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get duration(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get secret(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class RegisterCall__Outputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }
}

export class RegisterWithConfigCall extends ethereum.Call {
  get inputs(): RegisterWithConfigCall__Inputs {
    return new RegisterWithConfigCall__Inputs(this);
  }

  get outputs(): RegisterWithConfigCall__Outputs {
    return new RegisterWithConfigCall__Outputs(this);
  }
}

export class RegisterWithConfigCall__Inputs {
  _call: RegisterWithConfigCall;

  constructor(call: RegisterWithConfigCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get owner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get duration(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get secret(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get resolver(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get addr(): Address {
    return this._call.inputValues[5].value.toAddress();
  }
}

export class RegisterWithConfigCall__Outputs {
  _call: RegisterWithConfigCall;

  constructor(call: RegisterWithConfigCall) {
    this._call = call;
  }
}

export class RenewCall extends ethereum.Call {
  get inputs(): RenewCall__Inputs {
    return new RenewCall__Inputs(this);
  }

  get outputs(): RenewCall__Outputs {
    return new RenewCall__Outputs(this);
  }
}

export class RenewCall__Inputs {
  _call: RenewCall;

  constructor(call: RenewCall) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get duration(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RenewCall__Outputs {
  _call: RenewCall;

  constructor(call: RenewCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetCommitmentAgesCall extends ethereum.Call {
  get inputs(): SetCommitmentAgesCall__Inputs {
    return new SetCommitmentAgesCall__Inputs(this);
  }

  get outputs(): SetCommitmentAgesCall__Outputs {
    return new SetCommitmentAgesCall__Outputs(this);
  }
}

export class SetCommitmentAgesCall__Inputs {
  _call: SetCommitmentAgesCall;

  constructor(call: SetCommitmentAgesCall) {
    this._call = call;
  }

  get _minCommitmentAge(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _maxCommitmentAge(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetCommitmentAgesCall__Outputs {
  _call: SetCommitmentAgesCall;

  constructor(call: SetCommitmentAgesCall) {
    this._call = call;
  }
}

export class SetPriceOracleCall extends ethereum.Call {
  get inputs(): SetPriceOracleCall__Inputs {
    return new SetPriceOracleCall__Inputs(this);
  }

  get outputs(): SetPriceOracleCall__Outputs {
    return new SetPriceOracleCall__Outputs(this);
  }
}

export class SetPriceOracleCall__Inputs {
  _call: SetPriceOracleCall;

  constructor(call: SetPriceOracleCall) {
    this._call = call;
  }

  get _prices(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPriceOracleCall__Outputs {
  _call: SetPriceOracleCall;

  constructor(call: SetPriceOracleCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}
