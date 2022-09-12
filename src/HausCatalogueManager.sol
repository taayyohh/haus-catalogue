pragma solidity ^0.8.15;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC1967Proxy} from "../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

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
      new ERC1967Proxy(address(catalogueImpl), abi.encodeWithSignature("initialize(string,string)", _name, _symbol))
    );
    emit HausCatalogueDeployed(managerProxy);
  }

  ///                                                          ///
  ///                         MANAGER UPGRADE                  ///
  ///                                                          ///

  /// @notice Ensures the caller is the Builder DAO
  /// @dev This function is called in `upgradeTo` & `upgradeToAndCall`
  /// @param _newImpl The new implementation address
  function _authorizeUpgrade(address _newImpl) internal override onlyOwner {}
}
