pragma solidity ^0.5.16;

contract hashid {
    
    function hash (string memory _text, uint _num, address _addr)
    public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(_text, _num, _addr));
    }
}

contract gano{
    bytes32 public value = 0xa477d97b122e6356d32a064f9ee824230d42d04c7d66d8e7d125a091a42b0b25;
    
    function compare(string memory id) public view returns(bool){
        
        return keccak256(abi.encodePacked(id)) == value;
    }
}
