pragma solidity ^0.8.15;

import {ERC1967Proxy} from "../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract HausCatalogueManager {
  address public immutable catalogueImpl;

  event HausCatalogueDeployed(address proxyAddress);

  constructor(
    address _catalogueImpl,
    string memory _name,
    string memory _symbol,
    address _owner
  ) {
    catalogueImpl = _catalogueImpl;

    address managerProxy;
    managerProxy = address(
      new ERC1967Proxy(address(catalogueImpl), abi.encodeWithSignature("initialize(string,string)", _name, _symbol, _owner))
    );
    emit HausCatalogueDeployed(managerProxy);
  }
}
