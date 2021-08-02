pragma solidity ^0.6.0;

//enums basic
// contract MyContract{
//     enum STATE {INACTIVE, ACTIVE, VACATION} // by convention capital letter
//     STATE state;
//     STATE constant defaultState = STATE.INACTIVE;
    
//     function setToActive() external{
//         state= STATE.ACTIVE;
//     }
//     function getState() external view returns(STATE){
//         return state;
//     }
//     function getDefaultState() public pure returns(uint){
//         return uint(defaultState);
//     }
//     function setState(STATE _state) external{
//         state=_state;
//     }
// }


//enums with struct
contract MyContract{
    enum STATE {INACTIVE, ACTIVE, VACATION} // by convention capital letter
    STATE constant defaultState = STATE.INACTIVE;
    
    struct User{
        address addr;
        STATE state;
    }
    User[] users;
    function enter() external{
        User memory user1=User(msg.sender,STATE.ACTIVE);
        users.push(user1);
    }
    function getInfo() external view returns(User memory){
        User memory tempUser=users[0];
        return tempUser;
    }
}
