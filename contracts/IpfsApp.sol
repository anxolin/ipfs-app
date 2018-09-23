pragma solidity ^0.4.23;

contract IpfsApp {
  IpfsHash public ipfsHash;
  uint public version;

  struct IpfsHash {
    uint8 hashFunction;
    uint size;
    bytes32 hash;
  }

  function updateIpfsHash (uint8 hashFunction, uint size, bytes32 newHash, uint currentVersion) public {
    require(currentVersion == version, "Only last version of the app can be update");

    // Incremnt version
    version++;
    ipfsHash = IpfsHash(hashFunction, size, newHash);
    emit UpdatedIpfsHash(hashFunction, size, newHash, currentVersion);
  }

  // TODO: Not sure is now struts are supported so this method is not needed
  function getIpfsHash ()
  public
  view
  returns(uint8 hashFunction, uint size, bytes32 hash){
    return (ipfsHash.hashFunction, ipfsHash.size, ipfsHash.hash);
  }

  event UpdatedIpfsHash(
    uint8 hashFunction,
    uint size,
    bytes32 hash,
    uint indexed version
  );
}