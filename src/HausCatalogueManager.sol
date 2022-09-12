pragma solidity ^0.8.15;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract HausCatalogueManager is OwnableUpgradeable, UUPSUpgradeable {
  address public immutable catalogueImpl;

  event HausCatalogueDeployed(address proxyAddress);

  constructor(
    address _catalogueImpl,
    string memory _name,
    string memory _symbol
  ) {
    catalogueImpl = _catalogueImpl;
    address managerProxy;
    managerProxy = address(
      new ERC1967Proxy(address(catalogueImpl), abi.encodeWithSignature("LucidHaus Catalogue", "LUCID"))
    );
    emit HausCatalogueDeployed(managerProxy);
  }
}
