// dto data transfer object

class UserDto{
    id;
    name;
    username;
    email;

    constructor(user){
        this.id = user._id;
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;
    }
}
module.exports = UserDto;