// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20 ("TestTokenGnosis", "TTG"){
        _mint(msg.sender, 1000*10**18);
    } 
}
