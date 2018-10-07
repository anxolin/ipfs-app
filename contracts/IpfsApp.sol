pragma solidity ^0.4.24;

contract IpfsApp {
    mapping (address => IpfsHash) public ipfsHashes;
    mapping (address => uint) public versions;

    struct IpfsHash {
        uint8 hashFunction;
        uint size;
        bytes32 hash;
    }

    function updateIpfsHash (uint8 hashFunction, uint size, bytes32 newHash, uint currentVersion) public {
        uint version = versions[msg.sender];
        require(currentVersion == version, "Only last version of the app can be update");

        // Incremnt version
        versions[msg.sender] = version + 1;
        ipfsHashes[msg.sender] = IpfsHash(hashFunction, size, newHash);
        emit UpdatedIpfsHash(msg.sender, hashFunction, size, newHash, currentVersion);
    }

    // // TODO: Not sure is now struts are supported so this method is not needed
    // function getIpfsHash (address user)
    // public
    // view
    // returns(uint8 hashFunction, uint size, bytes32 hash) {
    //   IpfsHash ipfsHash = ipfsHashes[user]
    //   return (ipfsHash.hashFunction, ipfsHash.size, ipfsHash.hash);
    // }

    event UpdatedIpfsHash(
        address indexed user,
        uint8 hashFunction,
        uint size,
        bytes32 hash,
        uint indexed version
    );
}