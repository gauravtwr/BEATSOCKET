 pragma solidity ^0.8.5;

contract sendmoney{
    uint public balanceReceived;
    
    function receiveMoney() public payable
    {
        balanceReceived += msg.value;
    }
    
    function getBalance() public view returns(uint) 
    {
        return address(this).balance;
    }
    
    function withdrawMoneyTo(address payable _to) public 
    {
        _to.transfer(this.getBalance());
    }
    
    
}